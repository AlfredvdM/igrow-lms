/**
 * Overview Dashboard Data
 * High-level metrics and activity for the overview page
 */

import { chartColorsHex } from "@/data/common/chart-colors";

// Top-level metrics for overview
export const overviewMetrics = [
    {
        title: "2,847",
        subtitle: "Total Leads",
        trend: "positive" as const,
        change: "+12.5%",
        changeDescription: "vs last month",
    },
    {
        title: "58%",
        subtitle: "High Intent Leads",
        trend: "positive" as const,
        change: "+8.2%",
        changeDescription: "vs last month",
    },
    {
        title: "76",
        subtitle: "Avg Lead Score",
        trend: "positive" as const,
        change: "+4pts",
        changeDescription: "vs last month",
    },
];

// Lead generation timeline (30 days)
export const leadTimelineData = [
    { date: new Date(2025, 0, 1), leads: 45 },
    { date: new Date(2025, 0, 2), leads: 52 },
    { date: new Date(2025, 0, 3), leads: 48 },
    { date: new Date(2025, 0, 4), leads: 61 },
    { date: new Date(2025, 0, 5), leads: 55 },
    { date: new Date(2025, 0, 6), leads: 67 },
    { date: new Date(2025, 0, 7), leads: 59 },
    { date: new Date(2025, 0, 8), leads: 72 },
    { date: new Date(2025, 0, 9), leads: 68 },
    { date: new Date(2025, 0, 10), leads: 75 },
    { date: new Date(2025, 0, 11), leads: 71 },
    { date: new Date(2025, 0, 12), leads: 79 },
    { date: new Date(2025, 0, 13), leads: 83 },
    { date: new Date(2025, 0, 14), leads: 78 },
    { date: new Date(2025, 0, 15), leads: 85 },
    { date: new Date(2025, 0, 16), leads: 81 },
    { date: new Date(2025, 0, 17), leads: 88 },
    { date: new Date(2025, 0, 18), leads: 92 },
    { date: new Date(2025, 0, 19), leads: 87 },
    { date: new Date(2025, 0, 20), leads: 94 },
    { date: new Date(2025, 0, 21), leads: 89 },
    { date: new Date(2025, 0, 22), leads: 96 },
    { date: new Date(2025, 0, 23), leads: 93 },
    { date: new Date(2025, 0, 24), leads: 99 },
    { date: new Date(2025, 0, 25), leads: 95 },
    { date: new Date(2025, 0, 26), leads: 102 },
    { date: new Date(2025, 0, 27), leads: 98 },
    { date: new Date(2025, 0, 28), leads: 105 },
    { date: new Date(2025, 0, 29), leads: 101 },
    { date: new Date(2025, 0, 30), leads: 108 },
];

// Lead Intent Distribution
export const leadIntentData = [
    {
        name: "High Intent",
        value: 1652,
        percentage: 58,
        fill: chartColorsHex.charts.green,
    },
    {
        name: "Medium Intent",
        value: 854,
        percentage: 30,
        fill: chartColorsHex.charts.blue,
    },
    {
        name: "Low Intent",
        value: 341,
        percentage: 12,
        fill: chartColorsHex.charts.orange,
    },
];

// Lead Status Distribution
export const leadStatusData = [
    { status: "New", count: 542, fill: chartColorsHex.charts.blue },
    { status: "Contacted", count: 768, fill: chartColorsHex.charts.purple },
    { status: "Qualified", count: 625, fill: chartColorsHex.charts.orange },
    { status: "Converted", count: 682, fill: chartColorsHex.charts.green },
    { status: "Lost", count: 230, fill: chartColorsHex.charts.red },
];

// Top Lead Sources
export const topSourcesData = [
    {
        source: "Lead Form",
        leads: 1425,
        percentage: 50,
        fill: chartColorsHex.brand.primary,
    },
    {
        source: "AI Conversation",
        leads: 1422,
        percentage: 50,
        fill: chartColorsHex.charts.blue,
    },
];

// Lead Source Breakdown (for more detail)
export const leadSourceBreakdown = [
    { source: "Facebook Ads", leads: 892, type: "Lead Form" },
    { source: "Instagram", leads: 533, type: "Lead Form + AI" },
    { source: "AI Chatbot", leads: 889, type: "AI Conversation" },
    { source: "Landing Page", leads: 445, type: "Lead Form" },
    { source: "Google Ads", leads: 523, type: "Lead Form + AI" },
    { source: "TikTok", leads: 565, type: "AI Conversation" },
];

// Recent Lead Activity
export const recentLeadActivity = [
    {
        id: 1,
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        source: "Lead Form - Facebook Ads",
        intent: "High",
        score: 92,
        time: "2 minutes ago",
        status: "new",
    },
    {
        id: 2,
        name: "Michael Chen",
        email: "m.chen@email.com",
        source: "AI Conversation - Instagram",
        intent: "High",
        score: 88,
        time: "15 minutes ago",
        status: "contacted",
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        email: "emily.r@email.com",
        source: "Lead Form - Landing Page",
        intent: "Medium",
        score: 76,
        time: "1 hour ago",
        status: "qualified",
    },
    {
        id: 4,
        name: "David Kim",
        email: "david.kim@email.com",
        source: "AI Conversation - TikTok",
        intent: "High",
        score: 85,
        time: "2 hours ago",
        status: "new",
    },
    {
        id: 5,
        name: "Lisa Anderson",
        email: "lisa.a@email.com",
        source: "Lead Form - Google Ads",
        intent: "High",
        score: 94,
        time: "3 hours ago",
        status: "converted",
    },
    {
        id: 6,
        name: "James Wilson",
        email: "j.wilson@email.com",
        source: "AI Conversation - Facebook",
        intent: "Medium",
        score: 72,
        time: "4 hours ago",
        status: "contacted",
    },
    {
        id: 7,
        name: "Maria Garcia",
        email: "maria.g@email.com",
        source: "Lead Form - Instagram",
        intent: "High",
        score: 89,
        time: "5 hours ago",
        status: "qualified",
    },
    {
        id: 8,
        name: "Robert Taylor",
        email: "r.taylor@email.com",
        source: "AI Conversation - Landing Page",
        intent: "Low",
        score: 58,
        time: "6 hours ago",
        status: "new",
    },
];

// Quick Stats for side cards
export const quickStats = [
    {
        label: "Avg Response Time",
        value: "1.8s",
        trend: "positive" as const,
    },
    {
        label: "Document Ready",
        value: "71%",
        trend: "positive" as const,
    },
    {
        label: "Active Conversations",
        value: "342",
        trend: "positive" as const,
    },
];
