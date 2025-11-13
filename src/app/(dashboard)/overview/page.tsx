'use client';

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
import { CampaignSelector } from "@/components/application/campaign-selector/campaign-selector";
import { useCampaign } from "@/providers/campaign-provider";
import { CampaignInactive } from "@/components/application/empty-state/campaign-inactive";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import {
    overviewMetrics,
    leadTimelineData,
    leadIntentData,
    leadStatusData,
    topSourcesData,
    recentLeadActivity,
} from "@/data/the-aura/overview-data";
import { chartColorsHex } from "@/data/common/chart-colors";

export default function OverviewPage() {
    const { selectedCampaignId, setSelectedCampaignId } = useCampaign();
    const isDesktop = useBreakpoint("lg");

    // Show inactive state for The Bolton
    if (selectedCampaignId === "the-bolton") {
        return <CampaignInactive campaignName="The Bolton" pageName="Overview" />;
    }

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

    return (
        <div className="flex h-full flex-col gap-8 pt-8 pb-12 px-4 lg:px-8">
            {/* Page Header with Campaign Selector */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col gap-0.5 lg:gap-1">
                    <p className="text-xl font-semibold text-primary lg:text-display-xs">Overview</p>
                    <p className="text-md text-tertiary">High-level performance metrics and recent lead activity.</p>
                </div>
                <div className="w-full lg:w-64">
                    <CampaignSelector
                        selectedCampaignId={selectedCampaignId}
                        onCampaignChange={setSelectedCampaignId}
                    />
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                {overviewMetrics.map((metric, index) => (
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
            <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                <div className="flex flex-col gap-5">
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

            {/* Lead Intent, Status, and Sources - 3 column grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Lead Intent Distribution (Pie Chart) */}
                <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                    <div>
                        <p className="text-lg font-semibold text-primary">Lead Intent</p>
                        <p className="text-sm text-tertiary mt-1">Intent distribution</p>
                    </div>

                    <div className="h-64 flex items-center justify-center">
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
                                    data={leadIntentData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="40%"
                                    outerRadius={60}
                                    paddingAngle={2}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Lead Status (Horizontal Bar Chart) */}
                <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                    <div>
                        <p className="text-lg font-semibold text-primary">Lead Status</p>
                        <p className="text-sm text-tertiary mt-1">Current pipeline</p>
                    </div>

                    <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={leadStatusData}
                                layout="vertical"
                                className="text-tertiary [&_.recharts-text]:text-xs"
                                margin={{ left: 10, right: 10, top: 5, bottom: 5 }}
                            >
                                <CartesianGrid horizontal={false} stroke="currentColor" className="text-utility-gray-100" />
                                <XAxis type="number" axisLine={false} tickLine={false} />
                                <YAxis dataKey="status" type="category" axisLine={false} tickLine={false} width={80} />
                                <RechartsTooltip content={<ChartTooltipContent />} />
                                <Bar
                                    dataKey="count"
                                    name="Leads"
                                    radius={[0, 4, 4, 0]}
                                    maxBarSize={30}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Lead Sources (Pie Chart) */}
                <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                    <div>
                        <p className="text-lg font-semibold text-primary">Lead Sources</p>
                        <p className="text-sm text-tertiary mt-1">Form vs AI split</p>
                    </div>

                    <div className="h-64 flex items-center justify-center">
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
                                    data={topSourcesData}
                                    dataKey="leads"
                                    nameKey="source"
                                    cx="50%"
                                    cy="40%"
                                    outerRadius={60}
                                    paddingAngle={2}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Lead Activity */}
            <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-lg font-semibold text-primary">Recent Lead Activity</p>
                        <p className="text-sm text-tertiary mt-1">Latest leads coming into the system</p>
                    </div>
                    <Button size="md" color="link-gray">View all leads</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border-secondary">
                                <th className="pb-3 text-left text-xs font-medium text-fg-tertiary">Name</th>
                                <th className="pb-3 text-left text-xs font-medium text-fg-tertiary">Source</th>
                                <th className="pb-3 text-left text-xs font-medium text-fg-tertiary">Intent</th>
                                <th className="pb-3 text-left text-xs font-medium text-fg-tertiary">Score</th>
                                <th className="pb-3 text-left text-xs font-medium text-fg-tertiary">Status</th>
                                <th className="pb-3 text-left text-xs font-medium text-fg-tertiary">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-secondary">
                            {recentLeadActivity.map((lead) => (
                                <tr key={lead.id} className="hover:bg-bg-secondary/50 transition-colors">
                                    <td className="py-3">
                                        <div>
                                            <p className="text-sm font-medium text-fg-primary">{lead.name}</p>
                                            <p className="text-xs text-fg-quaternary">{lead.email}</p>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <p className="text-sm text-fg-secondary">{lead.source}</p>
                                    </td>
                                    <td className="py-3">
                                        <Badge size="sm" color={getIntentBadgeColor(lead.intent)}>
                                            {lead.intent}
                                        </Badge>
                                    </td>
                                    <td className="py-3">
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
                                    <td className="py-3">
                                        <Badge size="sm" color={getStatusBadgeColor(lead.status)}>
                                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                                        </Badge>
                                    </td>
                                    <td className="py-3">
                                        <p className="text-sm text-fg-quaternary">{lead.time}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
