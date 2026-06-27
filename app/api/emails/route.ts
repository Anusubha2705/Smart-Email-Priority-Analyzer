import { NextRequest, NextResponse } from 'next/server';
import { getEmails } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const emails = await getEmails();
    return NextResponse.json({
      emails,
      total: emails.length
    });
  } catch (error) {
    console.error('[v0] Error fetching emails:', error);
    return NextResponse.json(
      { emails: [], total: 0 },
      { status: 200 }
    );
  }
}
