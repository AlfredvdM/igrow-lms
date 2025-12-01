/**
 * React Query hooks for fetching lead data
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import type { UnifiedLead } from '@/types/sheets';
import type { OverviewMetrics, LeadActivityItem } from '@/types/sheets';

/**
 * Overview API Response Type
 */
interface OverviewResponse {
  success: boolean;
  data: {
    metrics: OverviewMetrics;
    recentActivity: LeadActivityItem[];
    timelineData: Array<{ date: string; leads: number }>;
    totalLeadsCount: number;
    currentMonthCount: number;
  };
  timestamp: string;
}

/**
 * Lead Form API Response Type
 */
interface LeadFormResponse {
  success: boolean;
  data: {
    leads: UnifiedLead[];
    stats: {
      totalLeads: number;
      highIntentCount: number;
      highIntentPercentage: number;
      avgLeadScore: number;
    };
    charts: {
      intentDistribution: Array<{ name: string; value: number; percentage: string; fill: string }>;
      statusDistribution: Array<{ name: string; value: number; percentage: string; fill: string }>;
      timeSeriesData: Array<{ date: string; high: number; medium: number; low: number }>;
      moveInTimingData: Array<{ name: string; value: number; fill: string }>;
      incomeBracketData: Array<{ name: string; value: number; fill: string; range?: string; count?: number }>;
      apartmentInterestData: Array<{ name: string; value: number; fill: string; type?: string; count?: number }>;
      petPreferenceData: Array<{ name: string; value: number; fill: string }>;
      leadScoreDistributionData: Array<{ name: string; value: number; range: string; count: number; fill: string }>;
      leadSourcePerformanceData: Array<{ name: string; value: number; fill: string }>;
      employmentStatusData: Array<{ name: string; value: number; status: string; count: number; fill: string }>;
      outreachTimeData: Array<{ name: string; value: number; fill: string }>;
    };
  };
  timestamp: string;
}

/**
 * AI Conversation API Response Type
 */
interface AIConversationResponse {
  success: boolean;
  data: {
    leads: UnifiedLead[];
    stats: {
      totalLeads: number;
      highIntentCount: number;
      highIntentPercentage: number;
      avgLeadScore: number;
      avgSentimentScore: number;
    };
    charts: {
      intentDistribution: Array<{ name: string; value: number; percentage: string; fill: string }>;
      engagementDistribution: Array<{ name: string; value: number; percentage: string; fill: string }>;
      timeSeriesData: Array<{ date: string; leads: number; highIntent: number; lowIntent: number }>;
      moveInTimingData: Array<{ name: string; value: number; fill: string; timing?: string; count?: number }>;
      incomeBracketData: Array<{ name: string; value: number; fill: string; range?: string; count?: number }>;
      apartmentPreferenceData: Array<{ name: string; value: number; fill: string; type?: string; count?: number }>;
    };
    topLeads: UnifiedLead[];
  };
  timestamp: string;
}

/**
 * Hook to fetch overview page data
 */
export function useOverviewData() {
  return useQuery<OverviewResponse>({
    queryKey: ['leads', 'overview'],
    queryFn: async () => {
      const response = await fetch('/api/leads/overview', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch overview data');
      }

      return response.json();
    },
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to fetch lead form page data
 */
export function useLeadFormData() {
  return useQuery<LeadFormResponse>({
    queryKey: ['leads', 'lead-form'],
    queryFn: async () => {
      const response = await fetch('/api/leads/lead-form', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch lead form data');
      }

      return response.json();
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to fetch AI conversation page data
 */
export function useAIConversationData() {
  return useQuery<AIConversationResponse>({
    queryKey: ['leads', 'ai-conversation'],
    queryFn: async () => {
      const response = await fetch('/api/leads/ai-conversation', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI conversation data');
      }

      return response.json();
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}
