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
    leadFormMetrics,
    submissionTimelineData,
    fieldCompletionData,
    deviceBreakdownData,
    dropoffAnalysisData,
} from "@/data/the-aura/lead-form-data";
import { chartColorsHex } from "@/data/common/chart-colors";

export default function LeadFormPage() {
    const { selectedCampaignId, setSelectedCampaignId } = useCampaign();
    const isDesktop = useBreakpoint("lg");

    // Show inactive state for The Bolton
    if (selectedCampaignId === "the-bolton") {
        return <CampaignInactive campaignName="The Bolton" pageName="Lead Form Analytics" />;
    }

    return (
        <div className="flex h-full flex-col gap-8 pt-8 pb-12 px-4 lg:px-8">
            {/* Page Header with Campaign Selector */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col gap-0.5 lg:gap-1">
                    <p className="text-xl font-semibold text-primary lg:text-display-xs">Lead Form Analytics</p>
                    <p className="text-md text-tertiary">Track form submissions, completion rates, and user behavior.</p>
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
                {leadFormMetrics.map((metric, index) => (
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

            {/* Submission Timeline */}
            <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-primary">Form Submission Timeline</p>
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

                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={submissionTimelineData}
                            className="text-tertiary [&_.recharts-text]:text-xs"
                            margin={{ left: 5, right: 5, top: 5, bottom: 5 }}
                        >
                            <defs>
                                <linearGradient id="gradientSubmissions" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartColorsHex.charts.green} stopOpacity="0.3" />
                                    <stop offset="95%" stopColor={chartColorsHex.charts.green} stopOpacity="0" />
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
                                labelFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            />
                            <Area
                                type="monotone"
                                dataKey="submissions"
                                name="Submissions"
                                stroke={chartColorsHex.charts.green}
                                strokeWidth={2}
                                fill="url(#gradientSubmissions)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Field Completion & Device Breakdown */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Field Completion Rates */}
                <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                    <p className="text-lg font-semibold text-primary">Field Completion Rates</p>

                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={fieldCompletionData}
                                layout="vertical"
                                className="text-tertiary [&_.recharts-text]:text-xs"
                                margin={{ left: 120, right: 20, top: 5, bottom: 5 }}
                            >
                                <CartesianGrid horizontal={false} stroke="currentColor" className="text-utility-gray-100" />
                                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} />
                                <YAxis dataKey="field" type="category" axisLine={false} tickLine={false} width={110} />
                                <RechartsTooltip content={<ChartTooltipContent />} />
                                <Bar
                                    dataKey="completion"
                                    name="Completion %"
                                    fill={chartColorsHex.charts.purple}
                                    radius={[0, 4, 4, 0]}
                                    maxBarSize={30}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Device Breakdown */}
                <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                    <p className="text-lg font-semibold text-primary">Device Breakdown</p>

                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={deviceBreakdownData}
                                className="text-tertiary [&_.recharts-text]:text-xs"
                                margin={{ left: 5, right: 5, top: 5, bottom: 40 }}
                            >
                                <CartesianGrid vertical={false} stroke="currentColor" className="text-utility-gray-100" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    axisLine={false}
                                    tickLine={false}
                                    angle={-45}
                                    textAnchor="end"
                                />
                                <YAxis axisLine={false} tickLine={false} />
                                <RechartsTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="mobile" name="Mobile" stackId="a" fill={chartColorsHex.charts.blue} />
                                <Bar dataKey="desktop" name="Desktop" stackId="a" fill={chartColorsHex.charts.orange} />
                                <Bar dataKey="tablet" name="Tablet" stackId="a" fill={chartColorsHex.charts.purple} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Drop-off Analysis */}
            <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                <p className="text-lg font-semibold text-primary">Form Drop-off Analysis</p>

                <div className="space-y-4">
                    {dropoffAnalysisData.map((stage, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium text-fg-primary">{stage.stage}</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-fg-tertiary">{stage.count.toLocaleString()} users</span>
                                    <span className="font-semibold text-fg-primary">{stage.percentage}%</span>
                                </div>
                            </div>
                            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                                <div
                                    className="h-3 rounded-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all"
                                    style={{ width: `${stage.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
