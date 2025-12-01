/**
 * Google Sheets Type Definitions
 * Enhanced types for all three sheet tabs with exact header mappings
 */

// Base lead type extended from existing Lead interface
export type LeadIntent = 'High' | 'Low';
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
export type LeadSource = 'AI Conversation' | 'Lead Form' | 'Other';

/**
 * Leads Overview Tab
 * Headers: Date, Name, Email, Phone, Lead Source, Lead Intent, Lead Score,
 * Lead Status, Move-in Timing, Preferred Contact Method, Income Range,
 * Number of Occupants, Pets, Preferred Apartment, Assigned To
 */
export interface LeadsOverviewRow {
  date: string;
  name: string;
  email: string;
  phone: string;
  leadSource: LeadSource;
  leadIntent: LeadIntent;
  leadScore: number;
  leadStatus: LeadStatus;
  moveInTiming: string;
  preferredContactMethod: string;
  incomeRange: string;
  numberOfOccupants: string;
  pets: string;
  preferredApartment: string;
  assignedTo: string;
}

/**
 * Lead Form Tab
 * ACTUAL CSV Headers: First Name, Last name, Email Address, Phone Number,
 * Best Time for Outreach, Preferred Contact Method, Move-in Timing,
 * Employment Status, Rental History, Pet Preference, Income Range,
 * Date and Time Stamp, Document Readiness, Apartment Selection,
 * Lead Score, Lead intent, Lead Source, UTM Source, UTM Medium, UTM Campaign
 */
export interface LeadFormRow {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bestTimeForOutreach: string;
  preferredContactMethod: string;
  moveInTiming: string;
  employmentStatus: string;
  rentalHistory: string;
  petPreference: string;
  incomeRange: string;
  timestamp: string;
  documentReadiness: string;
  apartmentSelection: string;
  leadScore: number;
  leadIntent: LeadIntent;
  leadSource: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
}

/**
 * Talking Funnel (AI Conversation) Tab
 * Headers: Timestamp, Name, Email, Phone, Conversation Summary,
 * Move-in Timing, Apartment Preference, Number of Occupants, Pets,
 * Budget Mentioned, Concerns/Questions, Sentiment Score,
 * Engagement Level, UTM Source, UTM Medium, UTM Campaign,
 * Lead Score, Lead Intent
 */
export interface TalkingFunnelRow {
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  conversationSummary: string;
  moveInTiming: string;
  apartmentPreference: string;
  numberOfOccupants: string;
  pets: string;
  budgetMentioned: string;
  concernsQuestions: string;
  sentimentScore: number;
  engagementLevel: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  leadScore: number;
  leadIntent: LeadIntent;
}

/**
 * Unified Lead interface combining all three sources
 * This extends the base Lead type with all possible fields
 */
export interface UnifiedLead {
  // Common fields (all tabs)
  id: string;
  timestamp: Date;
  name: string;
  email: string;
  phone: string;
  leadScore: number;
  leadIntent: LeadIntent;

  // Overview specific
  leadSource?: LeadSource;
  leadStatus?: LeadStatus;
  preferredContactMethod?: string;
  assignedTo?: string;

  // Move-in & Apartment preferences
  moveInTiming?: string;
  apartmentPreference?: string; // Normalized from various formats (apartmentSelection in Lead Form)
  numberOfOccupants?: string;
  pets?: string; // petPreference in Lead Form

  // Financial
  incomeRange?: string;
  budgetMentioned?: string;

  // Lead Form specific
  bestTimeForOutreach?: string;
  employmentStatus?: string;
  rentalHistory?: string;
  documentReadiness?: string;

  // AI Conversation specific
  conversationSummary?: string;
  concernsQuestions?: string;
  sentimentScore?: number;
  engagementLevel?: string;

  // UTM tracking
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;

  // Original source for reference
  originalSource: 'overview' | 'leadForm' | 'aiConversation';
}

/**
 * Column mappings for each sheet tab
 * Maps Google Sheet headers to our type properties
 */
export const SHEET_COLUMN_MAPPINGS = {
  leadsOverview: {
    sheetName: 'Leads Overview',
    columns: {
      date: 0,
      name: 1,
      email: 2,
      phone: 3,
      leadSource: 4,
      leadIntent: 5,
      leadScore: 6,
      leadStatus: 7,
      moveInTiming: 8,
      preferredContactMethod: 9,
      incomeRange: 10,
      numberOfOccupants: 11,
      pets: 12,
      preferredApartment: 13,
      assignedTo: 14,
    },
  },
  leadForm: {
    sheetName: 'Lead Form',
    columns: {
      firstName: 0,
      lastName: 1,
      email: 2,
      phone: 3,
      bestTimeForOutreach: 4,
      preferredContactMethod: 5,
      moveInTiming: 6,
      employmentStatus: 7,
      rentalHistory: 8,
      petPreference: 9,
      incomeRange: 10,
      timestamp: 11,
      documentReadiness: 12,
      apartmentSelection: 13,
      leadScore: 14,
      leadIntent: 15,
      leadSource: 16,
      utmSource: 17,
      utmMedium: 18,
      utmCampaign: 19,
    },
  },
  talkingFunnel: {
    sheetName: 'Talking Funnel',
    columns: {
      timestamp: 0,
      name: 1,
      email: 2,
      phone: 3,
      conversationSummary: 4,
      moveInTiming: 5,
      apartmentPreference: 6,
      numberOfOccupants: 7,
      pets: 8,
      budgetMentioned: 9,
      concernsQuestions: 10,
      sentimentScore: 11,
      engagementLevel: 12,
      utmSource: 13,
      utmMedium: 14,
      utmCampaign: 15,
      leadScore: 16,
      leadIntent: 17,
    },
  },
} as const;

/**
 * Analytics and metrics types
 */
export interface OverviewMetrics {
  totalLeads: number;
  highIntentPercentage: number;
  avgLeadScore: number;
  totalLeadsChange: string;
  highIntentChange: string;
  avgScoreChange: string;
}

export interface LeadActivityItem {
  id: string;
  name: string;
  email: string;
  intent: LeadIntent;
  score: number;
  source: string;
  time: string;
  status?: LeadStatus;
}

export interface IntentDistribution {
  name: string;
  value: number;
  percentage: string;
  fill: string;
}

export interface SourceDistribution {
  name: string;
  value: number;
  percentage: string;
  fill: string;
}

export interface TimeSeriesDataPoint {
  date: string;
  leads: number;
  highIntent: number;
  lowIntent: number;
}
