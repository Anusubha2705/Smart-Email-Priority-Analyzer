import { NextRequest, NextResponse } from 'next/server';
import { addEmail } from '@/lib/db';

// Simple keyword-based priority prediction
function predictPriority(text: string): string {
  const text_lower = text.toLowerCase();
  
  const highKeywords = [
    'urgent', 'critical', 'asap', 'emergency', 'deadline',
    'important', 'immediate', 'action required', 'alert',
    'urgent action', 'must', 'please respond'
  ];
  
  const lowKeywords = [
    'fyi', 'newsletter', 'unsubscribe', 'marketing',
    'promotion', 'follow up', 'cc', 'just informing'
  ];
  
  let highScore = 0;
  let lowScore = 0;
  
  highKeywords.forEach(keyword => {
    if (text_lower.includes(keyword)) highScore += 2;
  });
  
  lowKeywords.forEach(keyword => {
    if (text_lower.includes(keyword)) lowScore += 1;
  });
  
  if (highScore > 0) return 'High';
  if (lowScore > 0) return 'Low';
  return 'Medium';
}

export async function POST(request: NextRequest) {
  try {
    const { subject, content } = await request.json();

    if (!subject?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'Subject and content are required' },
        { status: 400 }
      );
    }

    const text = `${subject} ${content}`;
    const emailSize = parseFloat((new TextEncoder().encode(text).length / 1024).toFixed(2));
    const priority = predictPriority(text);

    // Save to database
    const success = await addEmail(subject, content, priority, emailSize);

    return NextResponse.json({
      priority,
      email_size: emailSize,
      saved: success
    });
  } catch (error) {
    console.error('[v0] Error in analyze:', error);
    return NextResponse.json(
      { 
        priority: 'Medium', 
        email_size: 0,
        error: 'Analysis failed'
      },
      { status: 500 }
    );
  }
}
