export const aiConversationMetrics = [
    {
        title: "4,582",
        subtitle: "Total Conversations",
        trend: "positive" as const,
        change: "+22.7%",
    },
    {
        title: "8.3",
        subtitle: "Avg. Messages per Chat",
        trend: "positive" as const,
        change: "+0.8",
    },
    {
        title: "4.7/5",
        subtitle: "User Satisfaction",
        trend: "positive" as const,
        change: "+0.3",
    },
    {
        title: "12.4%",
        subtitle: "Handoff to Human",
        trend: "negative" as const,
        change: "-2.1%",
    },
];

export const conversationVolumeData = [
    { date: "2025-01-01", conversations: 128 },
    { date: "2025-01-02", conversations: 142 },
    { date: "2025-01-03", conversations: 135 },
    { date: "2025-01-04", conversations: 156 },
    { date: "2025-01-05", conversations: 149 },
    { date: "2025-01-06", conversations: 168 },
    { date: "2025-01-07", conversations: 152 },
    { date: "2025-01-08", conversations: 175 },
    { date: "2025-01-09", conversations: 163 },
    { date: "2025-01-10", conversations: 182 },
    { date: "2025-01-11", conversations: 171 },
    { date: "2025-01-12", conversations: 189 },
    { date: "2025-01-13", conversations: 178 },
    { date: "2025-01-14", conversations: 195 },
    { date: "2025-01-15", conversations: 184 },
    { date: "2025-01-16", conversations: 201 },
    { date: "2025-01-17", conversations: 192 },
    { date: "2025-01-18", conversations: 208 },
    { date: "2025-01-19", conversations: 197 },
    { date: "2025-01-20", conversations: 215 },
    { date: "2025-01-21", conversations: 203 },
    { date: "2025-01-22", conversations: 222 },
    { date: "2025-01-23", conversations: 211 },
    { date: "2025-01-24", conversations: 228 },
    { date: "2025-01-25", conversations: 218 },
    { date: "2025-01-26", conversations: 235 },
    { date: "2025-01-27", conversations: 224 },
    { date: "2025-01-28", conversations: 242 },
    { date: "2025-01-29", conversations: 231 },
    { date: "2025-01-30", conversations: 248 },
];

export const intentClassificationData = [
    { intent: "Product Inquiry", count: 1849, percentage: 40.3 },
    { intent: "Pricing Information", count: 1420, percentage: 31.0 },
    { intent: "Technical Support", count: 687, percentage: 15.0 },
    { intent: "Demo Request", count: 412, percentage: 9.0 },
    { intent: "General Questions", count: 214, percentage: 4.7 },
];

export const responseTimeData = [
    { range: "< 1 sec", count: 2834, percentage: 61.8 },
    { range: "1-3 sec", count: 1145, percentage: 25.0 },
    { range: "3-5 sec", count: 412, percentage: 9.0 },
    { range: "> 5 sec", count: 191, percentage: 4.2 },
];

export const sentimentAnalysisData = [
    { date: "2025-01-01", positive: 85, neutral: 35, negative: 8 },
    { date: "2025-01-05", positive: 92, neutral: 42, negative: 12 },
    { date: "2025-01-10", positive: 102, neutral: 55, negative: 15 },
    { date: "2025-01-15", positive: 115, neutral: 52, negative: 13 },
    { date: "2025-01-20", positive: 125, neutral: 65, negative: 18 },
    { date: "2025-01-25", positive: 135, neutral: 58, negative: 16 },
    { date: "2025-01-30", positive: 148, neutral: 72, negative: 20 },
];

export const conversationFlowData = [
    {
        path: "Greeting → Product Inquiry → Pricing → Demo Request",
        count: 892,
        avgMessages: 6.2,
        conversionRate: 68.5,
    },
    {
        path: "Greeting → Technical Question → Support → Resolved",
        count: 654,
        avgMessages: 8.7,
        conversionRate: 45.2,
    },
    {
        path: "Greeting → Pricing → Objection → Follow-up",
        count: 523,
        avgMessages: 10.3,
        conversionRate: 32.8,
    },
    {
        path: "Greeting → General → Product Info → Exit",
        count: 412,
        avgMessages: 4.5,
        conversionRate: 12.3,
    },
    {
        path: "Greeting → Demo Request → Scheduling → Booked",
        count: 345,
        avgMessages: 5.8,
        conversionRate: 85.7,
    },
];

export const topQuestions = [
    { question: "What are your pricing plans?", count: 1248 },
    { question: "Do you offer a free trial?", count: 892 },
    { question: "What integrations do you support?", count: 678 },
    { question: "How does billing work?", count: 534 },
    { question: "Can I export my data?", count: 423 },
    { question: "What are the setup requirements?", count: 389 },
    { question: "Do you provide customer support?", count: 345 },
    { question: "How secure is your platform?", count: 298 },
];

export const aiPerformanceMetrics = {
    accuracyRate: 94.8,
    intentRecognitionRate: 92.3,
    avgConfidenceScore: 87.6,
    escalationRate: 12.4,
    resolutionRate: 78.9,
    fallbackActivations: 234,
};
