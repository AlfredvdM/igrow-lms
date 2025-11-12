/**
 * Google Sheets Integration
 * Fetches lead data from Google Sheets
 */

import { google } from 'googleapis';
import type { Lead } from '@/types';

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
