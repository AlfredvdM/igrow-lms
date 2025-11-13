/**
 * Lead Form Analytics Data
 * Dummy data matching Google Sheets structure for IGrow LMS
 *
 * Google Sheets Headers:
 * First Name, Last name, Email Address, Phone Number, Best Time for Outreach,
 * Preferred Contact Method, Move-in Timing, Employment Status, Rental History,
 * Pet Preference, Income Range, Date and Time Stamp, Document Readiness,
 * Apartment Selection, Lead Score, Lead intent, Lead Source, UTM Source
 */

import { chartColorsHex } from "@/data/common/chart-colors";

// Lead Quality Metrics for top cards
export const leadQualityMetrics = [
    {
        title: "78",
        subtitle: "Avg Lead Score",
        trend: "positive" as const,
        change: "+5%",
        changeDescription: "vs last month",
    },
    {
        title: "42%",
        subtitle: "High Intent Leads",
        trend: "positive" as const,
        change: "+12%",
        changeDescription: "vs last month",
    },
    {
        title: "68%",
        subtitle: "Document Ready",
        trend: "positive" as const,
        change: "+8%",
        changeDescription: "vs last month",
    },
];

// Move-in Timing Distribution (Donut Chart)
export const moveInTimingData = [
    {
        name: "Within 30 days",
        value: 45,
        fill: chartColorsHex.brand.primary,
    },
    {
        name: "1-3 months",
        value: 78,
        fill: chartColorsHex.charts.blue,
    },
    {
        name: "3-6 months",
        value: 34,
        fill: chartColorsHex.charts.purple,
    },
    {
        name: "6+ months",
        value: 23,
        fill: chartColorsHex.charts.gray,
    },
];

// Income Bracket Analysis (Horizontal Bar Chart)
export const incomeBracketData = [
    {
        range: "Under R10,000",
        count: 12,
        fill: chartColorsHex.charts.red,
    },
    {
        range: "R10,000 - R15,000",
        count: 28,
        fill: chartColorsHex.charts.orange,
    },
    {
        range: "R15,000 - R20,000",
        count: 54,
        fill: chartColorsHex.charts.blue,
    },
    {
        range: "R20,000 - R30,000",
        count: 67,
        fill: chartColorsHex.charts.purple,
    },
    {
        range: "R30,000+",
        count: 39,
        fill: chartColorsHex.charts.green,
    },
];

// Apartment Interest (Vertical Bar Chart)
export const apartmentInterestData = [
    {
        type: "Studio",
        count: 23,
        fill: chartColorsHex.charts.gray,
    },
    {
        type: "1BR 1BA",
        count: 89,
        fill: chartColorsHex.charts.blue,
    },
    {
        type: "2BR 1BA",
        count: 56,
        fill: chartColorsHex.charts.purple,
    },
    {
        type: "2BR 2BA",
        count: 67,
        fill: chartColorsHex.brand.primary,
    },
    {
        type: "3BR 2BA",
        count: 34,
        fill: chartColorsHex.charts.green,
    },
];

// Lead Intent Over Time (Stacked Area Chart)
export const leadIntentTimelineData = [
    {
        date: new Date(2025, 0, 1),
        high: 15,
        medium: 25,
        low: 10,
    },
    {
        date: new Date(2025, 0, 8),
        high: 18,
        medium: 28,
        low: 12,
    },
    {
        date: new Date(2025, 0, 15),
        high: 22,
        medium: 30,
        low: 8,
    },
    {
        date: new Date(2025, 0, 22),
        high: 28,
        medium: 32,
        low: 15,
    },
    {
        date: new Date(2025, 0, 29),
        high: 25,
        medium: 35,
        low: 10,
    },
    {
        date: new Date(2025, 1, 5),
        high: 30,
        medium: 38,
        low: 12,
    },
    {
        date: new Date(2025, 1, 12),
        high: 35,
        medium: 40,
        low: 15,
    },
    {
        date: new Date(2025, 1, 19),
        high: 32,
        medium: 42,
        low: 11,
    },
    {
        date: new Date(2025, 1, 26),
        high: 38,
        medium: 45,
        low: 13,
    },
    {
        date: new Date(2025, 2, 5),
        high: 42,
        medium: 48,
        low: 10,
    },
];

// Lead Source Performance Over Time (Stacked Bar Chart)
export const leadSourceTimelineData = [
    {
        month: new Date(2025, 0, 1),
        facebook: 300,
        instagram: 200,
        tiktok: 350,
    },
    {
        month: new Date(2025, 1, 1),
        facebook: 320,
        instagram: 300,
        tiktok: 300,
    },
    {
        month: new Date(2025, 2, 1),
        facebook: 300,
        instagram: 200,
        tiktok: 240,
    },
    {
        month: new Date(2025, 3, 1),
        facebook: 240,
        instagram: 300,
        tiktok: 280,
    },
    {
        month: new Date(2025, 4, 1),
        facebook: 320,
        instagram: 280,
        tiktok: 100,
    },
    {
        month: new Date(2025, 5, 1),
        facebook: 330,
        instagram: 300,
        tiktok: 130,
    },
    {
        month: new Date(2025, 6, 1),
        facebook: 300,
        instagram: 200,
        tiktok: 100,
    },
    {
        month: new Date(2025, 7, 1),
        facebook: 350,
        instagram: 300,
        tiktok: 200,
    },
    {
        month: new Date(2025, 8, 1),
        facebook: 300,
        instagram: 200,
        tiktok: 100,
    },
    {
        month: new Date(2025, 9, 1),
        facebook: 200,
        instagram: 300,
        tiktok: 280,
    },
    {
        month: new Date(2025, 10, 1),
        facebook: 240,
        instagram: 300,
        tiktok: 300,
    },
    {
        month: new Date(2025, 11, 1),
        facebook: 200,
        instagram: 400,
        tiktok: 350,
    },
];

// Lead Score Distribution (Histogram)
export const leadScoreDistributionData = [
    {
        range: "0-20",
        count: 8,
        fill: chartColorsHex.charts.red,
    },
    {
        range: "21-40",
        count: 15,
        fill: chartColorsHex.charts.orange,
    },
    {
        range: "41-60",
        count: 42,
        fill: chartColorsHex.charts.blue,
    },
    {
        range: "61-80",
        count: 78,
        fill: chartColorsHex.charts.purple,
    },
    {
        range: "81-100",
        count: 57,
        fill: chartColorsHex.charts.green,
    },
];

// Preferred Contact Method (Pie Chart)
export const contactMethodData = [
    {
        name: "Email",
        value: 98,
        fill: chartColorsHex.charts.blue,
    },
    {
        name: "Phone",
        value: 67,
        fill: chartColorsHex.charts.purple,
    },
    {
        name: "WhatsApp",
        value: 45,
        fill: chartColorsHex.charts.green,
    },
    {
        name: "SMS",
        value: 12,
        fill: chartColorsHex.charts.gray,
    },
];

// Lead Source Performance (Pie Chart) - Total leads by source
export const leadSourcePerformanceData = [
    {
        name: "Facebook",
        value: 3380,
        fill: chartColorsHex.brand.primary,
    },
    {
        name: "Instagram",
        value: 3280,
        fill: chartColorsHex.charts.blue,
    },
    {
        name: "TikTok",
        value: 2830,
        fill: chartColorsHex.charts.purple,
    },
];

// Employment Status (Horizontal Bar Chart)
export const employmentStatusData = [
    {
        status: "Employed full-time",
        count: 134,
        fill: chartColorsHex.charts.green,
    },
    {
        status: "Self-employed",
        count: 45,
        fill: chartColorsHex.charts.blue,
    },
    {
        status: "Part-time",
        count: 23,
        fill: chartColorsHex.charts.orange,
    },
    {
        status: "Contract",
        count: 18,
        fill: chartColorsHex.charts.purple,
    },
    {
        status: "Unemployed",
        count: 5,
        fill: chartColorsHex.charts.red,
    },
];

// Pet Preference (Donut Chart)
export const petPreferenceData = [
    {
        name: "No pets",
        value: 112,
        fill: chartColorsHex.charts.blue,
    },
    {
        name: "Has pets",
        value: 78,
        fill: chartColorsHex.charts.green,
    },
    {
        name: "Maybe",
        value: 35,
        fill: chartColorsHex.charts.gray,
    },
];

// UTM Source vs Lead Source (Grouped Bar Chart)
export const utmVsLeadSourceData = [
    {
        source: "Facebook",
        organic: 35,
        paid: 50,
    },
    {
        source: "Instagram",
        organic: 28,
        paid: 37,
    },
    {
        source: "Google",
        organic: 52,
        paid: 40,
    },
    {
        source: "Landing Page",
        organic: 45,
        paid: 33,
    },
    {
        source: "Referral",
        organic: 34,
        paid: 0,
    },
];

// Best Time for Outreach (Pie Chart)
export const outreachTimeData = [
    {
        name: "Morning (8AM-12PM)",
        value: 89,
        fill: chartColorsHex.charts.blue,
    },
    {
        name: "Afternoon (12PM-5PM)",
        value: 78,
        fill: chartColorsHex.charts.purple,
    },
    {
        name: "Evening (5PM-8PM)",
        value: 58,
        fill: chartColorsHex.charts.orange,
    },
];
