/**
 * Sync API Endpoint (Pages Router)
 * Pulls data from Google Sheets and saves to Supabase
 * Using Pages Router to bypass Clerk middleware entirely
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { google } from 'googleapis';
import type {
  LeadInsert,
  PreferredContact,
  BestOutreachTime,
  ApartmentPreference,
  Campaign,
  Database,
} from '@/types/database';

export const config = {
  maxDuration: 60, // Allow up to 60 seconds for sync
};

interface SyncResult {
  campaign: string;
  synced: number;
  skipped: number;
  error?: string;
}

interface SyncResponse {
  success: boolean;
  error?: string;
  results?: SyncResult[];
  summary?: {
    totalSynced: number;
    totalSkipped: number;
    campaignsSynced: number;
    campaignsFailed: number;
  };
  message?: string;
  timestamp?: string;
}

/**
 * Create Supabase admin client
 */
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
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
async function syncCampaign(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  campaign: Campaign
): Promise<SyncResult> {
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

      const { error } = await supabase
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
 * Main API handler
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SyncResponse>
) {
  console.log('[Sync] Sync request received via Pages Router');

  // Only allow GET and POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Check auth - custom header or Vercel cron
  const cronSecret = req.headers['x-cron-secret'];
  const isVercelCron = req.headers['x-vercel-cron'] === '1';

  if (!isVercelCron && cronSecret !== process.env.CRON_SECRET) {
    console.log('[Sync] Unauthorized request');
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const supabase = getSupabaseAdmin();

    // Fetch all active campaigns from Supabase
    console.log('[Sync] Fetching active campaigns...');

    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('is_active', true);

    if (campaignsError) {
      console.error('[Sync] Error fetching campaigns:', campaignsError);
      return res.status(500).json({ success: false, error: 'Failed to fetch campaigns' });
    }

    if (!campaigns || campaigns.length === 0) {
      console.log('[Sync] No active campaigns found');
      return res.status(200).json({
        success: true,
        results: [],
        message: 'No active campaigns to sync',
      });
    }

    console.log(`[Sync] Found ${campaigns.length} active campaigns`);

    // Sync each campaign
    const results: SyncResult[] = [];

    for (const campaign of campaigns) {
      const result = await syncCampaign(supabase, campaign);
      results.push(result);
    }

    // Calculate totals
    const totalSynced = results.reduce((sum, r) => sum + r.synced, 0);
    const totalSkipped = results.reduce((sum, r) => sum + r.skipped, 0);
    const failedCampaigns = results.filter((r) => r.error).length;

    console.log(`[Sync] Sync completed: ${totalSynced} synced, ${totalSkipped} skipped, ${failedCampaigns} failed`);

    return res.status(200).json({
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
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Sync failed',
    });
  }
}
