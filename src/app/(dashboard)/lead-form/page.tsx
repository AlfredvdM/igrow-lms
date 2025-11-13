'use client';

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Label,
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
import { CampaignSelector } from "@/components/application/campaign-selector/campaign-selector";
import { useCampaign } from "@/providers/campaign-provider";
import { CampaignInactive } from "@/components/application/empty-state/campaign-inactive";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import {
    leadQualityMetrics,
    moveInTimingData,
    incomeBracketData,
    apartmentInterestData,
    leadIntentTimelineData,
    leadScoreDistributionData,
    leadSourcePerformanceData,
    employmentStatusData,
    petPreferenceData,
    outreachTimeData,
} from "@/data/the-aura/lead-form-analytics-data";
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
                    <p className="text-md text-tertiary">Comprehensive insights into lead quality, preferences, and behavior patterns.</p>
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
                {leadQualityMetrics.map((metric, index) => (
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
                {/* Move-in Timing Distribution (Donut Chart) */}
                <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-lg font-semibold text-primary">Move-in Timing Distribution</p>
                            <p className="text-sm text-tertiary mt-1">When leads plan to move in</p>
                        </div>
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
                                    data={moveInTimingData}
                                    dataKey="value"
                                    nameKey="name"
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

                {/* Income Bracket Analysis (Vertical Bar Chart) */}
                <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                    <div>
                        <p className="text-lg font-semibold text-primary">Income Bracket Analysis</p>
                        <p className="text-sm text-tertiary mt-1">Distribution of lead income ranges</p>
                    </div>

                    <div className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={incomeBracketData}
                                className="text-tertiary [&_.recharts-text]:text-xs"
                                margin={{ left: 5, right: 5, top: 5, bottom: 60 }}
                            >
                                <CartesianGrid vertical={false} stroke="currentColor" className="text-utility-gray-100" />
                                <XAxis
                                    dataKey="range"
                                    axisLine={false}
                                    tickLine={false}
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                />
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

            {/* Apartment Interest & Lead Score Distribution */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Apartment Interest (Vertical Bar Chart) */}
                <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                    <div>
                        <p className="text-lg font-semibold text-primary">Apartment Selection Preferences</p>
                        <p className="text-sm text-tertiary mt-1">Most popular apartment types</p>
                    </div>

                    <div className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={apartmentInterestData}
                                className="text-tertiary [&_.recharts-text]:text-xs"
                                margin={{ left: 5, right: 5, top: 5, bottom: 40 }}
                            >
                                <CartesianGrid vertical={false} stroke="currentColor" className="text-utility-gray-100" />
                                <XAxis
                                    dataKey="type"
                                    axisLine={false}
                                    tickLine={false}
                                    angle={-45}
                                    textAnchor="end"
                                />
                                <YAxis axisLine={false} tickLine={false} />
                                <RechartsTooltip content={<ChartTooltipContent />} />
                                <Bar
                                    dataKey="count"
                                    name="Leads Interested"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={60}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Lead Score Distribution (Histogram) */}
                <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                    <div>
                        <p className="text-lg font-semibold text-primary">Lead Score Distribution</p>
                        <p className="text-sm text-tertiary mt-1">Quality score breakdown (0-100)</p>
                    </div>

                    <div className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={leadScoreDistributionData}
                                className="text-tertiary [&_.recharts-text]:text-xs"
                                margin={{ left: 5, right: 5, top: 5, bottom: 20 }}
                            >
                                <CartesianGrid vertical={false} stroke="currentColor" className="text-utility-gray-100" />
                                <XAxis dataKey="range" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <RechartsTooltip content={<ChartTooltipContent />} />
                                <Bar
                                    dataKey="count"
                                    name="Number of Leads"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={60}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Lead Intent Over Time (Stacked Area Chart) */}
            <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-lg font-semibold text-primary">Lead Intent Over Time</p>
                            <p className="text-sm text-tertiary mt-1">High, medium, and low intent trends</p>
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
                        <AreaChart
                            data={leadIntentTimelineData}
                            className="text-tertiary [&_.recharts-text]:text-xs"
                            margin={{ left: 5, right: 5, top: 5, bottom: 30 }}
                        >
                            <defs>
                                <linearGradient id="gradientHigh" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartColorsHex.charts.green} stopOpacity="0.8" />
                                    <stop offset="95%" stopColor={chartColorsHex.charts.green} stopOpacity="0.1" />
                                </linearGradient>
                                <linearGradient id="gradientMedium" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartColorsHex.charts.blue} stopOpacity="0.8" />
                                    <stop offset="95%" stopColor={chartColorsHex.charts.blue} stopOpacity="0.1" />
                                </linearGradient>
                                <linearGradient id="gradientLow" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartColorsHex.charts.orange} stopOpacity="0.8" />
                                    <stop offset="95%" stopColor={chartColorsHex.charts.orange} stopOpacity="0.1" />
                                </linearGradient>
                            </defs>

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
                            <Area
                                type="monotone"
                                dataKey="high"
                                name="High Intent"
                                stackId="1"
                                stroke={chartColorsHex.charts.green}
                                strokeWidth={2}
                                fill="url(#gradientHigh)"
                            />
                            <Area
                                type="monotone"
                                dataKey="medium"
                                name="Medium Intent"
                                stackId="1"
                                stroke={chartColorsHex.charts.blue}
                                strokeWidth={2}
                                fill="url(#gradientMedium)"
                            />
                            <Area
                                type="monotone"
                                dataKey="low"
                                name="Low Intent"
                                stackId="1"
                                stroke={chartColorsHex.charts.orange}
                                strokeWidth={2}
                                fill="url(#gradientLow)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Lead Source Performance & Employment Status */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Lead Source Performance (Pie Chart) */}
                <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                    <div>
                        <p className="text-lg font-semibold text-primary">Lead Source Performance</p>
                        <p className="text-sm text-tertiary mt-1">Total leads by source</p>
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
                                    data={leadSourcePerformanceData}
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

                {/* Employment Status (Horizontal Bar Chart) */}
                <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                    <div>
                        <p className="text-lg font-semibold text-primary">Employment Status Breakdown</p>
                        <p className="text-sm text-tertiary mt-1">Lead employment distribution</p>
                    </div>

                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={employmentStatusData}
                                layout="vertical"
                                className="text-tertiary [&_.recharts-text]:text-xs"
                                margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
                            >
                                <CartesianGrid horizontal={false} stroke="currentColor" className="text-utility-gray-100" />
                                <XAxis type="number" axisLine={false} tickLine={false} />
                                <YAxis dataKey="status" type="category" axisLine={false} tickLine={false} width={150} />
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
            </div>

            {/* Pet Preference & Best Time for Outreach */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Pet Preference (Donut Chart) */}
                <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                    <div>
                        <p className="text-lg font-semibold text-primary">Pet Preferences</p>
                        <p className="text-sm text-tertiary mt-1">Leads with or without pets</p>
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
                                    data={petPreferenceData}
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

                {/* Best Time for Outreach (Pie Chart) */}
                <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                    <div>
                        <p className="text-lg font-semibold text-primary">Best Time for Outreach</p>
                        <p className="text-sm text-tertiary mt-1">Preferred contact time windows</p>
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
                                    data={outreachTimeData}
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
        </div>
    );
}
