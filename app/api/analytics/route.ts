import { NextRequest, NextResponse } from 'next/server';
import { getAnalytics } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const analytics = await getAnalytics();
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('[v0] Error fetching analytics:', error);
    return NextResponse.json(
      { 
        priority_distribution: [],
        daily_activity: []
      },
      { status: 200 }
    );
  }
}
