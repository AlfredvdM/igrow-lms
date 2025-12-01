/**
 * Google Sheets Integration
 * Fetches lead data from Google Sheets with multi-tab support
 */

import { google } from 'googleapis';
import type { Lead } from '@/types';
import type {
  LeadsOverviewRow,
  LeadFormRow,
  TalkingFunnelRow,
  UnifiedLead,
  LeadIntent,
  LeadStatus,
  LeadSource,
} from '@/types/sheets';
import { SHEET_COLUMN_MAPPINGS } from '@/types/sheets';

// Initialize Google Sheets API
const getGoogleSheetsClient = () => {
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
};

/**
 * Fetch leads from Google Sheets
 * @param sheetName - Name of the sheet tab (default: 'Sheet1')
 * @param range - Range to fetch (default: 'A:Z')
 */
export async function fetchLeadsFromSheet(
  sheetName: string = 'Sheet1',
  range: string = 'A:Z'
): Promise<Lead[]> {
  try {
    const sheets = getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('Google Sheet ID not configured');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!${range}`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    // Assume first row is headers
    const headers = rows[0].map(h => String(h).toLowerCase().trim());
    const dataRows = rows.slice(1);

    // Map rows to Lead objects
    const leads: Lead[] = dataRows.map((row, index) => {
      const leadData: any = {};

      headers.forEach((header, i) => {
        leadData[header] = row[i] || '';
      });

      // Map sheet columns to Lead type
      // Adjust these mappings based on your actual Google Sheet structure
      return {
        id: leadData.id || `lead-${Date.now()}-${index}`,
        timestamp: leadData.timestamp ? new Date(leadData.timestamp) : new Date(),
        name: leadData.name || leadData.full_name || 'Unknown',
        email: leadData.email || '',
        phone: leadData.phone || leadData.phone_number,
        source: mapSource(leadData.source || leadData.lead_source),
        status: mapStatus(leadData.status || 'new'),
        interestedIn: leadData.interested_in || leadData.property_type,
        message: leadData.message || leadData.comments,
        assignedTo: leadData.assigned_to || leadData.agent,
        notes: leadData.notes,
        customFields: extractCustomFields(leadData, headers),
      } as Lead;
    });

    return leads;
  } catch (error) {
    console.error('Error fetching leads from Google Sheets:', error);
    throw new Error('Failed to fetch leads from Google Sheets');
  }
}

/**
 * Map source string to Lead source type
 */
function mapSource(source: string): Lead['source'] {
  const sourceMap: Record<string, Lead['source']> = {
    facebook: 'facebook',
    fb: 'facebook',
    instagram: 'instagram',
    ig: 'instagram',
    google: 'google',
    'landing page': 'landing_page',
    'landing-page': 'landing_page',
    chatbot: 'chatbot',
    bot: 'chatbot',
  };

  const normalizedSource = source.toLowerCase().trim();
  return sourceMap[normalizedSource] || 'other';
}

/**
 * Map status string to Lead status type
 */
function mapStatus(status: string): Lead['status'] {
  const statusMap: Record<string, Lead['status']> = {
    new: 'new',
    contacted: 'contacted',
    qualified: 'qualified',
    converted: 'converted',
    lost: 'lost',
    closed: 'converted',
    won: 'converted',
  };

  const normalizedStatus = status.toLowerCase().trim();
  return statusMap[normalizedStatus] || 'new';
}

/**
 * Extract custom fields not part of standard Lead interface
 */
function extractCustomFields(
  data: Record<string, any>,
  headers: string[]
): Record<string, any> {
  const standardFields = [
    'id',
    'timestamp',
    'name',
    'full_name',
    'email',
    'phone',
    'phone_number',
    'source',
    'lead_source',
    'status',
    'interested_in',
    'property_type',
    'message',
    'comments',
    'assigned_to',
    'agent',
    'notes',
  ];

  const customFields: Record<string, any> = {};

  headers.forEach(header => {
    if (!standardFields.includes(header) && data[header]) {
      customFields[header] = data[header];
    }
  });

  return Object.keys(customFields).length > 0 ? customFields : undefined as any;
}

/**
 * Refresh leads data with caching
 * This function can be called periodically to sync data
 */
export async function refreshLeadsData(sheetName?: string): Promise<{
  leads: Lead[];
  lastUpdated: Date;
}> {
  const leads = await fetchLeadsFromSheet(sheetName);

  return {
    leads,
    lastUpdated: new Date(),
  };
}

// ============================================================================
// NEW MULTI-TAB FETCHING FUNCTIONS
// ============================================================================

/**
 * Helper to safely parse numeric values
 */
function parseNumber(value: any, defaultValue: number = 0): number {
  if (typeof value === 'number') return value;
  if (!value || value === '') return defaultValue;

  // Convert to string and clean up
  const cleaned = String(value).trim().replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);

  // Return the parsed number if valid, otherwise default
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Helper to safely parse date values
 */
function parseDate(value: any): Date {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

/**
 * Fetch data from Leads Overview tab
 */
export async function fetchLeadsOverview(): Promise<LeadsOverviewRow[]> {
  try {
    const sheets = getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('Google Sheet ID not configured');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_COLUMN_MAPPINGS.leadsOverview.sheetName}!A:O`, // A to O covers all 15 columns
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return []; // No data or only headers
    }

    // Skip header row
    const dataRows = rows.slice(1);

    return dataRows.map((row): LeadsOverviewRow => ({
      date: row[0] || '',
      name: row[1] || '',
      email: row[2] || '',
      phone: row[3] || '',
      leadSource: (row[4] || 'Other') as LeadSource,
      leadIntent: (row[5] || 'Low') as LeadIntent,
      leadScore: parseNumber(row[6], 0),
      leadStatus: (row[7] || 'New') as LeadStatus,
      moveInTiming: row[8] || '',
      preferredContactMethod: row[9] || '',
      incomeRange: row[10] || '',
      numberOfOccupants: row[11] || '',
      pets: row[12] || '',
      preferredApartment: row[13] || '',
      assignedTo: row[14] || '',
    }));
  } catch (error) {
    console.error('Error fetching Leads Overview:', error);
    throw new Error('Failed to fetch Leads Overview data');
  }
}

/**
 * Fetch data from Lead Form tab
 */
export async function fetchLeadFormData(): Promise<LeadFormRow[]> {
  try {
    const sheets = getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('Google Sheet ID not configured');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_COLUMN_MAPPINGS.leadForm.sheetName}!A:T`, // A to T covers all 20 columns
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return [];
    }

    const dataRows = rows.slice(1);

    return dataRows.map((row): LeadFormRow => ({
      firstName: row[0] || '',
      lastName: row[1] || '',
      email: row[2] || '',
      phone: row[3] || '',
      bestTimeForOutreach: row[4] || '',
      preferredContactMethod: row[5] || '',
      moveInTiming: row[6] || '',
      employmentStatus: row[7] || '',
      rentalHistory: row[8] || '',
      petPreference: row[9] || '',
      incomeRange: row[10] || '',
      timestamp: row[11] || '',
      documentReadiness: row[12] || '',
      apartmentSelection: row[13] || '',
      leadScore: parseNumber(row[14], 0),
      leadIntent: (row[15] || 'Low') as LeadIntent,
      leadSource: row[16] || '',
      utmSource: row[17] || '',
      utmMedium: row[18] || '',
      utmCampaign: row[19] || '',
    }));
  } catch (error) {
    console.error('Error fetching Lead Form data:', error);
    throw new Error('Failed to fetch Lead Form data');
  }
}

/**
 * Fetch data from Talking Funnel (AI Conversation) tab
 */
export async function fetchTalkingFunnelData(): Promise<TalkingFunnelRow[]> {
  try {
    const sheets = getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('Google Sheet ID not configured');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_COLUMN_MAPPINGS.talkingFunnel.sheetName}!A:R`, // A to R covers all 18 columns
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return [];
    }

    const dataRows = rows.slice(1);

    return dataRows.map((row): TalkingFunnelRow => ({
      timestamp: row[0] || '',
      name: row[1] || '',
      email: row[2] || '',
      phone: row[3] || '',
      conversationSummary: row[4] || '',
      moveInTiming: row[5] || '',
      apartmentPreference: row[6] || '',
      numberOfOccupants: row[7] || '',
      pets: row[8] || '',
      budgetMentioned: row[9] || '',
      concernsQuestions: row[10] || '',
      sentimentScore: parseNumber(row[11], 0),
      engagementLevel: row[12] || '',
      utmSource: row[13] || '',
      utmMedium: row[14] || '',
      utmCampaign: row[15] || '',
      leadScore: parseNumber(row[16], 0),
      leadIntent: (row[17] || 'Low') as LeadIntent,
    }));
  } catch (error) {
    console.error('Error fetching Talking Funnel data:', error);
    throw new Error('Failed to fetch Talking Funnel data');
  }
}

/**
 * Convert LeadsOverviewRow to UnifiedLead
 */
function overviewToUnifiedLead(row: LeadsOverviewRow, index: number): UnifiedLead {
  return {
    id: `overview-${parseDate(row.date).getTime()}-${index}`,
    timestamp: parseDate(row.date),
    name: row.name,
    email: row.email,
    phone: row.phone,
    leadScore: row.leadScore,
    leadIntent: row.leadIntent,
    leadSource: row.leadSource,
    leadStatus: row.leadStatus,
    preferredContactMethod: row.preferredContactMethod,
    assignedTo: row.assignedTo,
    moveInTiming: row.moveInTiming,
    apartmentPreference: row.preferredApartment,
    numberOfOccupants: row.numberOfOccupants,
    pets: row.pets,
    incomeRange: row.incomeRange,
    originalSource: 'overview',
  };
}

/**
 * Convert LeadFormRow to UnifiedLead
 */
function leadFormToUnifiedLead(row: LeadFormRow, index: number): UnifiedLead {
  // Concatenate first name and last name
  const fullName = `${row.firstName} ${row.lastName}`.trim();

  return {
    id: `leadform-${parseDate(row.timestamp).getTime()}-${index}`,
    timestamp: parseDate(row.timestamp),
    name: fullName,
    email: row.email,
    phone: row.phone,
    leadScore: row.leadScore,
    leadIntent: row.leadIntent,
    leadSource: (row.leadSource || 'Lead Form') as LeadSource,
    leadStatus: 'New', // Default status for lead form entries
    preferredContactMethod: row.preferredContactMethod,
    moveInTiming: row.moveInTiming,
    apartmentPreference: row.apartmentSelection,
    pets: row.petPreference,
    incomeRange: row.incomeRange,
    bestTimeForOutreach: row.bestTimeForOutreach,
    employmentStatus: row.employmentStatus,
    rentalHistory: row.rentalHistory,
    documentReadiness: row.documentReadiness,
    utmSource: row.utmSource,
    utmMedium: row.utmMedium,
    utmCampaign: row.utmCampaign,
    originalSource: 'leadForm',
  };
}

/**
 * Convert TalkingFunnelRow to UnifiedLead
 */
function talkingFunnelToUnifiedLead(row: TalkingFunnelRow, index: number): UnifiedLead {
  return {
    id: `aiconvo-${parseDate(row.timestamp).getTime()}-${index}`,
    timestamp: parseDate(row.timestamp),
    name: row.name,
    email: row.email,
    phone: row.phone,
    leadScore: row.leadScore,
    leadIntent: row.leadIntent,
    leadSource: 'AI Conversation',
    leadStatus: 'New', // Default status for AI conversation entries
    moveInTiming: row.moveInTiming,
    apartmentPreference: row.apartmentPreference,
    numberOfOccupants: row.numberOfOccupants,
    pets: row.pets,
    budgetMentioned: row.budgetMentioned,
    conversationSummary: row.conversationSummary,
    concernsQuestions: row.concernsQuestions,
    sentimentScore: row.sentimentScore,
    engagementLevel: row.engagementLevel,
    utmSource: row.utmSource,
    utmMedium: row.utmMedium,
    utmCampaign: row.utmCampaign,
    originalSource: 'aiConversation',
  };
}

/**
 * Fetch all leads from all tabs and combine them
 */
export async function fetchAllLeads(): Promise<UnifiedLead[]> {
  try {
    const [overviewRows, leadFormRows, talkingFunnelRows] = await Promise.all([
      fetchLeadsOverview(),
      fetchLeadFormData(),
      fetchTalkingFunnelData(),
    ]);

    const overviewLeads = overviewRows.map(overviewToUnifiedLead);
    const leadFormLeads = leadFormRows.map(leadFormToUnifiedLead);
    const talkingFunnelLeads = talkingFunnelRows.map(talkingFunnelToUnifiedLead);

    // Combine all leads and sort by timestamp (newest first)
    const allLeads = [...overviewLeads, ...leadFormLeads, ...talkingFunnelLeads];
    allLeads.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return allLeads;
  } catch (error) {
    console.error('Error fetching all leads:', error);
    throw new Error('Failed to fetch leads from Google Sheets');
  }
}

/**
 * Fetch leads for a specific page/tab
 */
export async function fetchLeadsBySource(
  source: 'overview' | 'leadForm' | 'aiConversation'
): Promise<UnifiedLead[]> {
  try {
    switch (source) {
      case 'overview': {
        const rows = await fetchLeadsOverview();
        return rows.map(overviewToUnifiedLead);
      }
      case 'leadForm': {
        const rows = await fetchLeadFormData();
        return rows.map(leadFormToUnifiedLead);
      }
      case 'aiConversation': {
        const rows = await fetchTalkingFunnelData();
        return rows.map(talkingFunnelToUnifiedLead);
      }
      default:
        throw new Error(`Unknown source: ${source}`);
    }
  } catch (error) {
    console.error(`Error fetching leads for source ${source}:`, error);
    throw error;
  }
}
