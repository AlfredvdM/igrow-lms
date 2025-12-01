'use client';

import { useState, useMemo } from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    XAxis,
    YAxis,
} from "recharts";
import { ChartTooltipContent, ChartLegendContent } from "@/components/application/charts/charts-base";
import { MetricsSimple } from "@/components/application/metrics/metrics";
import { TabList, Tabs } from "@/components/application/tabs/tabs";
import { Button } from "@/components/base/buttons/button";
import { Badge } from "@/components/base/badges/badges";
import { Select } from "@/components/base/select/select";
import { DateRangePicker } from "@/components/application/date-picker/date-range-picker";
import { CampaignSelector } from "@/components/application/campaign-selector/campaign-selector";
import { useCampaign } from "@/providers/campaign-provider";
import { CampaignInactive } from "@/components/application/empty-state/campaign-inactive";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useOverviewData } from "@/hooks/use-leads";
import { chartColorsHex } from "@/data/common/chart-colors";
import type { LeadIntent, LeadStatus } from "@/types/sheets";

export default function OverviewPage() {
    const { selectedCampaignId, setSelectedCampaignId } = useCampaign();
    const isDesktop = useBreakpoint("lg");

    // Fetch live data from API
    const { data, isLoading, error } = useOverviewData();

    // Filter states - ALL HOOKS MUST BE AT THE TOP
    const [sourceFilter, setSourceFilter] = useState<string>("all");
    const [intentFilter, setIntentFilter] = useState<string>("all");
    const [dateRange, setDateRange] = useState<any>(null);

    // Filter leads based on selected filters - useMemo must be before any returns
    const filteredLeads = useMemo(() => {
        const recentActivity = data?.data?.recentActivity;
        if (!recentActivity) return [];

        return recentActivity.filter((lead) => {
            // Source filter
            if (sourceFilter !== "all") {
                const isLeadForm = lead.source.includes("Lead Form");
                const isAIConversation = lead.source.includes("AI Conversation");
                if (sourceFilter === "lead-form" && !isLeadForm) return false;
                if (sourceFilter === "ai-conversation" && !isAIConversation) return false;
            }

            // Intent filter
            if (intentFilter !== "all" && lead.intent !== intentFilter) return false;

            return true;
        });
    }, [data?.data?.recentActivity, sourceFilter, intentFilter, dateRange]);

    // Show inactive state for The Bolton
    if (selectedCampaignId === "the-bolton") {
        return <CampaignInactive campaignName="The Bolton" pageName="Overview" />;
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-600 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-sm font-medium text-fg-primary">Loading overview data...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !data?.success) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center max-w-md">
                    <p className="text-lg font-semibold text-fg-primary">Failed to load data</p>
                    <p className="mt-2 text-sm text-fg-tertiary">
                        {error?.message || 'Please check your Google Sheets configuration and try again.'}
                    </p>
                    <Button size="md" color="primary" className="mt-4" onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    const { metrics, recentActivity, timelineData } = data.data;

    const getIntentBadgeColor = (intent: string) => {
        if (intent === "High") return "success";
        if (intent === "Medium") return "warning";
        return "gray";
    };

    const getStatusBadgeColor = (status: string) => {
        if (status === "converted") return "success";
        if (status === "qualified") return "brand";
        if (status === "contacted") return "blue-light";
        return "gray";
    };

    // Use real timeline data from API
    const leadTimelineData = timelineData || [];

    // Prepare metrics for display
    const displayMetrics = [
        {
            title: metrics.totalLeads.toLocaleString(),
            subtitle: "Total Leads",
            trend: metrics.totalLeadsChange.startsWith('+') ? "positive" as const : "negative" as const,
            change: metrics.totalLeadsChange,
        },
        {
            title: `${metrics.highIntentPercentage}%`,
            subtitle: "High Intent Leads",
            trend: metrics.highIntentChange.startsWith('+') ? "positive" as const : "negative" as const,
            change: metrics.highIntentChange,
        },
        {
            title: metrics.avgLeadScore.toString(),
            subtitle: "Avg Lead Score",
            trend: metrics.avgScoreChange.startsWith('+') ? "positive" as const : "negative" as const,
            change: metrics.avgScoreChange,
        },
    ];

    return (
        <div className="flex h-full flex-col gap-8 pt-8 pb-12 px-4 lg:px-8">
            {/* Page Header with Campaign Selector */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col gap-0.5 lg:gap-1">
                    <p className="text-xl font-semibold text-primary lg:text-display-xs">Overview</p>
                    <p className="text-md text-tertiary">High-level performance metrics and recent lead activity.</p>
                </div>
                <div className="relative z-50 w-full lg:w-64">
                    <CampaignSelector
                        selectedCampaignId={selectedCampaignId}
                        onCampaignChange={setSelectedCampaignId}
                    />
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {displayMetrics.map((metric, index) => (
                    <MetricsSimple
                        key={index}
                        title={metric.title}
                        subtitle={metric.subtitle}
                        type="modern"
                        trend={metric.trend}
                        change={metric.change}
                    />
                ))}
            </div>

            {/* Lead Generation Timeline */}
            <div
                className="group relative flex flex-col gap-6 rounded-2xl border border-white/20 p-8 transition-all duration-300 overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-[#b6364b]/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-lg font-semibold text-primary">Leads Coming In</p>
                            <p className="text-sm text-tertiary mt-1">Daily lead generation over the last 30 days</p>
                        </div>
                        <Button size="md" color="secondary">Export data</Button>
                    </div>
                    <Tabs>
                        <TabList
                            type="button-gray"
                            items={[
                                { id: "30days", label: "30 days" },
                                { id: "7days", label: "7 days" },
                                { id: "24hours", label: "24 hours" },
                            ]}
                        />
                    </Tabs>
                </div>

                <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={leadTimelineData}
                            className="text-tertiary [&_.recharts-text]:text-xs"
                            margin={{ left: 5, right: 5, top: 5, bottom: 30 }}
                        >
                            <defs>
                                <linearGradient id="gradientLeads" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartColorsHex.brand.primary} stopOpacity="0.3" />
                                    <stop offset="95%" stopColor={chartColorsHex.brand.primary} stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} stroke="currentColor" className="text-utility-gray-100" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                axisLine={false}
                                tickLine={false}
                                tickMargin={10}
                            />
                            <YAxis axisLine={false} tickLine={false} tickMargin={10} />
                            <RechartsTooltip
                                content={<ChartTooltipContent />}
                                labelFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
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

            {/* Recent Lead Activity */}
            <div
                className="group relative flex flex-col gap-6 rounded-2xl border border-white/20 p-8 transition-all duration-300 overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-[#b6364b]/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex flex-col gap-4">
                    <div>
                        <p className="text-lg font-semibold text-primary">Recent Lead Activity</p>
                        <p className="text-sm text-tertiary mt-1">Latest leads coming into the system</p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-3">
                        <Select
                            size="md"
                            placeholder="All sources"
                            selectedKey={sourceFilter}
                            onSelectionChange={(key) => setSourceFilter(key as string)}
                            items={[
                                { id: "all", label: "All sources" },
                                { id: "lead-form", label: "Lead Form" },
                                { id: "ai-conversation", label: "AI Conversation" },
                            ]}
                            className="w-48"
                        >
                            {(item) => <Select.Item id={item.id} key={item.id}>{item.label}</Select.Item>}
                        </Select>

                        <Select
                            size="md"
                            placeholder="All intents"
                            selectedKey={intentFilter}
                            onSelectionChange={(key) => setIntentFilter(key as string)}
                            items={[
                                { id: "all", label: "All intents" },
                                { id: "High", label: "High" },
                                { id: "Low", label: "Low" },
                            ]}
                            className="w-48"
                        >
                            {(item) => <Select.Item id={item.id} key={item.id}>{item.label}</Select.Item>}
                        </Select>

                        <DateRangePicker
                            value={dateRange}
                            onChange={setDateRange}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr className="border-b border-gray-100">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Source</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Intent</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Score</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredLeads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-medium text-fg-primary">{lead.name}</p>
                                            <p className="text-xs text-fg-quaternary">{lead.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-fg-secondary">{lead.source}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge size="sm" color={getIntentBadgeColor(lead.intent)}>
                                            {lead.intent}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-12 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-bg-brand-solid rounded-full"
                                                    style={{ width: `${lead.score}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-fg-primary">{lead.score}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {lead.status && (
                                            <Badge size="sm" color={getStatusBadgeColor(lead.status.toLowerCase())}>
                                                {lead.status}
                                            </Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-fg-quaternary">{lead.time}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredLeads.length === 0 && (
                        <div className="py-12 text-center">
                            <p className="text-sm text-tertiary">No leads found matching the selected filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
