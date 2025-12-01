/**
 * API Route: GET /api/leads/lead-form
 * Fetches lead form data from Google Sheets
 */

import { NextResponse } from 'next/server';
import { fetchLeadsBySource } from '@/lib/google-sheets';
import {
  calculateIntentDistribution,
  calculateStatusDistribution,
  calculateMoveInTimingDistribution,
  calculateIncomeBracketDistribution,
  calculateApartmentPreferenceDistribution,
  calculatePetPreferenceDistribution,
  calculateLeadScoreDistribution,
  calculateLeadSourcePerformance,
  calculateEmploymentStatusDistribution,
  calculateBestTimeForOutreach,
  generateIntentTimeSeriesData,
} from '@/lib/analytics-enhanced';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Fetch leads from Lead Form tab
    const leads = await fetchLeadsBySource('leadForm');

    // Calculate distributions and metrics
    const intentDistribution = calculateIntentDistribution(leads);
    const statusDistribution = calculateStatusDistribution(leads);
    const timeSeriesData = generateIntentTimeSeriesData(leads, 30);
    const moveInTimingData = calculateMoveInTimingDistribution(leads);
    const incomeBracketData = calculateIncomeBracketDistribution(leads);
    const apartmentInterestData = calculateApartmentPreferenceDistribution(leads);
    const petPreferenceData = calculatePetPreferenceDistribution(leads);
    const leadScoreDistributionData = calculateLeadScoreDistribution(leads);
    const leadSourcePerformanceData = calculateLeadSourcePerformance(leads);
    const employmentStatusData = calculateEmploymentStatusDistribution(leads);
    const outreachTimeData = calculateBestTimeForOutreach(leads);

    // Calculate summary stats
    const totalLeads = leads.length;
    const highIntentCount = leads.filter((l) => l.leadIntent === 'High').length;
    const avgLeadScore =
      totalLeads > 0
        ? Math.round(leads.reduce((sum, l) => sum + (l.leadScore || 0), 0) / totalLeads)
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
        },
        charts: {
          intentDistribution,
          statusDistribution,
          timeSeriesData,
          moveInTimingData,
          incomeBracketData,
          apartmentInterestData,
          petPreferenceData,
          leadScoreDistributionData,
          leadSourcePerformanceData,
          employmentStatusData,
          outreachTimeData,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching lead form data:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch lead form data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
