/**
 * React Query hooks for fetching lead data from Supabase
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Lead, Campaign, ApartmentPreference, PreferredContact, BestOutreachTime } from '@/types/database';

const STALE_TIME = 60 * 1000; // 60 seconds

// Date range filter options
export type DateRangeFilter = 'all' | 'today' | 'last7days' | 'last30days' | 'thisMonth';

// ============================================================================
// Helper: Get campaign ID from slug
// ============================================================================

async function getCampaignBySlug(slug: string): Promise<Campaign | null> {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching campaign:', error);
    return null;
  }

  return data;
}

// ============================================================================
// 1. useLeads - Fetch leads with filtering and pagination
// ============================================================================

interface UseLeadsOptions {
  limit?: number;
  offset?: number;
  search?: string;
  apartmentFilter?: ApartmentPreference | 'all';
  contactMethodFilter?: PreferredContact | 'all';
  bestTimeFilter?: BestOutreachTime | 'all';
  dateRangeFilter?: DateRangeFilter;
  sortBy?: keyof Lead;
  sortOrder?: 'asc' | 'desc';
}

interface UseLeadsResult {
  data: Lead[];
  count: number;
}

// Helper function to get date range start date
function getDateRangeStart(dateRange: DateRangeFilter): Date | null {
  const now = new Date();

  switch (dateRange) {
    case 'today':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case 'last7days':
      const last7 = new Date(now);
      last7.setDate(last7.getDate() - 7);
      return last7;
    case 'last30days':
      const last30 = new Date(now);
      last30.setDate(last30.getDate() - 30);
      return last30;
    case 'thisMonth':
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case 'all':
    default:
      return null;
  }
}

export function useLeads(campaignSlug: string, options: UseLeadsOptions = {}) {
  const {
    limit = 50,
    offset = 0,
    search,
    apartmentFilter,
    contactMethodFilter,
    bestTimeFilter,
    dateRangeFilter = 'all',
    sortBy = 'submitted_at',
    sortOrder = 'desc',
  } = options;

  return useQuery<UseLeadsResult>({
    queryKey: ['leads', campaignSlug, options],
    queryFn: async () => {
      // First get the campaign ID
      const campaign = await getCampaignBySlug(campaignSlug);
      if (!campaign) {
        return { data: [], count: 0 };
      }

      // Build the query
      let query = supabase
        .from('leads')
        .select('*', { count: 'exact' })
        .eq('campaign_id', campaign.id);

      // Apply search filter
      if (search) {
        query = query.or(
          `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
        );
      }

      // Apply apartment filter
      if (apartmentFilter && apartmentFilter !== 'all') {
        query = query.eq('apartment_preference', apartmentFilter);
      }

      // Apply contact method filter
      if (contactMethodFilter && contactMethodFilter !== 'all') {
        query = query.eq('preferred_contact', contactMethodFilter);
      }

      // Apply best time filter
      if (bestTimeFilter && bestTimeFilter !== 'all') {
        query = query.eq('best_outreach_time', bestTimeFilter);
      }

      // Apply date range filter
      const dateRangeStart = getDateRangeStart(dateRangeFilter);
      if (dateRangeStart) {
        query = query.gte('submitted_at', dateRangeStart.toISOString());
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching leads:', error);
        throw error;
      }

      return {
        data: data || [],
        count: count || 0,
      };
    },
    staleTime: STALE_TIME,
  });
}

// ============================================================================
// 2. useLeadStats - Aggregated stats for a campaign
// ============================================================================

interface LeadStats {
  totalLeads: number;
  leadsThisWeek: number;
  leadsToday: number;
  topApartmentType: string | null;
  topContactMethod: string | null;
}

export function useLeadStats(campaignSlug: string) {
  return useQuery<LeadStats>({
    queryKey: ['lead-stats', campaignSlug],
    queryFn: async () => {
      const campaign = await getCampaignBySlug(campaignSlug);
      if (!campaign) {
        return {
          totalLeads: 0,
          leadsThisWeek: 0,
          leadsToday: 0,
          topApartmentType: null,
          topContactMethod: null,
        };
      }

      // Get all leads for this campaign
      const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .eq('campaign_id', campaign.id);

      if (error) {
        console.error('Error fetching lead stats:', error);
        throw error;
      }

      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(startOfToday);
      startOfWeek.setDate(startOfWeek.getDate() - 7);

      // Calculate stats
      const totalLeads = leads?.length || 0;

      const leadsToday = leads?.filter((lead) => {
        const submittedAt = new Date(lead.submitted_at);
        return submittedAt >= startOfToday;
      }).length || 0;

      const leadsThisWeek = leads?.filter((lead) => {
        const submittedAt = new Date(lead.submitted_at);
        return submittedAt >= startOfWeek;
      }).length || 0;

      // Find top apartment type
      const apartmentCounts: Record<string, number> = {};
      leads?.forEach((lead) => {
        if (lead.apartment_preference) {
          apartmentCounts[lead.apartment_preference] =
            (apartmentCounts[lead.apartment_preference] || 0) + 1;
        }
      });
      const topApartmentType = Object.entries(apartmentCounts).sort(
        (a, b) => b[1] - a[1]
      )[0]?.[0] || null;

      // Find top contact method
      const contactCounts: Record<string, number> = {};
      leads?.forEach((lead) => {
        if (lead.preferred_contact) {
          contactCounts[lead.preferred_contact] =
            (contactCounts[lead.preferred_contact] || 0) + 1;
        }
      });
      const topContactMethod = Object.entries(contactCounts).sort(
        (a, b) => b[1] - a[1]
      )[0]?.[0] || null;

      return {
        totalLeads,
        leadsThisWeek,
        leadsToday,
        topApartmentType,
        topContactMethod,
      };
    },
    staleTime: STALE_TIME,
  });
}

// ============================================================================
// 3. useLeadTimeline - Daily lead counts for charts
// ============================================================================

interface TimelineDataPoint {
  date: string;
  count: number;
}

export function useLeadTimeline(campaignSlug: string, days: number | null = 30) {
  return useQuery<TimelineDataPoint[]>({
    queryKey: ['lead-timeline', campaignSlug, days],
    queryFn: async () => {
      const campaign = await getCampaignBySlug(campaignSlug);
      if (!campaign) {
        return [];
      }

      const endDate = new Date();
      let query = supabase
        .from('leads')
        .select('submitted_at')
        .eq('campaign_id', campaign.id)
        .lte('submitted_at', endDate.toISOString());

      // Apply date filter only if days is specified (not "all time")
      if (days !== null && days > 0) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        query = query.gte('submitted_at', startDate.toISOString());
      }

      const { data: leads, error } = await query;

      if (error) {
        console.error('Error fetching lead timeline:', error);
        throw error;
      }

      // Create a map of date -> count
      const dateCounts: Record<string, number> = {};

      if (days !== null && days > 0) {
        // For specific date range, initialize all dates with 0
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        for (let i = 0; i <= days; i++) {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          const dateStr = date.toISOString().split('T')[0];
          dateCounts[dateStr] = 0;
        }
      }

      // Count leads per day
      leads?.forEach((lead) => {
        const dateStr = new Date(lead.submitted_at).toISOString().split('T')[0];
        if (days === null || days === 0) {
          // For "all time", dynamically add dates
          dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
        } else if (dateCounts[dateStr] !== undefined) {
          dateCounts[dateStr]++;
        }
      });

      // Convert to array sorted by date
      return Object.entries(dateCounts)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
    },
    staleTime: STALE_TIME,
  });
}

// ============================================================================
// 4. useApartmentBreakdown - Count by apartment type
// ============================================================================

interface BreakdownItem {
  type: string;
  count: number;
  percentage: number;
}

export function useApartmentBreakdown(campaignSlug: string) {
  return useQuery<BreakdownItem[]>({
    queryKey: ['apartment-breakdown', campaignSlug],
    queryFn: async () => {
      const campaign = await getCampaignBySlug(campaignSlug);
      if (!campaign) {
        return [];
      }

      const { data: leads, error } = await supabase
        .from('leads')
        .select('apartment_preference')
        .eq('campaign_id', campaign.id);

      if (error) {
        console.error('Error fetching apartment breakdown:', error);
        throw error;
      }

      // Count by apartment type
      const counts: Record<string, number> = {};
      let total = 0;

      leads?.forEach((lead) => {
        const type = lead.apartment_preference || 'Not Specified';
        counts[type] = (counts[type] || 0) + 1;
        total++;
      });

      // Convert to array with percentages
      return Object.entries(counts)
        .map(([type, count]) => ({
          type,
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count);
    },
    staleTime: STALE_TIME,
  });
}

// ============================================================================
// 5. useContactMethodBreakdown - Count by preferred contact method
// ============================================================================

interface ContactMethodBreakdownItem {
  method: string;
  count: number;
  percentage: number;
}

export function useContactMethodBreakdown(campaignSlug: string) {
  return useQuery<ContactMethodBreakdownItem[]>({
    queryKey: ['contact-method-breakdown', campaignSlug],
    queryFn: async () => {
      const campaign = await getCampaignBySlug(campaignSlug);
      if (!campaign) {
        return [];
      }

      const { data: leads, error } = await supabase
        .from('leads')
        .select('preferred_contact')
        .eq('campaign_id', campaign.id);

      if (error) {
        console.error('Error fetching contact method breakdown:', error);
        throw error;
      }

      // Count by contact method
      const counts: Record<string, number> = {};
      let total = 0;

      leads?.forEach((lead) => {
        const method = lead.preferred_contact || 'Not Specified';
        counts[method] = (counts[method] || 0) + 1;
        total++;
      });

      // Convert to array with percentages
      return Object.entries(counts)
        .map(([method, count]) => ({
          method,
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count);
    },
    staleTime: STALE_TIME,
  });
}

// ============================================================================
// 6. useEmploymentBreakdown - Count by employment status
// ============================================================================

interface EmploymentBreakdownItem {
  status: string;
  count: number;
  percentage: number;
}

export function useEmploymentBreakdown(campaignSlug: string) {
  return useQuery<EmploymentBreakdownItem[]>({
    queryKey: ['employment-breakdown', campaignSlug],
    queryFn: async () => {
      const campaign = await getCampaignBySlug(campaignSlug);
      if (!campaign) {
        return [];
      }

      const { data: leads, error } = await supabase
        .from('leads')
        .select('employment_status')
        .eq('campaign_id', campaign.id);

      if (error) {
        console.error('Error fetching employment breakdown:', error);
        throw error;
      }

      // Count by employment status
      const counts: Record<string, number> = {};
      let total = 0;

      leads?.forEach((lead) => {
        const status = lead.employment_status || 'Not Specified';
        counts[status] = (counts[status] || 0) + 1;
        total++;
      });

      // Convert to array with percentages
      return Object.entries(counts)
        .map(([status, count]) => ({
          status,
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count);
    },
    staleTime: STALE_TIME,
  });
}

// ============================================================================
// 7. useLeadSourceBreakdown - Count by lead source (Funnel vs META)
// ============================================================================

interface LeadSourceBreakdownItem {
  source: string;
  count: number;
  percentage: number;
}

export function useLeadSourceBreakdown(campaignSlug: string) {
  return useQuery<LeadSourceBreakdownItem[]>({
    queryKey: ['lead-source-breakdown', campaignSlug],
    queryFn: async () => {
      const campaign = await getCampaignBySlug(campaignSlug);
      if (!campaign) {
        return [];
      }

      const { data: leads, error } = await supabase
        .from('leads')
        .select('lead_source')
        .eq('campaign_id', campaign.id);

      if (error) {
        console.error('Error fetching lead source breakdown:', error);
        throw error;
      }

      // Count by lead source
      const counts: Record<string, number> = {};
      let total = 0;

      leads?.forEach((lead) => {
        // Normalize source names
        let source = lead.lead_source || 'Not Specified';

        // Group similar sources
        if (source.toLowerCase().includes('meta') || source.toLowerCase().includes('facebook')) {
          source = 'META';
        } else if (source.toLowerCase().includes('funnel')) {
          source = 'Funnel';
        }

        counts[source] = (counts[source] || 0) + 1;
        total++;
      });

      // Convert to array with percentages
      return Object.entries(counts)
        .map(([source, count]) => ({
          source,
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count);
    },
    staleTime: STALE_TIME,
  });
}

// ============================================================================
// Bonus: useCampaigns - Fetch all campaigns
// ============================================================================

export function useCampaigns() {
  return useQuery<Campaign[]>({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching campaigns:', error);
        throw error;
      }

      return data || [];
    },
    staleTime: STALE_TIME * 5, // Cache campaigns longer
  });
}

// ============================================================================
// Bonus: useRecentLeads - Fetch most recent leads
// ============================================================================

export function useRecentLeads(campaignSlug: string, limit: number = 10) {
  return useQuery<Lead[]>({
    queryKey: ['recent-leads', campaignSlug, limit],
    queryFn: async () => {
      const campaign = await getCampaignBySlug(campaignSlug);
      if (!campaign) {
        return [];
      }

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('campaign_id', campaign.id)
        .order('submitted_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent leads:', error);
        throw error;
      }

      return data || [];
    },
    staleTime: STALE_TIME,
  });
}
