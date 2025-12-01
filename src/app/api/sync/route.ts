/**
 * Sync API Endpoint
 * Pulls data from Google Sheets and saves to Supabase
 * Protected by CRON_SECRET bearer token
 */

import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { supabaseAdmin } from '@/lib/supabase';
import type {
  LeadInsert,
  PreferredContact,
  BestOutreachTime,
  ApartmentPreference,
  Campaign,
} from '@/types/database';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60 seconds for sync

interface SyncResult {
  campaign: string;
  synced: number;
  skipped: number;
  error?: string;
}

/**
 * Verify the CRON_SECRET bearer token
 */
function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  return token === process.env.CRON_SECRET;
}

/**
 * Get Google Sheets client
 */
function getGoogleSheetsClient() {
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;

  if (!privateKey || !clientEmail) {
    throw new Error('Google Sheets credentials not configured');
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  return google.sheets({ version: 'v4', auth });
}

/**
 * Fetch rows from a Google Sheet
 */
async function fetchSheetRows(
  sheetId: string,
  sheetTab: string
): Promise<string[][]> {
  const sheets = getGoogleSheetsClient();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${sheetTab}!A:Z`,
  });

  return response.data.values || [];
}

/**
 * Parse and validate a date string to ISO timestamp
 */
function parseTimestamp(dateStr: string): string | null {
  if (!dateStr || dateStr.trim() === '') {
    return null;
  }

  try {
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) {
      return null;
    }
    return parsed.toISOString();
  } catch {
    return null;
  }
}

/**
 * Normalize phone number by removing spaces
 */
function normalizePhone(phone: string | undefined): string | null {
  if (!phone || phone.trim() === '') {
    return null;
  }
  return phone.replace(/\s+/g, '');
}

/**
 * Normalize last name - return null for placeholder values
 */
function normalizeLastName(lastName: string | undefined): string | null {
  if (!lastName || lastName.trim() === '') {
    return null;
  }

  const normalized = lastName.trim();
  const placeholders = ['not supplied', 'nosurname', 'n/a', 'na', '-', 'none'];

  if (placeholders.includes(normalized.toLowerCase())) {
    return null;
  }

  return normalized;
}

/**
 * Normalize preferred contact method
 */
function normalizePreferredContact(value: string | undefined): PreferredContact | null {
  if (!value || value.trim() === '') {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized.includes('whatsapp')) return 'WhatsApp';
  if (normalized.includes('email')) return 'Email';
  if (normalized.includes('phone') || normalized.includes('call')) return 'Phone Call';

  return null;
}

/**
 * Normalize best outreach time
 */
function normalizeBestOutreachTime(value: string | undefined): BestOutreachTime | null {
  if (!value || value.trim() === '') {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized.includes('morning')) return 'Morning';
  if (normalized.includes('afternoon')) return 'Afternoon';
  if (normalized.includes('evening')) return 'Evening';
  if (normalized.includes('anytime') || normalized.includes('any time')) return 'Anytime';

  return null;
}

/**
 * Normalize apartment preference
 */
function normalizeApartmentPreference(value: string | undefined): ApartmentPreference | null {
  if (!value || value.trim() === '') {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  // Studio (shared across campaigns)
  if (normalized.includes('studio')) return 'Studio Apartment';

  // The Aura specific types (check these first as they're more specific)
  if (normalized.includes('1 bedroom 1 bathroom') || normalized.includes('1 bed 1 bath')) {
    return '1 Bedroom 1 Bathroom Apartment';
  }
  if (normalized.includes('2 bedroom 2 bathroom') || normalized.includes('2 bed 2 bath')) {
    return '2 Bedroom 2 Bathroom Apartment';
  }
  if (normalized.includes('2 bedroom 1 bathroom') || normalized.includes('2 bed 1 bath')) {
    return '2 Bedroom 1 Bathroom Apartment';
  }

  // The Bolton specific types
  if (normalized.includes('1 bedroom penthouse') || normalized.includes('1-bedroom penthouse')) {
    return '1 Bedroom Penthouse';
  }
  if (normalized.includes('2 bedroom penthouse') || normalized.includes('2-bedroom penthouse')) {
    return '2 Bedroom Penthouse';
  }
  if (normalized.includes('1 bedroom apartment') || normalized.includes('1-bedroom apartment')) {
    return '1 Bedroom Apartment';
  }

  return null;
}

/**
 * Transform a sheet row to a lead insert object
 */
function transformRowToLead(
  headers: string[],
  row: string[],
  campaignId: string
): LeadInsert | null {
  // Create a map of header -> value
  const rowData: Record<string, string> = {};
  headers.forEach((header, index) => {
    rowData[header.toLowerCase().trim()] = row[index] || '';
  });

  // Extract required fields
  const email = rowData['email address']?.trim() || rowData['email']?.trim();
  const dateStamp = rowData['date and time stamp'] || rowData['timestamp'];

  // Skip rows with missing email
  if (!email || email === '') {
    return null;
  }

  // Parse and validate timestamp
  const submittedAt = parseTimestamp(dateStamp);
  if (!submittedAt) {
    return null;
  }

  // Build the lead object
  const lead: LeadInsert = {
    campaign_id: campaignId,
    first_name: rowData['first name']?.trim() || 'Unknown',
    last_name: normalizeLastName(rowData['last name']),
    email: email,
    phone: normalizePhone(rowData['phone number'] || rowData['phone']),
    preferred_contact: normalizePreferredContact(rowData['preferred contact method']),
    best_outreach_time: normalizeBestOutreachTime(rowData['best time for outreach']),
    apartment_preference: normalizeApartmentPreference(
      rowData['apartment preference'] || rowData['apartment selection']
    ),
    employment_status: rowData['employment status']?.trim() || null,
    lead_source: rowData['lead source']?.trim() || null,
    submitted_at: submittedAt,
  };

  return lead;
}

/**
 * Sync leads for a single campaign
 */
async function syncCampaign(campaign: Campaign): Promise<SyncResult> {
  const result: SyncResult = {
    campaign: campaign.slug,
    synced: 0,
    skipped: 0,
  };

  try {
    console.log(`[Sync] Starting sync for campaign: ${campaign.name} (${campaign.slug})`);
    console.log(`[Sync] Sheet ID: ${campaign.sheet_id}, Tab: ${campaign.sheet_tab}`);

    // Fetch rows from Google Sheets
    const rows = await fetchSheetRows(campaign.sheet_id, campaign.sheet_tab);

    if (rows.length <= 1) {
      console.log(`[Sync] No data rows found for ${campaign.slug}`);
      return result;
    }

    // First row is headers
    const headers = rows[0];
    const dataRows = rows.slice(1);

    console.log(`[Sync] Found ${dataRows.length} rows to process for ${campaign.slug}`);
    console.log(`[Sync] Headers: ${headers.join(', ')}`);

    // Transform rows to leads
    const leads: LeadInsert[] = [];

    for (const row of dataRows) {
      const lead = transformRowToLead(headers, row, campaign.id);

      if (lead) {
        leads.push(lead);
      } else {
        result.skipped++;
      }
    }

    console.log(`[Sync] Transformed ${leads.length} valid leads, skipped ${result.skipped} for ${campaign.slug}`);

    if (leads.length === 0) {
      return result;
    }

    // Upsert leads to Supabase in batches
    const batchSize = 100;
    for (let i = 0; i < leads.length; i += batchSize) {
      const batch = leads.slice(i, i + batchSize);

      const { error } = await supabaseAdmin
        .from('leads')
        .upsert(batch as any, {
          onConflict: 'campaign_id,email,submitted_at',
          ignoreDuplicates: false,
        });

      if (error) {
        console.error(`[Sync] Error upserting batch for ${campaign.slug}:`, error);
        throw error;
      }

      result.synced += batch.length;
      console.log(`[Sync] Upserted batch ${Math.floor(i / batchSize) + 1} for ${campaign.slug}`);
    }

    console.log(`[Sync] Completed sync for ${campaign.slug}: ${result.synced} synced, ${result.skipped} skipped`);

    return result;
  } catch (error) {
    console.error(`[Sync] Error syncing campaign ${campaign.slug}:`, error);
    result.error = error instanceof Error ? error.message : 'Unknown error';
    return result;
  }
}

/**
 * POST /api/sync
 * Main sync endpoint
 */
export async function POST(request: NextRequest) {
  console.log('[Sync] Sync request received');

  // Verify authentication
  if (!verifyAuth(request)) {
    console.log('[Sync] Unauthorized request');
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Fetch all active campaigns from Supabase
    console.log('[Sync] Fetching active campaigns...');

    const { data: campaigns, error: campaignsError } = await supabaseAdmin
      .from('campaigns')
      .select('*')
      .eq('is_active', true);

    if (campaignsError) {
      console.error('[Sync] Error fetching campaigns:', campaignsError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch campaigns' },
        { status: 500 }
      );
    }

    if (!campaigns || campaigns.length === 0) {
      console.log('[Sync] No active campaigns found');
      return NextResponse.json({
        success: true,
        results: [],
        message: 'No active campaigns to sync',
      });
    }

    console.log(`[Sync] Found ${campaigns.length} active campaigns`);

    // Sync each campaign
    const results: SyncResult[] = [];

    for (const campaign of campaigns) {
      const result = await syncCampaign(campaign);
      results.push(result);
    }

    // Calculate totals
    const totalSynced = results.reduce((sum, r) => sum + r.synced, 0);
    const totalSkipped = results.reduce((sum, r) => sum + r.skipped, 0);
    const failedCampaigns = results.filter((r) => r.error).length;

    console.log(`[Sync] Sync completed: ${totalSynced} synced, ${totalSkipped} skipped, ${failedCampaigns} failed`);

    return NextResponse.json({
      success: true,
      results,
      summary: {
        totalSynced,
        totalSkipped,
        campaignsSynced: results.length - failedCampaigns,
        campaignsFailed: failedCampaigns,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Sync] Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Sync failed',
      },
      { status: 500 }
    );
  }
}
