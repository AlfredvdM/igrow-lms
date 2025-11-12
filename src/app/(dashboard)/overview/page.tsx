'use client';

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { ChartTooltipContent } from "@/components/application/charts/charts-base";
import { MetricsSimple } from "@/components/application/metrics/metrics";
import { TabList, Tabs } from "@/components/application/tabs/tabs";
import { Button } from "@/components/base/buttons/button";
import { CampaignSelector } from "@/components/application/campaign-selector/campaign-selector";
import { useCampaign } from "@/providers/campaign-provider";
import { CampaignInactive } from "@/components/application/empty-state/campaign-inactive";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import {
    overviewMetrics,
    leadTimelineData,
    leadStatusData,
    topSourcesData,
    recentActivities,
} from "@/data/the-aura/overview-data";
import { chartColorsHex } from "@/data/common/chart-colors";

export default function OverviewPage() {
    const { selectedCampaignId, setSelectedCampaignId } = useCampaign();
    const isDesktop = useBreakpoint("lg");

    // Show inactive state for The Bolton
    if (selectedCampaignId === "the-bolton") {
        return <CampaignInactive campaignName="The Bolton" pageName="General Overview" />;
    }

    return (
        <div className="flex h-full flex-col gap-8 pt-8 pb-12 px-4 lg:px-8">
            {/* Page Header with Campaign Selector */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col gap-0.5 lg:gap-1">
                    <p className="text-xl font-semibold text-primary lg:text-display-xs">General Overview</p>
                    <p className="text-md text-tertiary">Complete overview of campaign performance and lead metrics.</p>
                </div>
                <div className="w-full lg:w-64">
                    <CampaignSelector
                        selectedCampaignId={selectedCampaignId}
                        onCampaignChange={setSelectedCampaignId}
                    />
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="flex w-full flex-col flex-wrap gap-4 lg:flex-row lg:gap-5">
                {overviewMetrics.map((metric, index) => (
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

            {/* Lead Generation Timeline */}
            <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-primary">Lead Generation Timeline</p>
                        <Button size="md" color="secondary">View details</Button>
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

                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={leadTimelineData}
                            className="text-tertiary [&_.recharts-text]:text-xs"
                            margin={{ left: 5, right: 5, top: 5, bottom: 5 }}
                        >
                            <defs>
                                <linearGradient id="gradientCurrent" x1="0" y1="0" x2="0" y2="1">
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

                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tickMargin={10}
                            />

                            <RechartsTooltip
                                content={<ChartTooltipContent />}
                                labelFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            />

                            <Area
                                type="monotone"
                                dataKey="current"
                                name="Current Period"
                                stroke={chartColorsHex.brand.primary}
                                strokeWidth={2}
                                fill="url(#gradientCurrent)"
                                fillOpacity={1}
                            />

                            <Area
                                type="monotone"
                                dataKey="previous"
                                name="Previous Period"
                                stroke={chartColorsHex.charts.gray}
                                strokeWidth={2}
                                fill="none"
                                strokeDasharray="5 5"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Lead Status & Top Sources */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Lead Status Distribution */}
                <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-primary">Lead Status Distribution</p>
                    </div>

                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={leadStatusData}
                                layout="vertical"
                                className="text-tertiary [&_.recharts-text]:text-xs"
                                margin={{ left: 20, right: 20, top: 5, bottom: 5 }}
                            >
                                <CartesianGrid horizontal={false} stroke="currentColor" className="text-utility-gray-100" />

                                <XAxis type="number" axisLine={false} tickLine={false} />
                                <YAxis dataKey="status" type="category" axisLine={false} tickLine={false} width={100} />

                                <RechartsTooltip content={<ChartTooltipContent />} />

                                <Bar
                                    dataKey="count"
                                    name="Leads"
                                    fill={chartColorsHex.brand.primary}
                                    radius={[0, 4, 4, 0]}
                                    maxBarSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Lead Sources */}
                <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-primary">Top Lead Sources</p>
                    </div>

                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={topSourcesData}
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
                                    height={60}
                                />
                                <YAxis axisLine={false} tickLine={false} />

                                <RechartsTooltip content={<ChartTooltipContent />} />

                                <Bar
                                    dataKey="leads"
                                    name="Leads"
                                    fill={chartColorsHex.charts.blue}
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={isDesktop ? 60 : 40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-primary">Recent Activity</p>
                    <Button size="md" color="link-gray">View all</Button>
                </div>

                <div className="divide-y divide-border-secondary">
                    {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                                {activity.avatar}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-fg-primary">
                                    <span className="font-semibold">{activity.user}</span>{' '}
                                    <span className="text-fg-tertiary">{activity.action}</span>{' '}
                                    <span className="font-medium">{activity.target}</span>
                                </p>
                                <p className="mt-0.5 text-xs text-fg-quaternary">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
