/**
 * Enhanced Analytics for UnifiedLead Data
 * Provides calculations for metrics, charts, and insights
 */

import type { UnifiedLead, LeadIntent, LeadStatus, LeadSource } from '@/types/sheets';
import type {
  OverviewMetrics,
  LeadActivityItem,
  IntentDistribution,
  SourceDistribution,
  TimeSeriesDataPoint,
} from '@/types/sheets';
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  subMonths,
  format,
  isWithinInterval,
  parseISO,
} from 'date-fns';
import { chartColorsHex } from '@/data/common/chart-colors';

/**
 * Calculate overview page metrics
 */
export function calculateOverviewMetrics(
  leads: UnifiedLead[],
  previousPeriodLeads?: UnifiedLead[]
): OverviewMetrics {
  const totalLeads = leads.length;
  const highIntentLeads = leads.filter((l) => l.leadIntent === 'High').length;
  const highIntentPercentage = totalLeads > 0 ? (highIntentLeads / totalLeads) * 100 : 0;

  // Calculate average lead score - ensure scores are numbers
  const totalScore = leads.reduce((sum, lead) => {
    const score = Number(lead.leadScore) || 0;
    return sum + score;
  }, 0);
  const avgLeadScore = totalLeads > 0 ? totalScore / totalLeads : 0;

  // Calculate changes vs previous period
  let totalLeadsChange = '+0%';
  let highIntentChange = '+0%';
  let avgScoreChange = '+0pts';

  if (previousPeriodLeads && previousPeriodLeads.length > 0) {
    const prevTotal = previousPeriodLeads.length;
    const prevHighIntent = previousPeriodLeads.filter((l) => l.leadIntent === 'High').length;
    const prevAvgScore =
      previousPeriodLeads.reduce((sum, lead) => sum + (lead.leadScore || 0), 0) / prevTotal;

    // Total leads change
    if (prevTotal > 0) {
      const changePercent = ((totalLeads - prevTotal) / prevTotal) * 100;
      totalLeadsChange = changePercent >= 0
        ? `+${changePercent.toFixed(1)}%`
        : `${changePercent.toFixed(1)}%`;
    }

    // High intent change
    const prevHighIntentPercent = prevTotal > 0 ? (prevHighIntent / prevTotal) * 100 : 0;
    const intentDiff = highIntentPercentage - prevHighIntentPercent;
    highIntentChange = intentDiff >= 0
      ? `+${intentDiff.toFixed(1)}%`
      : `${intentDiff.toFixed(1)}%`;

    // Avg score change
    const scoreDiff = avgLeadScore - prevAvgScore;
    avgScoreChange = scoreDiff >= 0
      ? `+${Math.round(scoreDiff)}pts`
      : `${Math.round(scoreDiff)}pts`;
  }

  return {
    totalLeads,
    highIntentPercentage: Math.round(highIntentPercentage),
    avgLeadScore: Math.round(avgLeadScore),
    totalLeadsChange,
    highIntentChange,
    avgScoreChange,
  };
}

/**
 * Get leads from current and previous month for comparison
 */
export function getLeadsForMetricsComparison(allLeads: UnifiedLead[]): {
  currentMonthLeads: UnifiedLead[];
  previousMonthLeads: UnifiedLead[];
} {
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const previousMonthStart = startOfMonth(subMonths(now, 1));

  const currentMonthLeads = allLeads.filter((lead) =>
    isWithinInterval(lead.timestamp, {
      start: currentMonthStart,
      end: now,
    })
  );

  const previousMonthLeads = allLeads.filter((lead) =>
    isWithinInterval(lead.timestamp, {
      start: previousMonthStart,
      end: currentMonthStart,
    })
  );

  return { currentMonthLeads, previousMonthLeads };
}

/**
 * Convert leads to recent activity items for the table
 */
export function convertToLeadActivityItems(leads: UnifiedLead[]): LeadActivityItem[] {
  return leads
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .map((lead) => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      intent: lead.leadIntent,
      score: lead.leadScore,
      source: lead.leadSource || getSourceFromOriginal(lead.originalSource),
      time: formatRelativeTime(lead.timestamp),
      status: lead.leadStatus,
    }));
}

/**
 * Get source display name from original source
 */
function getSourceFromOriginal(originalSource: 'overview' | 'leadForm' | 'aiConversation'): string {
  switch (originalSource) {
    case 'leadForm':
      return 'Lead Form';
    case 'aiConversation':
      return 'AI Conversation';
    default:
      return 'Other';
  }
}

/**
 * Format timestamp as relative time
 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return format(date, 'MMM d');
}

/**
 * Calculate intent distribution for charts
 */
export function calculateIntentDistribution(leads: UnifiedLead[]): IntentDistribution[] {
  const total = leads.length;
  if (total === 0) {
    return [
      { name: 'High', value: 0, percentage: '0%', fill: chartColorsHex.charts.green },
      { name: 'Low', value: 0, percentage: '0%', fill: chartColorsHex.charts.orange },
    ];
  }

  const highCount = leads.filter((l) => l.leadIntent === 'High').length;
  const lowCount = leads.filter((l) => l.leadIntent === 'Low').length;

  return [
    {
      name: 'High',
      value: highCount,
      percentage: `${Math.round((highCount / total) * 100)}%`,
      fill: chartColorsHex.charts.green,
    },
    {
      name: 'Low',
      value: lowCount,
      percentage: `${Math.round((lowCount / total) * 100)}%`,
      fill: chartColorsHex.charts.orange,
    },
  ];
}

/**
 * Calculate source distribution for charts
 */
export function calculateSourceDistribution(leads: UnifiedLead[]): SourceDistribution[] {
  const total = leads.length;
  if (total === 0) {
    return [
      { name: 'Lead Form', value: 0, percentage: '0%', fill: chartColorsHex.brand.primary },
      { name: 'AI Conversation', value: 0, percentage: '0%', fill: chartColorsHex.charts.blue },
      { name: 'Other', value: 0, percentage: '0%', fill: chartColorsHex.charts.gray },
    ];
  }

  const leadFormCount = leads.filter(
    (l) => l.leadSource === 'Lead Form' || l.originalSource === 'leadForm'
  ).length;
  const aiConvoCount = leads.filter(
    (l) => l.leadSource === 'AI Conversation' || l.originalSource === 'aiConversation'
  ).length;
  const otherCount = total - leadFormCount - aiConvoCount;

  return [
    {
      name: 'Lead Form',
      value: leadFormCount,
      percentage: `${Math.round((leadFormCount / total) * 100)}%`,
      fill: chartColorsHex.brand.primary,
    },
    {
      name: 'AI Conversation',
      value: aiConvoCount,
      percentage: `${Math.round((aiConvoCount / total) * 100)}%`,
      fill: chartColorsHex.charts.blue,
    },
    {
      name: 'Other',
      value: otherCount,
      percentage: `${Math.round((otherCount / total) * 100)}%`,
      fill: chartColorsHex.charts.gray,
    },
  ].filter((item) => item.value > 0);
}

/**
 * Calculate status distribution for charts
 */
export function calculateStatusDistribution(
  leads: UnifiedLead[]
): Array<{ name: string; value: number; percentage: string; fill: string }> {
  const total = leads.length;
  if (total === 0) return [];

  const statusCounts = leads.reduce((acc, lead) => {
    const status = lead.leadStatus || 'New';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Map status to colors
  const statusColorMap: Record<string, string> = {
    'New': chartColorsHex.charts.blue,
    'Contacted': chartColorsHex.charts.purple,
    'Qualified': chartColorsHex.charts.orange,
    'Converted': chartColorsHex.charts.green,
    'Lost': chartColorsHex.charts.red,
  };

  return Object.entries(statusCounts)
    .map(([name, value]) => ({
      name,
      value,
      percentage: `${Math.round((value / total) * 100)}%`,
      fill: statusColorMap[name] || chartColorsHex.charts.gray,
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Generate time series data for the last N days
 */
export function generateTimeSeriesData(
  leads: UnifiedLead[],
  days: number = 30
): TimeSeriesDataPoint[] {
  const now = new Date();
  const dataPoints: TimeSeriesDataPoint[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = format(startOfDay(date), 'MMM d');
    const dateStart = startOfDay(date);
    const dateEnd = new Date(dateStart);
    dateEnd.setDate(dateEnd.getDate() + 1);

    const dayLeads = leads.filter((lead) =>
      isWithinInterval(lead.timestamp, { start: dateStart, end: dateEnd })
    );

    const highIntent = dayLeads.filter((l) => l.leadIntent === 'High').length;
    const lowIntent = dayLeads.filter((l) => l.leadIntent === 'Low').length;

    dataPoints.push({
      date: dateKey,
      leads: dayLeads.length,
      highIntent,
      lowIntent,
    });
  }

  return dataPoints;
}

/**
 * Generate timeline data for overview page (simple format for area chart)
 */
export function generateOverviewTimelineData(
  leads: UnifiedLead[],
  days: number = 30
): Array<{ date: string; leads: number }> {
  const now = new Date();
  const dataPoints: Array<{ date: string; leads: number }> = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = format(startOfDay(date), 'yyyy-MM-dd');
    const dateStart = startOfDay(date);
    const dateEnd = new Date(dateStart);
    dateEnd.setDate(dateEnd.getDate() + 1);

    const dayLeads = leads.filter((lead) =>
      isWithinInterval(lead.timestamp, { start: dateStart, end: dateEnd })
    );

    dataPoints.push({
      date: dateKey,
      leads: dayLeads.length,
    });
  }

  return dataPoints;
}

/**
 * Calculate move-in timing distribution
 */
export function calculateMoveInTimingDistribution(
  leads: UnifiedLead[]
): Array<{ name: string; value: number; timing?: string; count?: number; fill: string }> {
  const timingCounts: Record<string, number> = {};

  leads.forEach((lead) => {
    const timing = lead.moveInTiming || 'Not specified';
    timingCounts[timing] = (timingCounts[timing] || 0) + 1;
  });

  // Map timing to colors based on urgency
  const timingColorMap: Record<string, string> = {
    'Within 30 days': chartColorsHex.brand.primary,
    '31 to 60 days': chartColorsHex.charts.blue,
    '61 to 90 days': chartColorsHex.charts.purple,
    '90+ days': chartColorsHex.charts.orange,
    '1-3 months': chartColorsHex.charts.blue,
    '3-6 months': chartColorsHex.charts.purple,
    '6+ months': chartColorsHex.charts.gray,
    'Not specified': chartColorsHex.charts.gray,
  };

  return Object.entries(timingCounts)
    .map(([name, value]) => ({
      name,
      value,
      timing: name,
      count: value,
      fill: timingColorMap[name] || chartColorsHex.charts.gray,
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Calculate income bracket distribution
 */
export function calculateIncomeBracketDistribution(
  leads: UnifiedLead[]
): Array<{ name: string; value: number; bracket?: string; count?: number; fill: string; range?: string }> {
  const incomeCounts: Record<string, number> = {};

  leads.forEach((lead) => {
    const income = lead.incomeRange || 'Not specified';
    incomeCounts[income] = (incomeCounts[income] || 0) + 1;
  });

  // Map income brackets to colors (supporting both formats)
  const incomeColorMap: Record<string, string> = {
    'Under R10,000': chartColorsHex.charts.red,
    'R10,000 - R15,000': chartColorsHex.charts.orange,
    'R15,000 - R20,000': chartColorsHex.charts.blue,
    'R15,000 â R20,000': chartColorsHex.charts.blue, // Support special character
    'R20,000 - R30,000': chartColorsHex.charts.purple,
    'R30,000 - R40,000': chartColorsHex.brand.primary,
    'R30,000+': chartColorsHex.charts.green,
    'R40,000 +': chartColorsHex.charts.green,
    'R40,000+': chartColorsHex.charts.green,
    'Not specified': chartColorsHex.charts.gray,
  };

  return Object.entries(incomeCounts)
    .map(([name, value]) => ({
      name,
      value,
      bracket: name,
      count: value,
      range: name,
      fill: incomeColorMap[name] || chartColorsHex.charts.gray,
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Calculate apartment preference distribution
 */
export function calculateApartmentPreferenceDistribution(
  leads: UnifiedLead[]
): Array<{ name: string; value: number; type?: string; count?: number; fill: string }> {
  const apartmentCounts: Record<string, number> = {};

  leads.forEach((lead) => {
    const preference = lead.apartmentPreference || 'Not specified';
    // Split by comma if multiple preferences
    const preferences = preference.split(',').map((p) => p.trim());
    preferences.forEach((pref) => {
      if (pref && pref !== 'Not specified') {
        // Normalize apartment names
        let normalizedName = pref;
        if (pref.includes('Studio')) {
          normalizedName = 'Studio';
        } else if (pref.includes('1 Bedroom 1 Bathroom')) {
          normalizedName = '1BR 1BA';
        } else if (pref.includes('2 Bedroom 2 Bathroom')) {
          normalizedName = '2BR 2BA';
        } else if (pref.includes('2 Bedroom 1 Bathroom')) {
          normalizedName = '2BR 1BA';
        } else if (pref.includes('3 Bedroom 2 Bathroom')) {
          normalizedName = '3BR 2BA';
        }
        apartmentCounts[normalizedName] = (apartmentCounts[normalizedName] || 0) + 1;
      }
    });
  });

  // Map apartment types to colors
  const apartmentColorMap: Record<string, string> = {
    'Studio': chartColorsHex.charts.gray,
    '1BR 1BA': chartColorsHex.charts.blue,
    '2BR 1BA': chartColorsHex.charts.purple,
    '2BR 2BA': chartColorsHex.brand.primary,
    '3BR 2BA': chartColorsHex.charts.green,
    'Not specified': chartColorsHex.charts.gray,
  };

  return Object.entries(apartmentCounts)
    .map(([name, value]) => ({
      name,
      value,
      type: name,
      count: value,
      fill: apartmentColorMap[name] || chartColorsHex.charts.orange,
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Calculate pet preference distribution
 */
export function calculatePetPreferenceDistribution(
  leads: UnifiedLead[]
): Array<{ name: string; value: number; fill: string }> {
  const petCounts: Record<string, number> = {
    'No': 0,
    'Yes (within policy)': 0,
    'Yes (outside policy)': 0,
    'Not specified': 0,
  };

  leads.forEach((lead) => {
    const pets = lead.pets || 'Not specified';

    // Normalize pet preference values
    if (pets === 'No' || pets.toLowerCase().includes('no pets')) {
      petCounts['No']++;
    } else if (pets.toLowerCase().includes('within') && pets.toLowerCase().includes('policy')) {
      petCounts['Yes (within policy)']++;
    } else if (pets.toLowerCase().includes('outside') && pets.toLowerCase().includes('policy')) {
      petCounts['Yes (outside policy)']++;
    } else if (pets === 'Not specified' || !pets) {
      petCounts['Not specified']++;
    } else {
      // Fallback for any other "Yes" variations
      petCounts['Yes (within policy)']++;
    }
  });

  // Map pet preferences to colors
  const petColorMap: Record<string, string> = {
    'No': chartColorsHex.charts.blue,
    'Yes (within policy)': chartColorsHex.charts.green,
    'Yes (outside policy)': chartColorsHex.charts.orange,
    'Not specified': chartColorsHex.charts.gray,
  };

  return Object.entries(petCounts)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
      fill: petColorMap[name] || chartColorsHex.charts.gray,
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Calculate engagement level distribution (for AI conversations)
 */
export function calculateEngagementDistribution(
  leads: UnifiedLead[]
): Array<{ name: string; value: number; percentage: string; fill: string }> {
  const total = leads.length;
  if (total === 0) return [];

  const engagementCounts: Record<string, number> = {};

  leads.forEach((lead) => {
    const level = lead.engagementLevel || 'Unknown';
    engagementCounts[level] = (engagementCounts[level] || 0) + 1;
  });

  // Map engagement levels to colors
  const engagementColorMap: Record<string, string> = {
    'High': chartColorsHex.charts.green,
    'Medium': chartColorsHex.charts.blue,
    'Low': chartColorsHex.charts.orange,
    'Unknown': chartColorsHex.charts.gray,
  };

  return Object.entries(engagementCounts)
    .map(([name, value]) => ({
      name,
      value,
      percentage: `${Math.round((value / total) * 100)}%`,
      fill: engagementColorMap[name] || chartColorsHex.charts.gray,
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Filter leads by criteria
 */
export function filterLeads(
  leads: UnifiedLead[],
  filters: {
    source?: string;
    intent?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
    search?: string;
  }
): UnifiedLead[] {
  return leads.filter((lead) => {
    // Source filter
    if (filters.source && filters.source !== 'all') {
      if (filters.source === 'lead-form') {
        const isLeadForm =
          lead.leadSource === 'Lead Form' || lead.originalSource === 'leadForm';
        if (!isLeadForm) return false;
      } else if (filters.source === 'ai-conversation') {
        const isAIConvo =
          lead.leadSource === 'AI Conversation' || lead.originalSource === 'aiConversation';
        if (!isAIConvo) return false;
      }
    }

    // Intent filter
    if (filters.intent && filters.intent !== 'all') {
      if (lead.leadIntent !== filters.intent) return false;
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (lead.leadStatus !== filters.status) return false;
    }

    // Date range filter
    if (filters.dateFrom && lead.timestamp < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && lead.timestamp > filters.dateTo) {
      return false;
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        lead.name.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower) ||
        lead.phone?.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    return true;
  });
}

/**
 * Get top performers by various metrics
 */
export function getTopLeads(
  leads: UnifiedLead[],
  metric: 'score' | 'engagement',
  limit: number = 10
): UnifiedLead[] {
  const sorted = [...leads].sort((a, b) => {
    if (metric === 'score') {
      return (b.leadScore || 0) - (a.leadScore || 0);
    }
    if (metric === 'engagement') {
      return (b.sentimentScore || 0) - (a.sentimentScore || 0);
    }
    return 0;
  });

  return sorted.slice(0, limit);
}

/**
 * Calculate conversion funnel metrics
 */
export function calculateConversionFunnel(leads: UnifiedLead[]): {
  total: number;
  contacted: number;
  qualified: number;
  converted: number;
  contactedRate: number;
  qualifiedRate: number;
  convertedRate: number;
} {
  const total = leads.length;
  const contacted = leads.filter((l) => l.leadStatus === 'Contacted').length;
  const qualified = leads.filter((l) => l.leadStatus === 'Qualified').length;
  const converted = leads.filter((l) => l.leadStatus === 'Converted').length;

  return {
    total,
    contacted,
    qualified,
    converted,
    contactedRate: total > 0 ? (contacted / total) * 100 : 0,
    qualifiedRate: total > 0 ? (qualified / total) * 100 : 0,
    convertedRate: total > 0 ? (converted / total) * 100 : 0,
  };
}

/**
 * Calculate lead score distribution for histogram
 */
export function calculateLeadScoreDistribution(
  leads: UnifiedLead[]
): Array<{ name: string; value: number; range: string; count: number; fill: string }> {
  const scoreRanges = [
    { min: 0, max: 40, label: '0-40', fill: chartColorsHex.charts.red },
    { min: 41, max: 60, label: '41-60', fill: chartColorsHex.charts.orange },
    { min: 61, max: 80, label: '61-80', fill: chartColorsHex.charts.blue },
    { min: 81, max: 100, label: '81-100', fill: chartColorsHex.charts.purple },
    { min: 101, max: 200, label: '101+', fill: chartColorsHex.charts.green },
  ];

  const distribution = scoreRanges.map((range) => {
    const count = leads.filter(
      (lead) => lead.leadScore >= range.min && lead.leadScore <= range.max
    ).length;

    return {
      name: range.label,
      value: count,
      range: range.label,
      count,
      fill: range.fill,
    };
  });

  return distribution;
}

/**
 * Calculate lead source performance (UTM source breakdown)
 */
export function calculateLeadSourcePerformance(
  leads: UnifiedLead[]
): Array<{ name: string; value: number; fill: string }> {
  const sourceCounts: Record<string, number> = {};

  leads.forEach((lead) => {
    const source = lead.utmSource || 'Direct';
    sourceCounts[source] = (sourceCounts[source] || 0) + 1;
  });

  // Map sources to colors
  const sourceColorMap: Record<string, string> = {
    'Facebook': chartColorsHex.charts.blue,
    'Instagram': chartColorsHex.charts.purple,
    'Social': chartColorsHex.charts.orange,
    'Google': chartColorsHex.charts.green,
    'TikTok': chartColorsHex.brand.primary,
    'Direct': chartColorsHex.charts.gray,
  };

  return Object.entries(sourceCounts)
    .map(([name, value]) => ({
      name,
      value,
      fill: sourceColorMap[name] || chartColorsHex.charts.gray,
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Calculate employment status distribution
 */
export function calculateEmploymentStatusDistribution(
  leads: UnifiedLead[]
): Array<{ name: string; value: number; status: string; count: number; fill: string }> {
  const employmentCounts: Record<string, number> = {};

  leads.forEach((lead) => {
    const status = lead.employmentStatus || 'Not specified';
    employmentCounts[status] = (employmentCounts[status] || 0) + 1;
  });

  // Map employment status to colors
  const statusColorMap: Record<string, string> = {
    'Employed full-time': chartColorsHex.charts.green,
    'Employed part-time': chartColorsHex.charts.blue,
    'Self-employed': chartColorsHex.charts.purple,
    'Contract or probation': chartColorsHex.charts.orange,
    'Unemployed': chartColorsHex.charts.red,
    'Not specified': chartColorsHex.charts.gray,
  };

  return Object.entries(employmentCounts)
    .map(([name, value]) => ({
      name,
      value,
      status: name,
      count: value,
      fill: statusColorMap[name] || chartColorsHex.charts.gray,
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Calculate best time for outreach distribution
 */
export function calculateBestTimeForOutreach(
  leads: UnifiedLead[]
): Array<{ name: string; value: number; fill: string }> {
  const timeCounts: Record<string, number> = {};

  leads.forEach((lead) => {
    const time = lead.bestTimeForOutreach || 'Not specified';
    timeCounts[time] = (timeCounts[time] || 0) + 1;
  });

  // Map times to colors
  const timeColorMap: Record<string, string> = {
    'Morning': chartColorsHex.charts.blue,
    'Afternoon': chartColorsHex.charts.purple,
    'Evening': chartColorsHex.charts.orange,
    'Not specified': chartColorsHex.charts.gray,
  };

  return Object.entries(timeCounts)
    .map(([name, value]) => ({
      name,
      value,
      fill: timeColorMap[name] || chartColorsHex.charts.gray,
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Generate time series data with high, medium, and low intent breakdown
 */
export function generateIntentTimeSeriesData(
  leads: UnifiedLead[],
  days: number = 30
): Array<{ date: string; high: number; medium: number; low: number }> {
  const now = new Date();
  const dataPoints: Array<{ date: string; high: number; medium: number; low: number }> = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = format(startOfDay(date), 'yyyy-MM-dd');
    const dateStart = startOfDay(date);
    const dateEnd = new Date(dateStart);
    dateEnd.setDate(dateEnd.getDate() + 1);

    const dayLeads = leads.filter((lead) =>
      isWithinInterval(lead.timestamp, { start: dateStart, end: dateEnd })
    );

    const highIntent = dayLeads.filter((l) => l.leadIntent === 'High').length;
    const lowIntent = dayLeads.filter((l) => l.leadIntent === 'Low').length;
    const mediumIntent = dayLeads.length - highIntent - lowIntent; // Assume anything not high or low is medium

    dataPoints.push({
      date: dateKey,
      high: highIntent,
      medium: mediumIntent,
      low: lowIntent,
    });
  }

  return dataPoints;
}
