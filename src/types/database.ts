/**
 * Supabase Database Types
 * Auto-generated types for the IGrow LMS database schema
 */

export type CampaignSlug = 'the-bolton' | 'the-aura';

export type PreferredContact = 'WhatsApp' | 'Email' | 'Phone Call';

export type BestOutreachTime = 'Morning' | 'Afternoon' | 'Evening' | 'Anytime';

export type ApartmentPreference =
  // The Bolton
  | 'Studio Apartment'
  | '1 Bedroom Apartment'
  | '1 Bedroom Penthouse'
  | '2 Bedroom Penthouse'
  // The Aura
  | '1 Bedroom 1 Bathroom Apartment'
  | '2 Bedroom 1 Bathroom Apartment'
  | '2 Bedroom 2 Bathroom Apartment';

/**
 * Campaigns table row type
 */
export interface Campaign {
  id: string;
  slug: CampaignSlug;
  name: string;
  sheet_id: string;
  sheet_tab: string;
  is_active: boolean;
  created_at: string;
}

/**
 * Leads table row type
 */
export interface Lead {
  id: string;
  campaign_id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  preferred_contact: PreferredContact | null;
  best_outreach_time: BestOutreachTime | null;
  apartment_preference: ApartmentPreference | null;
  employment_status: string | null;
  lead_source: string | null;
  submitted_at: string;
  synced_at: string;
}

/**
 * Insert types (without auto-generated fields)
 */
export interface CampaignInsert {
  id?: string;
  slug: CampaignSlug;
  name: string;
  sheet_id: string;
  sheet_tab: string;
  is_active?: boolean;
  created_at?: string;
}

export interface LeadInsert {
  id?: string;
  campaign_id: string;
  first_name: string;
  last_name?: string | null;
  email: string;
  phone?: string | null;
  preferred_contact?: PreferredContact | null;
  best_outreach_time?: BestOutreachTime | null;
  apartment_preference?: ApartmentPreference | null;
  employment_status?: string | null;
  lead_source?: string | null;
  submitted_at?: string;
  synced_at?: string;
}

/**
 * Update types (all fields optional)
 */
export interface CampaignUpdate {
  id?: string;
  slug?: CampaignSlug;
  name?: string;
  sheet_id?: string;
  sheet_tab?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface LeadUpdate {
  id?: string;
  campaign_id?: string;
  first_name?: string;
  last_name?: string | null;
  email?: string;
  phone?: string | null;
  preferred_contact?: PreferredContact | null;
  best_outreach_time?: BestOutreachTime | null;
  apartment_preference?: ApartmentPreference | null;
  employment_status?: string | null;
  lead_source?: string | null;
  submitted_at?: string;
  synced_at?: string;
}

/**
 * Database schema type for Supabase client
 */
export interface Database {
  public: {
    Tables: {
      campaigns: {
        Row: Campaign;
        Insert: CampaignInsert;
        Update: CampaignUpdate;
      };
      leads: {
        Row: Lead;
        Insert: LeadInsert;
        Update: LeadUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      campaign_slug: CampaignSlug;
      preferred_contact: PreferredContact;
      best_outreach_time: BestOutreachTime;
      apartment_preference: ApartmentPreference;
    };
  };
}

/**
 * Helper type for Supabase query results
 */
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
