export const leadFormMetrics = [
    {
        title: "12,453",
        subtitle: "Form Views",
        trend: "positive" as const,
        change: "+8.3%",
    },
    {
        title: "3,247",
        subtitle: "Submissions",
        trend: "positive" as const,
        change: "+14.2%",
    },
    {
        title: "26.1%",
        subtitle: "Completion Rate",
        trend: "positive" as const,
        change: "+1.8%",
    },
    {
        title: "2m 34s",
        subtitle: "Avg. Time to Complete",
        trend: "negative" as const,
        change: "+12s",
    },
];

export const submissionTimelineData = [
    { date: "2025-01-01", submissions: 85 },
    { date: "2025-01-02", submissions: 92 },
    { date: "2025-01-03", submissions: 78 },
    { date: "2025-01-04", submissions: 105 },
    { date: "2025-01-05", submissions: 98 },
    { date: "2025-01-06", submissions: 112 },
    { date: "2025-01-07", submissions: 95 },
    { date: "2025-01-08", submissions: 118 },
    { date: "2025-01-09", submissions: 102 },
    { date: "2025-01-10", submissions: 125 },
    { date: "2025-01-11", submissions: 110 },
    { date: "2025-01-12", submissions: 132 },
    { date: "2025-01-13", submissions: 119 },
    { date: "2025-01-14", submissions: 128 },
    { date: "2025-01-15", submissions: 115 },
    { date: "2025-01-16", submissions: 135 },
    { date: "2025-01-17", submissions: 122 },
    { date: "2025-01-18", submissions: 142 },
    { date: "2025-01-19", submissions: 129 },
    { date: "2025-01-20", submissions: 138 },
    { date: "2025-01-21", submissions: 125 },
    { date: "2025-01-22", submissions: 145 },
    { date: "2025-01-23", submissions: 132 },
    { date: "2025-01-24", submissions: 148 },
    { date: "2025-01-25", submissions: 135 },
    { date: "2025-01-26", submissions: 152 },
    { date: "2025-01-27", submissions: 139 },
    { date: "2025-01-28", submissions: 155 },
    { date: "2025-01-29", submissions: 142 },
    { date: "2025-01-30", submissions: 158 },
];

export const fieldCompletionData = [
    { field: "First Name", completion: 98.5 },
    { field: "Last Name", completion: 97.2 },
    { field: "Email Address", completion: 95.8 },
    { field: "Phone Number", completion: 82.4 },
    { field: "Company Name", completion: 76.3 },
    { field: "Job Title", completion: 68.9 },
    { field: "Company Size", completion: 65.2 },
    { field: "Message/Inquiry", completion: 58.7 },
    { field: "Budget Range", completion: 45.3 },
    { field: "Preferred Contact Method", completion: 72.1 },
];

export const deviceBreakdownData = [
    { date: "2025-01-01", mobile: 52, desktop: 28, tablet: 5 },
    { date: "2025-01-05", mobile: 58, desktop: 32, tablet: 8 },
    { date: "2025-01-10", mobile: 62, desktop: 35, tablet: 10 },
    { date: "2025-01-15", mobile: 68, desktop: 38, tablet: 9 },
    { date: "2025-01-20", mobile: 71, desktop: 42, tablet: 12 },
    { date: "2025-01-25", mobile: 75, desktop: 45, tablet: 11 },
    { date: "2025-01-30", mobile: 78, desktop: 48, tablet: 13 },
];

export const dropoffAnalysisData = [
    { stage: "Form Viewed", count: 12453, percentage: 100 },
    { stage: "Started Filling", count: 8942, percentage: 71.8 },
    { stage: "Half Completed", count: 5683, percentage: 45.6 },
    { stage: "Reached Submit Button", count: 3892, percentage: 31.2 },
    { stage: "Successfully Submitted", count: 3247, percentage: 26.1 },
];

export const formFieldAnalysis = {
    mostCompleted: "First Name (98.5%)",
    leastCompleted: "Budget Range (45.3%)",
    avgTimePerField: "15.4 seconds",
    errorRate: "2.3%",
    commonErrors: [
        { field: "Email Address", error: "Invalid format", occurrences: 342 },
        { field: "Phone Number", error: "Missing country code", occurrences: 287 },
        { field: "Company Name", error: "Too short", occurrences: 145 },
    ],
};
