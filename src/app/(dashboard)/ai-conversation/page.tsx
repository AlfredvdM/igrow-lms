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
    aiConversationMetrics,
    conversationVolumeData,
    intentClassificationData,
    responseTimeData,
    sentimentAnalysisData,
    topQuestions,
} from "@/data/the-aura/ai-conversation-data";
import { chartColorsHex } from "@/data/common/chart-colors";

export default function AIConversationPage() {
    const { selectedCampaignId, setSelectedCampaignId } = useCampaign();
    const isDesktop = useBreakpoint("lg");

    // Show inactive state for The Bolton
    if (selectedCampaignId === "the-bolton") {
        return <CampaignInactive campaignName="The Bolton" pageName="AI Conversation Analytics" />;
    }

    return (
        <div className="flex h-full flex-col gap-8 pt-8 pb-12 px-4 lg:px-8">
            {/* Page Header with Campaign Selector */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col gap-0.5 lg:gap-1">
                    <p className="text-xl font-semibold text-primary lg:text-display-xs">AI Conversation Analytics</p>
                    <p className="text-md text-tertiary">Monitor AI chatbot performance, user engagement, and conversation insights.</p>
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
                {aiConversationMetrics.map((metric, index) => (
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

            {/* Conversation Volume */}
            <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-primary">Conversation Volume</p>
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
                            data={conversationVolumeData}
                            className="text-tertiary [&_.recharts-text]:text-xs"
                            margin={{ left: 5, right: 5, top: 5, bottom: 5 }}
                        >
                            <defs>
                                <linearGradient id="gradientConversations" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartColorsHex.charts.purple} stopOpacity="0.3" />
                                    <stop offset="95%" stopColor={chartColorsHex.charts.purple} stopOpacity="0" />
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
                            <RechartsTooltip content={<ChartTooltipContent />} />
                            <Area
                                type="monotone"
                                dataKey="conversations"
                                name="Conversations"
                                stroke={chartColorsHex.charts.purple}
                                strokeWidth={2}
                                fill="url(#gradientConversations)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Intent Classification & Response Time */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Intent Classification */}
                <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                    <p className="text-lg font-semibold text-primary">Intent Classification</p>

                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={intentClassificationData}
                                layout="vertical"
                                className="text-tertiary [&_.recharts-text]:text-xs"
                                margin={{ left: 130, right: 20, top: 5, bottom: 5 }}
                            >
                                <CartesianGrid horizontal={false} stroke="currentColor" className="text-utility-gray-100" />
                                <XAxis type="number" axisLine={false} tickLine={false} />
                                <YAxis dataKey="intent" type="category" axisLine={false} tickLine={false} width={120} />
                                <RechartsTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="count" name="Count" fill={chartColorsHex.charts.blue} radius={[0, 4, 4, 0]} maxBarSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Response Time Distribution */}
                <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                    <p className="text-lg font-semibold text-primary">Response Time Distribution</p>

                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={responseTimeData}
                                className="text-tertiary [&_.recharts-text]:text-xs"
                                margin={{ left: 5, right: 5, top: 5, bottom: 5 }}
                            >
                                <CartesianGrid vertical={false} stroke="currentColor" className="text-utility-gray-100" />
                                <XAxis dataKey="range" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <RechartsTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="count" name="Responses" fill={chartColorsHex.charts.green} radius={[4, 4, 0, 0]} maxBarSize={60} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Sentiment Analysis */}
            <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                <p className="text-lg font-semibold text-primary">Sentiment Analysis Over Time</p>

                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={sentimentAnalysisData}
                            className="text-tertiary [&_.recharts-text]:text-xs"
                            margin={{ left: 5, right: 5, top: 5, bottom: 5 }}
                        >
                            <CartesianGrid vertical={false} stroke="currentColor" className="text-utility-gray-100" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                axisLine={false}
                                tickLine={false}
                                tickMargin={10}
                            />
                            <YAxis axisLine={false} tickLine={false} tickMargin={10} />
                            <RechartsTooltip content={<ChartTooltipContent />} />
                            <Area type="monotone" dataKey="positive" name="Positive" stackId="1" stroke={chartColorsHex.charts.green} fill={chartColorsHex.charts.green} fillOpacity={0.8} />
                            <Area type="monotone" dataKey="neutral" name="Neutral" stackId="1" stroke={chartColorsHex.charts.gray} fill={chartColorsHex.charts.gray} fillOpacity={0.8} />
                            <Area type="monotone" dataKey="negative" name="Negative" stackId="1" stroke={chartColorsHex.charts.red} fill={chartColorsHex.charts.red} fillOpacity={0.8} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Questions */}
            <div className="flex flex-col gap-6 rounded-xl ring-secondary ring-inset lg:gap-5 lg:bg-primary lg:p-6 lg:shadow-xs lg:ring-1">
                <p className="text-lg font-semibold text-primary">Most Frequently Asked Questions</p>

                <div className="space-y-3">
                    {topQuestions.map((item, index) => (
                        <div key={index} className="flex items-center justify-between rounded-lg border border-border-secondary p-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                                    {index + 1}
                                </div>
                                <p className="text-sm font-medium text-fg-primary">{item.question}</p>
                            </div>
                            <span className="text-sm font-semibold text-fg-tertiary">{item.count.toLocaleString()} asks</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
