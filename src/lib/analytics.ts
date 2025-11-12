/**
 * Analytics & Data Processing Utilities
 * Calculate metrics and statistics from lead data
 */

import type {
  Lead,
  LeadStats,
  SourceStats,
  TimeSeriesData,
  DashboardMetrics,
} from '@/types';
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  isAfter,
  parseISO,
  format,
} from 'date-fns';

/**
 * Calculate lead statistics
 */
export function calculateLeadStats(leads: Lead[]): LeadStats {
  const total = leads.length;
  const statusCounts = leads.reduce(
    (acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    },
    {} as Record<Lead['status'], number>
  );

  const converted = statusCounts.converted || 0;
  const conversionRate = total > 0 ? (converted / total) * 100 : 0;

  return {
    total,
    new: statusCounts.new || 0,
    contacted: statusCounts.contacted || 0,
    qualified: statusCounts.qualified || 0,
    converted,
    lost: statusCounts.lost || 0,
    conversionRate: Number(conversionRate.toFixed(2)),
  };
}

/**
 * Calculate source statistics
 */
export function calculateSourceStats(leads: Lead[]): SourceStats[] {
  const total = leads.length;
  const sourceCounts = leads.reduce(
    (acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    },
    {} as Record<Lead['source'], number>
  );

  return Object.entries(sourceCounts)
    .map(([source, count]) => ({
      source: source as Lead['source'],
      count,
      percentage: Number(((count / total) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get leads from a specific time period
 */
export function getLeadsSince(leads: Lead[], since: Date): Lead[] {
  return leads.filter(lead => isAfter(lead.timestamp, since));
}

/**
 * Calculate dashboard metrics
 */
export function calculateDashboardMetrics(leads: Lead[]): DashboardMetrics {
  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now);
  const monthStart = startOfMonth(now);

  const todayLeads = getLeadsSince(leads, todayStart).length;
  const weekLeads = getLeadsSince(leads, weekStart).length;
  const monthLeads = getLeadsSince(leads, monthStart).length;

  const stats = calculateLeadStats(leads);
  const sourceStats = calculateSourceStats(leads);

  return {
    todayLeads,
    weekLeads,
    monthLeads,
    conversionRate: stats.conversionRate,
    topSource: sourceStats[0]?.source || 'other',
  };
}

/**
 * Generate time series data for charts
 */
export function generateTimeSeriesData(
  leads: Lead[],
  days: number = 30
): TimeSeriesData[] {
  const now = new Date();
  const timeSeriesMap = new Map<string, number>();

  // Initialize all days with 0
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = format(startOfDay(date), 'yyyy-MM-dd');
    timeSeriesMap.set(dateKey, 0);
  }

  // Count leads per day
  leads.forEach(lead => {
    const dateKey = format(startOfDay(lead.timestamp), 'yyyy-MM-dd');
    if (timeSeriesMap.has(dateKey)) {
      timeSeriesMap.set(dateKey, (timeSeriesMap.get(dateKey) || 0) + 1);
    }
  });

  return Array.from(timeSeriesMap.entries())
    .map(([date, count]) => ({
      date,
      count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Generate time series data by source
 */
export function generateTimeSeriesBySource(
  leads: Lead[],
  days: number = 30
): TimeSeriesData[] {
  const now = new Date();
  const data: TimeSeriesData[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = format(startOfDay(date), 'yyyy-MM-dd');

    const dayLeads = leads.filter(
      lead => format(startOfDay(lead.timestamp), 'yyyy-MM-dd') === dateKey
    );

    const sources: Lead['source'][] = [
      'facebook',
      'instagram',
      'google',
      'landing_page',
      'chatbot',
      'other',
    ];

    sources.forEach(source => {
      data.push({
        date: dateKey,
        count: dayLeads.filter(lead => lead.source === source).length,
        source,
      });
    });
  }

  return data;
}

/**
 * Filter leads by various criteria
 */
export function filterLeads(
  leads: Lead[],
  filters: {
    status?: Lead['status'][];
    source?: Lead['source'][];
    dateFrom?: Date;
    dateTo?: Date;
    search?: string;
  }
): Lead[] {
  return leads.filter(lead => {
    // Status filter
    if (filters.status && !filters.status.includes(lead.status)) {
      return false;
    }

    // Source filter
    if (filters.source && !filters.source.includes(lead.source)) {
      return false;
    }

    // Date range filter
    if (filters.dateFrom && lead.timestamp < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && lead.timestamp > filters.dateTo) {
      return false;
    }

    // Search filter (name, email, phone)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        lead.name.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower) ||
        lead.phone?.toLowerCase().includes(searchLower);

      if (!matchesSearch) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort leads
 */
export function sortLeads(
  leads: Lead[],
  sortBy: keyof Lead = 'timestamp',
  order: 'asc' | 'desc' = 'desc'
): Lead[] {
  return [...leads].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    // Handle undefined values
    if (aValue === undefined && bValue === undefined) return 0;
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
}
