import { NextResponse } from 'next/server';
import { sendGiftEmail } from '@/lib/email/service';
import { formatGiftCode } from '@/lib/gift/codes';

export async function POST(request: Request) {
  try {
    // Get request body
    const body = await request.json();
    
    // Validate required fields
    const {
      recipientEmail,
      recipientName,
      senderName,
      message,
      platformName,
      subscriptionPeriod,
      giftCode,
    } = body;
    
    if (!recipientEmail || !recipientName || !senderName || !platformName || !subscriptionPeriod || !giftCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Format the gift code for display
    const formattedGiftCode = formatGiftCode(giftCode);
    
    // Generate the redemption URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://intelligift.ai';
    const redeemUrl = `${baseUrl}/redeem?code=${giftCode}`;
    
    // Send the email
    const success = await sendGiftEmail({
      recipientEmail,
      recipientName,
      senderName,
      message,
      platformName,
      subscriptionPeriod,
      giftCode: formattedGiftCode,
      redeemUrl,
    });
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending gift email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
