import { NextRequest, NextResponse } from 'next/server';
import { createGiftCode, sendGiftEmail } from '@/lib/gift/service';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Create a test gift code
    const giftCodeData = await createGiftCode({
      platform_id: body.platformId || 'chatgpt',
      subscription_id: body.subscriptionId || '3months',
      recipient_email: body.recipientEmail,
      recipient_name: body.recipientName || 'Test Recipient',
      sender_name: body.senderName || 'Test Sender',
      message: body.message || 'This is a test gift message!',
    });
    
    // Send the gift email
    await sendGiftEmail(giftCodeData);
    
    return NextResponse.json({
      success: true,
      message: 'Test gift email sent successfully',
      giftCode: giftCodeData.code,
    });
  } catch (error) {
    console.error('Error sending test gift email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send test gift email' },
      { status: 500 }
    );
  }
}
