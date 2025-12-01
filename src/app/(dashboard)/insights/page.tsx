'use client';

/**
 * Insights Page
 * Analytics dashboard with charts and metrics
 */

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartTooltipContent } from '@/components/application/charts/charts-base';
import { MetricsSimple } from '@/components/application/metrics/metrics';
import { CampaignSelector } from '@/components/application/campaign-selector/campaign-selector';
import { useCampaign } from '@/providers/campaign-provider';
import {
  useLeadStats,
  useLeadTimeline,
  useApartmentBreakdown,
  useContactMethodBreakdown,
  useEmploymentBreakdown,
  useLeadSourceBreakdown,
  useLeads,
} from '@/hooks/use-supabase-leads';
import { chartColorsHex } from '@/data/common/chart-colors';
import { useMemo, useState } from 'react';

// Date range options for the timeline chart
const DATE_RANGE_OPTIONS = [
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
  { label: 'All time', value: null },
] as const;

type DateRangeValue = typeof DATE_RANGE_OPTIONS[number]['value'];

// Color palette for charts
const CHART_COLORS = [
  chartColorsHex.brand.primary,
  chartColorsHex.charts.blue,
  chartColorsHex.charts.green,
  chartColorsHex.charts.orange,
  chartColorsHex.charts.purple,
  chartColorsHex.charts.red,
];

// Loading skeleton for metric cards
function MetricSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-border-secondary bg-bg-primary p-5">
      <div className="h-4 bg-bg-tertiary rounded w-24 mb-2" />
      <div className="h-8 bg-bg-tertiary rounded w-16" />
    </div>
  );
}

// Loading skeleton for charts
function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="animate-pulse rounded-xl border border-border-secondary bg-bg-primary p-6">
      <div className="h-5 bg-bg-tertiary rounded w-40 mb-2" />
      <div className="h-4 bg-bg-tertiary rounded w-64 mb-6" />
      <div className="bg-bg-tertiary rounded" style={{ height }} />
    </div>
  );
}

// Chart card wrapper
function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border-secondary bg-bg-primary p-6 shadow-xs">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-fg-primary">{title}</h3>
        {subtitle && <p className="text-sm text-fg-tertiary mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export default function InsightsPage() {
  const { selectedCampaignId, setSelectedCampaignId } = useCampaign();
  const [timelineDateRange, setTimelineDateRange] = useState<DateRangeValue>(30);

  // Fetch all data
  const { data: stats, isLoading: statsLoading } = useLeadStats(selectedCampaignId);
  const { data: timeline, isLoading: timelineLoading } = useLeadTimeline(selectedCampaignId, timelineDateRange);
  const { data: apartmentData, isLoading: apartmentLoading } = useApartmentBreakdown(selectedCampaignId);
  const { data: contactData, isLoading: contactLoading } = useContactMethodBreakdown(selectedCampaignId);
  const { data: employmentData, isLoading: employmentLoading } = useEmploymentBreakdown(selectedCampaignId);
  const { data: sourceData, isLoading: sourceLoading } = useLeadSourceBreakdown(selectedCampaignId);

  // Fetch leads to aggregate best outreach time
  const { data: leadsData, isLoading: leadsLoading } = useLeads(selectedCampaignId, { limit: 1000 });

  // Aggregate best outreach time from leads
  const outreachTimeData = useMemo(() => {
    if (!leadsData?.data) return [];

    const counts: Record<string, number> = {};
    let total = 0;

    leadsData.data.forEach((lead) => {
      const time = lead.best_outreach_time || 'Not Specified';
      counts[time] = (counts[time] || 0) + 1;
      total++;
    });

    return Object.entries(counts)
      .map(([time, count], index) => ({
        name: time,
        value: count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        fill: CHART_COLORS[index % CHART_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [leadsData]);

  // Format apartment data for charts
  const formattedApartmentData = useMemo(() => {
    return (apartmentData || []).map((item, index) => ({
      name: item.type === 'Not Specified' ? 'Not Specified' : item.type.replace(' Apartment', '').replace(' Penthouse', ' PH'),
      value: item.count,
      percentage: item.percentage,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [apartmentData]);

  // Format contact method data
  const formattedContactData = useMemo(() => {
    return (contactData || []).map((item, index) => ({
      name: item.method,
      value: item.count,
      percentage: item.percentage,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [contactData]);

  // Format employment data
  const formattedEmploymentData = useMemo(() => {
    return (employmentData || []).map((item, index) => ({
      name: item.status,
      value: item.count,
      percentage: item.percentage,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [employmentData]);

  // Format source data
  const formattedSourceData = useMemo(() => {
    return (sourceData || []).map((item, index) => ({
      name: item.source,
      value: item.count,
      percentage: item.percentage,
      fill: index === 0 ? chartColorsHex.brand.primary : chartColorsHex.charts.blue,
    }));
  }, [sourceData]);

  // Format timeline data
  const formattedTimelineData = useMemo(() => {
    return (timeline || []).map((item) => ({
      date: item.date,
      leads: item.count,
    }));
  }, [timeline]);

  const isAnyLoading = statsLoading || timelineLoading || apartmentLoading || contactLoading || employmentLoading || sourceLoading || leadsLoading;

  return (
    <div className="flex h-full flex-col gap-8 pt-8 pb-12 px-4 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-0.5 lg:gap-1">
          <h1 className="text-xl font-semibold text-primary lg:text-display-xs">Insights</h1>
          <p className="text-md text-tertiary">
            Analytics and performance metrics for your campaigns.
          </p>
        </div>
        <div className="w-full lg:w-64">
          <CampaignSelector
            selectedCampaignId={selectedCampaignId}
            onCampaignChange={setSelectedCampaignId}
          />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          <>
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
          </>
        ) : (
          <>
            <MetricsSimple
              title={stats?.totalLeads.toLocaleString() || '0'}
              subtitle="Total Leads"
              trend="neutral"
            />
            <MetricsSimple
              title={stats?.leadsThisWeek.toLocaleString() || '0'}
              subtitle="Leads This Week"
              trend={stats?.leadsThisWeek && stats.leadsThisWeek > 0 ? 'positive' : 'neutral'}
            />
            <MetricsSimple
              title={stats?.topApartmentType?.replace(' Apartment', '').replace(' Penthouse', ' PH') || '-'}
              subtitle="Top Apartment Type"
              trend="neutral"
            />
            <MetricsSimple
              title={stats?.topContactMethod || '-'}
              subtitle="Top Contact Method"
              trend="neutral"
            />
          </>
        )}
      </div>

      {/* Lead Volume Timeline */}
      {timelineLoading ? (
        <ChartSkeleton height={300} />
      ) : (
        <div className="rounded-xl border border-border-secondary bg-bg-primary p-6 shadow-xs">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-fg-primary">Lead Volume Over Time</h3>
              <p className="text-sm text-fg-tertiary mt-1">
                {timelineDateRange === null
                  ? 'Daily lead submissions - all time'
                  : `Daily lead submissions over the last ${timelineDateRange} days`}
              </p>
            </div>
            <div className="flex gap-1 rounded-lg bg-bg-secondary p-1">
              {DATE_RANGE_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setTimelineDateRange(option.value)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    timelineDateRange === option.value
                      ? 'bg-bg-primary text-fg-primary shadow-sm'
                      : 'text-fg-tertiary hover:text-fg-secondary'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={formattedTimelineData}
                margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gradientLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColorsHex.brand.primary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={chartColorsHex.brand.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#E4E7EC" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                  }
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  tick={{ fontSize: 12, fill: '#667085' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  tick={{ fontSize: 12, fill: '#667085' }}
                />
                <RechartsTooltip
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  }
                />
                <Area
                  type="monotone"
                  dataKey="leads"
                  name="Leads"
                  stroke={chartColorsHex.brand.primary}
                  strokeWidth={2}
                  fill="url(#gradientLeads)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Two Column Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Apartment Preference */}
        {apartmentLoading ? (
          <ChartSkeleton height={280} />
        ) : (
          <ChartCard
            title="Apartment Preferences"
            subtitle="Distribution by apartment type"
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={formattedApartmentData}
                  layout="vertical"
                  margin={{ left: 20, right: 20, top: 10, bottom: 10 }}
                >
                  <CartesianGrid horizontal={false} stroke="#E4E7EC" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#667085' }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#667085' }}
                    width={100}
                  />
                  <RechartsTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" name="Leads" radius={[0, 4, 4, 0]}>
                    {formattedApartmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        )}

        {/* Contact Method Distribution */}
        {contactLoading ? (
          <ChartSkeleton height={280} />
        ) : (
          <ChartCard
            title="Contact Method Distribution"
            subtitle="Preferred ways to contact leads"
          >
            <div className="h-72 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={formattedContactData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                  >
                    {formattedContactData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<ChartTooltipContent isPieChart />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="flex flex-col gap-2 pr-4">
                {formattedContactData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="size-3 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-sm text-fg-tertiary whitespace-nowrap">{item.name}</span>
                    <span className="text-sm font-medium text-fg-primary">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        )}
      </div>

      {/* Three Column Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Best Outreach Time */}
        {leadsLoading ? (
          <ChartSkeleton height={220} />
        ) : (
          <ChartCard
            title="Best Time for Outreach"
            subtitle="When leads prefer to be contacted"
          >
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={outreachTimeData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#E4E7EC" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#667085' }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#667085' }} />
                  <RechartsTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" name="Leads" radius={[4, 4, 0, 0]}>
                    {outreachTimeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        )}

        {/* Employment Status */}
        {employmentLoading ? (
          <ChartSkeleton height={220} />
        ) : (
          <ChartCard
            title="Employment Status"
            subtitle="Lead distribution by employment"
          >
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedEmploymentData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#E4E7EC" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#667085' }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#667085' }} />
                  <RechartsTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" name="Leads" radius={[4, 4, 0, 0]}>
                    {formattedEmploymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        )}

        {/* Lead Source Attribution */}
        {sourceLoading ? (
          <ChartSkeleton height={220} />
        ) : (
          <ChartCard
            title="Lead Source Attribution"
            subtitle="Where leads are coming from"
          >
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedSourceData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#E4E7EC" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#667085' }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#667085' }} />
                  <RechartsTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" name="Leads" radius={[4, 4, 0, 0]}>
                    {formattedSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        )}
      </div>
    </div>
  );
}
