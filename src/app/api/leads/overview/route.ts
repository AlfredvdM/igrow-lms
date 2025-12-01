/**
 * API Route: GET /api/leads/overview
 * Fetches all leads and returns overview page data
 */

import { NextResponse } from 'next/server';
import { fetchAllLeads } from '@/lib/google-sheets';
import {
  calculateOverviewMetrics,
  getLeadsForMetricsComparison,
  convertToLeadActivityItems,
  generateOverviewTimelineData,
} from '@/lib/analytics-enhanced';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Fetch all leads from Google Sheets
    const allLeads = await fetchAllLeads();

    // Debug: Log lead scores to verify they're being parsed correctly
    console.log('========== OVERVIEW API DEBUG ==========');
    console.log('Total leads:', allLeads.length);
    console.log('Leads by source:', {
      overview: allLeads.filter(l => l.originalSource === 'overview').length,
      leadForm: allLeads.filter(l => l.originalSource === 'leadForm').length,
      aiConversation: allLeads.filter(l => l.originalSource === 'aiConversation').length,
    });
    console.log('Sample lead scores:', allLeads.slice(0, 10).map(l => ({
      name: l.name,
      score: l.leadScore,
      type: typeof l.leadScore,
      source: l.originalSource
    })));

    const totalScoreDebug = allLeads.reduce((sum, l) => sum + Number(l.leadScore || 0), 0);
    console.log('Total score sum:', totalScoreDebug);
    console.log('Average (manual calc):', totalScoreDebug / allLeads.length);
    console.log('========================================');

    // Get current and previous month leads for comparison
    const { currentMonthLeads, previousMonthLeads } = getLeadsForMetricsComparison(allLeads);

    // Calculate metrics based on ALL leads (not just current month)
    const metrics = calculateOverviewMetrics(allLeads, previousMonthLeads);

    // Convert to activity items for the table (limit to 50 most recent)
    const recentActivity = convertToLeadActivityItems(allLeads).slice(0, 50);

    // Generate timeline data for chart
    const timelineData = generateOverviewTimelineData(allLeads, 30);

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        recentActivity,
        timelineData,
        totalLeadsCount: allLeads.length,
        currentMonthCount: currentMonthLeads.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching overview data:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch overview data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
