/**
 * API Route: GET /api/leads/ai-conversation
 * Fetches AI conversation data from Google Sheets (Talking Funnel tab)
 */

import { NextResponse } from 'next/server';
import { fetchLeadsBySource } from '@/lib/google-sheets';
import {
  calculateIntentDistribution,
  generateTimeSeriesData,
  getTopLeads,
  calculateMoveInTimingDistribution,
  calculateIncomeBracketDistribution,
  calculateApartmentPreferenceDistribution,
  calculateEngagementDistribution,
} from '@/lib/analytics-enhanced';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Fetch leads from Talking Funnel (AI Conversation) tab
    const leads = await fetchLeadsBySource('aiConversation');

    // Calculate distributions and metrics
    const intentDistribution = calculateIntentDistribution(leads);
    const timeSeriesData = generateTimeSeriesData(leads, 30);
    const topLeads = getTopLeads(leads, 'engagement', 10);
    const moveInTimingData = calculateMoveInTimingDistribution(leads);
    const incomeBracketData = calculateIncomeBracketDistribution(leads);
    const apartmentPreferenceData = calculateApartmentPreferenceDistribution(leads);
    const engagementDistribution = calculateEngagementDistribution(leads);

    // Calculate summary stats
    const totalLeads = leads.length;
    const highIntentCount = leads.filter((l) => l.leadIntent === 'High').length;
    const avgLeadScore =
      totalLeads > 0
        ? Math.round(leads.reduce((sum, l) => sum + (l.leadScore || 0), 0) / totalLeads)
        : 0;
    const avgSentimentScore =
      totalLeads > 0
        ? Math.round(
            (leads.reduce((sum, l) => sum + (l.sentimentScore || 0), 0) / totalLeads) * 10
          ) / 10
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        leads,
        stats: {
          totalLeads,
          highIntentCount,
          highIntentPercentage: totalLeads > 0 ? Math.round((highIntentCount / totalLeads) * 100) : 0,
          avgLeadScore,
          avgSentimentScore,
        },
        charts: {
          intentDistribution,
          engagementDistribution,
          timeSeriesData,
          moveInTimingData: moveInTimingData,
          incomeBracketData: incomeBracketData,
          apartmentPreferenceData: apartmentPreferenceData,
        },
        topLeads,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching AI conversation data:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch AI conversation data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
