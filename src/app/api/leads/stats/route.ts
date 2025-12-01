/**
 * Lead Statistics API Endpoint
 * Calculates and returns analytics for leads
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { fetchLeadsFromSheet } from '@/lib/google-sheets';
import {
  calculateLeadStats,
  calculateSourceStats,
  calculateDashboardMetrics,
  generateTimeSeriesData,
} from '@/lib/analytics';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const sheetName = searchParams.get('sheet') || 'Sheet1';
    const days = parseInt(searchParams.get('days') || '30', 10);

    // Fetch leads from Google Sheets
    const leads = await fetchLeadsFromSheet(sheetName);

    // Calculate statistics
    const leadStats = calculateLeadStats(leads);
    const sourceStats = calculateSourceStats(leads);
    const dashboardMetrics = calculateDashboardMetrics(leads);
    const timeSeriesData = generateTimeSeriesData(leads, days);

    return NextResponse.json({
      success: true,
      data: {
        stats: leadStats,
        sources: sourceStats,
        metrics: dashboardMetrics,
        timeSeries: timeSeriesData,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error calculating stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to calculate stats',
      },
      { status: 500 }
    );
  }
}
