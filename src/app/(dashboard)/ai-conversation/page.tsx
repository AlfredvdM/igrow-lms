'use client';

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Label,
    Legend,
    Line,
    LineChart,
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
import { CampaignSelector } from "@/components/application/campaign-selector/campaign-selector";
import { useCampaign } from "@/providers/campaign-provider";
import { CampaignInactive } from "@/components/application/empty-state/campaign-inactive";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useAIConversationData } from "@/hooks/use-leads";
import { chartColorsHex } from "@/data/common/chart-colors";

export default function AIConversationPage() {
    const { selectedCampaignId, setSelectedCampaignId } = useCampaign();
    const isDesktop = useBreakpoint("lg");

    // Fetch live data from API
    const { data, isLoading, error } = useAIConversationData();

    // Show inactive state for The Bolton
    if (selectedCampaignId === "the-bolton") {
        return <CampaignInactive campaignName="The Bolton" pageName="Conversational AI Analytics" />;
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-600 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-sm font-medium text-fg-primary">Loading AI conversation data...</p>
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

    const { stats, charts, leads } = data.data;

    // Use real chart data from API
    const moveInTimingAIData = charts.moveInTimingData || [];
    const incomeBracketAIData = charts.incomeBracketData || [];
    const apartmentPreferenceAIData = charts.apartmentPreferenceData || [];
    const leadViabilityTimelineData = charts.timeSeriesData || [];

    // Placeholder data for charts not yet implemented
    const utmSourceAIData: any[] = [];
    const utmMediumAIData: any[] = [];
    const contactMethodAIData: any[] = [];
    const employmentStatusAIData: any[] = [];
    const petPreferenceAIData: any[] = [];
    const contactTimeAIData: any[] = [];
    const documentReadinessAIData: any[] = [];

    // Prepare metrics for display
    const displayMetrics = [
        {
            title: stats.totalLeads.toLocaleString(),
            subtitle: "Total AI Conversations",
            trend: "positive" as const,
            change: "+18.2%",
        },
        {
            title: `${stats.highIntentPercentage}%`,
            subtitle: "High Intent Rate",
            trend: "positive" as const,
            change: `${stats.highIntentCount} leads`,
        },
        {
            title: stats.avgSentimentScore.toString(),
            subtitle: "Avg Sentiment Score",
            trend: "positive" as const,
            change: "+0.3pts",
        },
        {
            title: stats.avgLeadScore.toString(),
            subtitle: "Avg Lead Score",
            trend: "positive" as const,
            change: "+5pts",
        },
    ];

    return (
        <div className="flex h-full flex-col gap-8 pt-8 pb-12 px-4 lg:px-8">
            {/* Page Header with Campaign Selector */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col gap-0.5 lg:gap-1">
                    <p className="text-xl font-semibold text-primary lg:text-display-xs">Conversational AI Analytics</p>
                    <p className="text-md text-tertiary">AI-generated lead insights including preferences, intent analysis, and conversation outcomes.</p>
                </div>
                <div className="w-full lg:w-64">
                    <CampaignSelector
                        selectedCampaignId={selectedCampaignId}
                        onCampaignChange={setSelectedCampaignId}
                    />
                </div>
            </div>

            {/* Lead Quality Metrics Grid */}
            <div className="flex w-full flex-col flex-wrap gap-4 lg:flex-row lg:gap-5">
                {displayMetrics.map((metric, index) => (
                    <MetricsSimple
                        key={index}
                        title={metric.title}
                        subtitle={metric.subtitle}
                        type="modern"
                        trend={metric.trend}
                        change={metric.change}
                        className="flex-1 lg:min-w-[280px]"
                    />
                ))}
            </div>

            {/* Move-in Timing & Income Brackets */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Move-in Timing Distribution (Horizontal Bar Chart) */}
                <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-lg font-semibold text-primary">Move-in Timing Distribution</p>
                            <p className="text-sm text-tertiary mt-1">When AI leads plan to move in</p>
                        </div>
                    </div>

                    <div className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={moveInTimingAIData}
                                layout="vertical"
                                className="text-tertiary [&_.recharts-text]:text-xs"
                                margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
                            >
                                <CartesianGrid horizontal={false} stroke="currentColor" className="text-utility-gray-100" />
                                <XAxis type="number" axisLine={false} tickLine={false} />
                                <YAxis dataKey="timing" type="category" axisLine={false} tickLine={false} width={100} />
                                <RechartsTooltip content={<ChartTooltipContent />} />
                                <Bar
                                    dataKey="count"
                                    name="Leads"
                                    radius={[0, 4, 4, 0]}
                                    maxBarSize={40}
                                >
                                    {moveInTimingAIData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Income Bracket Analysis (Donut Chart) */}
                <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                    <div>
                        <p className="text-lg font-semibold text-primary">Income Bracket Analysis</p>
                        <p className="text-sm text-tertiary mt-1">AI conversation income distribution</p>
                    </div>

                    <div className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Legend
                                    verticalAlign="bottom"
                                    align="center"
                                    layout="horizontal"
                                    content={<ChartLegendContent />}
                                />
                                <RechartsTooltip content={<ChartTooltipContent isPieChart />} />
                                <Pie
                                    data={incomeBracketAIData}
                                    dataKey="value"
                                    nameKey="range"
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    startAngle={90}
                                    endAngle={-270}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Apartment Preference & Document Readiness */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Apartment Preference (Donut Chart) */}
                <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                    <div>
                        <p className="text-lg font-semibold text-primary">Apartment Preferences</p>
                        <p className="text-sm text-tertiary mt-1">Most requested apartment types</p>
                    </div>

                    <div className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Legend
                                    verticalAlign="bottom"
                                    align="center"
                                    layout="horizontal"
                                    content={<ChartLegendContent />}
                                />
                                <RechartsTooltip content={<ChartTooltipContent isPieChart />} />
                                <Pie
                                    data={apartmentPreferenceAIData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Document Readiness Distribution (Pie Chart) */}
                <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                    <div>
                        <p className="text-lg font-semibold text-primary">Document Readiness</p>
                        <p className="text-sm text-tertiary mt-1">Lead preparation status</p>
                    </div>

                    <div className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Legend
                                    verticalAlign="bottom"
                                    align="center"
                                    layout="horizontal"
                                    content={<ChartLegendContent />}
                                />
                                <RechartsTooltip content={<ChartTooltipContent isPieChart />} />
                                <Pie
                                    data={documentReadinessAIData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="45%"
                                    outerRadius={100}
                                    paddingAngle={2}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Lead Viability Over Time (Line Chart) */}
            <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-lg font-semibold text-primary">Lead Viability Over Time</p>
                            <p className="text-sm text-tertiary mt-1">High, medium, and low viability trends</p>
                        </div>
                        <Button size="md" color="secondary">Export data</Button>
                    </div>
                    <Tabs>
                        <TabList
                            type="button-gray"
                            items={[
                                { id: "90days", label: "90 days" },
                                { id: "30days", label: "30 days" },
                                { id: "7days", label: "7 days" },
                            ]}
                        />
                    </Tabs>
                </div>

                <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={leadViabilityTimelineData}
                            className="text-tertiary [&_.recharts-text]:text-xs"
                            margin={{ left: 5, right: 5, top: 5, bottom: 30 }}
                        >
                            <CartesianGrid vertical={false} stroke="currentColor" className="text-utility-gray-100" />
                            <Legend
                                verticalAlign="bottom"
                                align="center"
                                layout="horizontal"
                                content={<ChartLegendContent />}
                            />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                axisLine={false}
                                tickLine={false}
                                tickMargin={10}
                            />
                            <YAxis axisLine={false} tickLine={false} tickMargin={10} />
                            <RechartsTooltip content={<ChartTooltipContent />} />
                            <Line
                                type="monotone"
                                dataKey="high"
                                name="High Viability"
                                stroke={chartColorsHex.charts.green}
                                strokeWidth={2}
                                dot={{ fill: chartColorsHex.charts.green, r: 3 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="medium"
                                name="Medium Viability"
                                stroke={chartColorsHex.charts.blue}
                                strokeWidth={2}
                                dot={{ fill: chartColorsHex.charts.blue, r: 3 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="low"
                                name="Low Viability"
                                stroke={chartColorsHex.charts.orange}
                                strokeWidth={2}
                                dot={{ fill: chartColorsHex.charts.orange, r: 3 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* UTM Source Performance (Vertical Bar Chart) */}
            <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                <div>
                    <p className="text-lg font-semibold text-primary">UTM Source Performance</p>
                    <p className="text-sm text-tertiary mt-1">Lead generation by traffic source</p>
                </div>

                <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={utmSourceAIData}
                            className="text-tertiary [&_.recharts-text]:text-xs"
                            margin={{ left: 5, right: 5, top: 5, bottom: 60 }}
                        >
                            <CartesianGrid vertical={false} stroke="currentColor" className="text-utility-gray-100" />
                            <XAxis
                                dataKey="source"
                                axisLine={false}
                                tickLine={false}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis axisLine={false} tickLine={false} />
                            <RechartsTooltip content={<ChartTooltipContent />} />
                            <Bar
                                dataKey="leads"
                                name="Leads"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={60}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* UTM Medium & Employment Status */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* UTM Medium Performance (Pie Chart) */}
                <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                    <div>
                        <p className="text-lg font-semibold text-primary">UTM Medium Distribution</p>
                        <p className="text-sm text-tertiary mt-1">Traffic medium breakdown</p>
                    </div>

                    <div className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Legend
                                    verticalAlign="bottom"
                                    align="center"
                                    layout="horizontal"
                                    content={<ChartLegendContent />}
                                />
                                <RechartsTooltip content={<ChartTooltipContent isPieChart />} />
                                <Pie
                                    data={utmMediumAIData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="45%"
                                    outerRadius={100}
                                    paddingAngle={2}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Employment Status (Pie Chart) */}
                <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                    <div>
                        <p className="text-lg font-semibold text-primary">Employment Status</p>
                        <p className="text-sm text-tertiary mt-1">Lead employment distribution</p>
                    </div>

                    <div className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Legend
                                    verticalAlign="bottom"
                                    align="center"
                                    layout="horizontal"
                                    content={<ChartLegendContent />}
                                />
                                <RechartsTooltip content={<ChartTooltipContent isPieChart />} />
                                <Pie
                                    data={employmentStatusAIData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="45%"
                                    outerRadius={100}
                                    paddingAngle={2}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Contact Method & Pet Preference */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Preferred Contact Method (Horizontal Bar Chart) */}
                <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                    <div>
                        <p className="text-lg font-semibold text-primary">Preferred Contact Methods</p>
                        <p className="text-sm text-tertiary mt-1">How AI leads want to be reached</p>
                    </div>

                    <div className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={contactMethodAIData}
                                layout="vertical"
                                className="text-tertiary [&_.recharts-text]:text-xs"
                                margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
                            >
                                <CartesianGrid horizontal={false} stroke="currentColor" className="text-utility-gray-100" />
                                <XAxis type="number" axisLine={false} tickLine={false} />
                                <YAxis dataKey="method" type="category" axisLine={false} tickLine={false} width={100} />
                                <RechartsTooltip content={<ChartTooltipContent />} />
                                <Bar
                                    dataKey="count"
                                    name="Leads"
                                    radius={[0, 4, 4, 0]}
                                    maxBarSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pet Preference (Vertical Bar Chart) */}
                <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                    <div>
                        <p className="text-lg font-semibold text-primary">Pet Preferences</p>
                        <p className="text-sm text-tertiary mt-1">Leads with or without pets</p>
                    </div>

                    <div className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={petPreferenceAIData}
                                className="text-tertiary [&_.recharts-text]:text-xs"
                                margin={{ left: 5, right: 5, top: 5, bottom: 20 }}
                            >
                                <CartesianGrid vertical={false} stroke="currentColor" className="text-utility-gray-100" />
                                <XAxis dataKey="preference" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <RechartsTooltip content={<ChartTooltipContent />} />
                                <Bar
                                    dataKey="count"
                                    name="Leads"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={60}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Best Contact Time (Donut Chart) */}
            <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                <div>
                    <p className="text-lg font-semibold text-primary">Best Time for Outreach</p>
                    <p className="text-sm text-tertiary mt-1">Preferred contact time windows from AI conversations</p>
                </div>

                <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Legend
                                verticalAlign="bottom"
                                align="center"
                                layout="horizontal"
                                content={<ChartLegendContent />}
                            />
                            <RechartsTooltip content={<ChartTooltipContent isPieChart />} />
                            <Pie
                                data={contactTimeAIData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="45%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
