import { NextRequest, NextResponse } from 'next/server';
import { getStats } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const stats = await getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('[v0] Error fetching stats:', error);
    return NextResponse.json(
      { total: 0, high: 0, medium: 0, low: 0 },
      { status: 200 }
    );
  }
}
