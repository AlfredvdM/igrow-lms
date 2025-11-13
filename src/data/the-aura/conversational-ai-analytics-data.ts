/**
 * Conversational AI Analytics Data
 * Data for leads generated through AI conversations
 *
 * Google Sheets Headers:
 * First Name, Last name, Email Address, Phone Number, Move-in Timing,
 * Employment Status, Rental History, Pet Preference, Preferred Contact Method,
 * Best Contact time, Income Range, Date and Time Stamp, Conversation Summary,
 * Document Readiness, Apartment Preference, Lead Viability or Intent,
 * UTM Source, UTM Medium
 */

import { chartColorsHex } from "@/data/common/chart-colors";

// Lead Quality Metrics for top cards
export const conversationalAIMetrics = [
    {
        title: "82",
        subtitle: "Avg Lead Score",
        trend: "positive" as const,
        change: "+8%",
        changeDescription: "vs last month",
    },
    {
        title: "56%",
        subtitle: "High Intent Leads",
        trend: "positive" as const,
        change: "+15%",
        changeDescription: "vs last month",
    },
    {
        title: "74%",
        subtitle: "Document Ready",
        trend: "positive" as const,
        change: "+11%",
        changeDescription: "vs last month",
    },
];

// Move-in Timing Distribution (Horizontal Bar Chart - different from lead form)
export const moveInTimingAIData = [
    {
        timing: "Within 30 days",
        count: 52,
        fill: chartColorsHex.brand.primary,
    },
    {
        timing: "1-3 months",
        count: 89,
        fill: chartColorsHex.charts.blue,
    },
    {
        timing: "3-6 months",
        count: 41,
        fill: chartColorsHex.charts.purple,
    },
    {
        timing: "6+ months",
        count: 28,
        fill: chartColorsHex.charts.gray,
    },
];

// Income Bracket Analysis (Donut Chart - different from lead form)
export const incomeBracketAIData = [
    {
        range: "Under R10,000",
        value: 15,
        fill: chartColorsHex.charts.red,
    },
    {
        range: "R10,000 - R15,000",
        value: 34,
        fill: chartColorsHex.charts.orange,
    },
    {
        range: "R15,000 - R20,000",
        value: 62,
        fill: chartColorsHex.charts.blue,
    },
    {
        range: "R20,000 - R30,000",
        value: 78,
        fill: chartColorsHex.charts.purple,
    },
    {
        range: "R30,000+",
        value: 45,
        fill: chartColorsHex.charts.green,
    },
];

// Apartment Preference (Donut Chart)
export const apartmentPreferenceAIData = [
    {
        name: "Studio",
        value: 28,
        fill: chartColorsHex.charts.gray,
    },
    {
        name: "1BR 1BA",
        value: 95,
        fill: chartColorsHex.charts.blue,
    },
    {
        name: "2BR 1BA",
        value: 64,
        fill: chartColorsHex.charts.purple,
    },
    {
        name: "2BR 2BA",
        value: 72,
        fill: chartColorsHex.brand.primary,
    },
    {
        name: "3BR 2BA",
        value: 41,
        fill: chartColorsHex.charts.green,
    },
];

// Lead Viability/Intent Over Time (Line Chart with multiple lines - different from lead form)
export const leadViabilityTimelineData = [
    {
        date: new Date(2025, 0, 1),
        high: 18,
        medium: 22,
        low: 8,
    },
    {
        date: new Date(2025, 0, 8),
        high: 22,
        medium: 25,
        low: 10,
    },
    {
        date: new Date(2025, 0, 15),
        high: 26,
        medium: 28,
        low: 7,
    },
    {
        date: new Date(2025, 0, 22),
        high: 32,
        medium: 30,
        low: 12,
    },
    {
        date: new Date(2025, 0, 29),
        high: 28,
        medium: 33,
        low: 9,
    },
    {
        date: new Date(2025, 1, 5),
        high: 35,
        medium: 36,
        low: 11,
    },
    {
        date: new Date(2025, 1, 12),
        high: 40,
        medium: 38,
        low: 13,
    },
    {
        date: new Date(2025, 1, 19),
        high: 37,
        medium: 40,
        low: 10,
    },
    {
        date: new Date(2025, 1, 26),
        high: 43,
        medium: 42,
        low: 12,
    },
    {
        date: new Date(2025, 2, 5),
        high: 48,
        medium: 45,
        low: 9,
    },
];

// UTM Source Performance (Vertical Bar Chart)
export const utmSourceAIData = [
    {
        source: "Facebook Ads",
        leads: 450,
        fill: chartColorsHex.brand.primary,
    },
    {
        source: "Instagram Ads",
        leads: 380,
        fill: chartColorsHex.charts.blue,
    },
    {
        source: "Google Ads",
        leads: 320,
        fill: chartColorsHex.charts.purple,
    },
    {
        source: "TikTok Ads",
        leads: 290,
        fill: chartColorsHex.charts.orange,
    },
    {
        source: "Organic",
        leads: 240,
        fill: chartColorsHex.charts.green,
    },
];

// UTM Medium Performance (Pie Chart)
export const utmMediumAIData = [
    {
        name: "CPC",
        value: 820,
        fill: chartColorsHex.brand.primary,
    },
    {
        name: "Social",
        value: 650,
        fill: chartColorsHex.charts.blue,
    },
    {
        name: "Display",
        value: 380,
        fill: chartColorsHex.charts.purple,
    },
    {
        name: "Organic",
        value: 240,
        fill: chartColorsHex.charts.green,
    },
    {
        name: "Referral",
        value: 150,
        fill: chartColorsHex.charts.gray,
    },
];

// Preferred Contact Method (Horizontal Bar Chart - different from lead form)
export const contactMethodAIData = [
    {
        method: "Email",
        count: 112,
        fill: chartColorsHex.charts.blue,
    },
    {
        method: "Phone",
        count: 78,
        fill: chartColorsHex.charts.purple,
    },
    {
        method: "WhatsApp",
        count: 52,
        fill: chartColorsHex.charts.green,
    },
    {
        method: "SMS",
        count: 18,
        fill: chartColorsHex.charts.gray,
    },
];

// Employment Status (Pie Chart - different from lead form)
export const employmentStatusAIData = [
    {
        name: "Employed full-time",
        value: 148,
        fill: chartColorsHex.charts.green,
    },
    {
        name: "Self-employed",
        value: 52,
        fill: chartColorsHex.charts.blue,
    },
    {
        name: "Part-time",
        value: 28,
        fill: chartColorsHex.charts.orange,
    },
    {
        name: "Contract",
        value: 22,
        fill: chartColorsHex.charts.purple,
    },
    {
        name: "Unemployed",
        value: 6,
        fill: chartColorsHex.charts.red,
    },
];

// Pet Preference (Vertical Bar Chart - different from lead form)
export const petPreferenceAIData = [
    {
        preference: "No pets",
        count: 128,
        fill: chartColorsHex.charts.blue,
    },
    {
        preference: "Has pets",
        count: 89,
        fill: chartColorsHex.charts.green,
    },
    {
        preference: "Maybe",
        count: 43,
        fill: chartColorsHex.charts.gray,
    },
];

// Best Contact Time (Donut Chart - different from lead form)
export const contactTimeAIData = [
    {
        name: "Morning (8AM-12PM)",
        value: 102,
        fill: chartColorsHex.charts.blue,
    },
    {
        name: "Afternoon (12PM-5PM)",
        value: 89,
        fill: chartColorsHex.charts.purple,
    },
    {
        name: "Evening (5PM-8PM)",
        value: 69,
        fill: chartColorsHex.charts.orange,
    },
];

// Rental History (Stacked Bar Chart)
export const rentalHistoryAIData = [
    {
        category: "First-time Renter",
        positive: 45,
        neutral: 12,
        negative: 3,
    },
    {
        category: "Good History",
        positive: 98,
        neutral: 18,
        negative: 4,
    },
    {
        category: "Average History",
        positive: 42,
        neutral: 28,
        negative: 10,
    },
    {
        category: "Poor History",
        positive: 8,
        neutral: 15,
        negative: 22,
    },
];

// Document Readiness Distribution (Pie Chart)
export const documentReadinessAIData = [
    {
        name: "All Documents Ready",
        value: 135,
        fill: chartColorsHex.charts.green,
    },
    {
        name: "Partial Documents",
        value: 78,
        fill: chartColorsHex.charts.orange,
    },
    {
        name: "No Documents",
        value: 47,
        fill: chartColorsHex.charts.red,
    },
];

// Conversation Summary Insights (for display as metrics or list)
export const conversationInsights = [
    {
        category: "Pricing Questions",
        count: 186,
        percentage: 71.5,
    },
    {
        category: "Availability Inquiries",
        count: 142,
        percentage: 54.6,
    },
    {
        category: "Amenities Interest",
        count: 108,
        percentage: 41.5,
    },
    {
        category: "Location Concerns",
        count: 89,
        percentage: 34.2,
    },
    {
        category: "Lease Terms",
        count: 76,
        percentage: 29.2,
    },
];
