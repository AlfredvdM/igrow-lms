/**
 * Leads API Endpoint
 * Fetches leads from Google Sheets
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { fetchLeadsFromSheet } from '@/lib/google-sheets';
import { filterLeads, sortLeads } from '@/lib/analytics';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const sheetName = searchParams.get('sheet') || 'Sheet1';
    const status = searchParams.get('status')?.split(',');
    const source = searchParams.get('source')?.split(',');
    const search = searchParams.get('search') || undefined;
    const sortBy = searchParams.get('sortBy') || 'timestamp';
    const order = (searchParams.get('order') as 'asc' | 'desc') || 'desc';

    // Fetch leads from Google Sheets
    let leads = await fetchLeadsFromSheet(sheetName);

    // Apply filters
    leads = filterLeads(leads, {
      status: status as any,
      source: source as any,
      search,
    });

    // Sort leads
    leads = sortLeads(leads, sortBy as any, order);

    return NextResponse.json({
      success: true,
      data: leads,
      count: leads.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch leads',
      },
      { status: 500 }
    );
  }
}
