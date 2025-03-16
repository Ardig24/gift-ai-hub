import { NextRequest, NextResponse } from 'next/server';
import { getGiftCodeByCode, redeemGiftCode } from '@/lib/gift/service';
import { sendRedemptionEmail } from '@/lib/email/redemption-service';
import { getPlatformName, getSubscriptionPeriod } from '@/lib/gift/service';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { code, email } = body;

    // Validate required fields
    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Gift code is required' },
        { status: 400 }
      );
    }

    // Clean up the code (remove spaces, dashes, etc.)
    const cleanCode = code.replace(/[^A-Z0-9]/gi, '').toUpperCase();

    // Get the gift code from the database
    const giftCode = await getGiftCodeByCode(cleanCode);

    // If the gift code doesn't exist or is not active
    if (!giftCode) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired gift code' },
        { status: 404 }
      );
    }

    // If email is provided, check if it matches the recipient email
    if (email && giftCode.recipient_email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { success: false, message: 'This gift code is not associated with the provided email address' },
        { status: 400 }
      );
    }

    // Redeem the gift code
    const redeemedGiftCode = await redeemGiftCode(cleanCode);

    if (!redeemedGiftCode) {
      return NextResponse.json(
        { success: false, message: 'Failed to redeem gift code' },
        { status: 500 }
      );
    }

    // Get platform and subscription information
    const platformName = getPlatformName(redeemedGiftCode.platform_id);
    const subscriptionPeriod = getSubscriptionPeriod(redeemedGiftCode.subscription_id);
    
    // In a real application, you would:
    // 1. Create an account for the recipient if they don't have one
    // 2. Activate their subscription to the platform
    
    // 3. Send them an email with instructions on how to access the platform
    try {
      // Generate activation details based on the platform
      let activationCode = 'GIFT-DEMO-12345';
      let activationUrl = 'https://chat.openai.com/redeem';
      
      // In a real implementation, you would generate actual codes or links
      // based on the platform's API or integration method
      if (redeemedGiftCode.platform_id === 'chatgpt') {
        activationUrl = 'https://chat.openai.com/redeem';
      } else if (redeemedGiftCode.platform_id === 'claude') {
        activationUrl = 'https://claude.ai/redeem';
      } else if (redeemedGiftCode.platform_id === 'midjourney') {
        activationUrl = 'https://midjourney.com/redeem';
      }
      
      // Send the redemption confirmation email
      await sendRedemptionEmail({
        recipientEmail: redeemedGiftCode.recipient_email,
        recipientName: redeemedGiftCode.recipient_name,
        platformName,
        subscriptionPeriod,
        activationCode,
        activationUrl
      });
    } catch (emailError) {
      console.error('Error sending redemption confirmation email:', emailError);
      // We don't want to fail the redemption if just the email fails
      // So we continue with the success response
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Gift code redeemed successfully',
      platformId: redeemedGiftCode.platform_id,
      subscriptionId: redeemedGiftCode.subscription_id,
      redeemedAt: redeemedGiftCode.redeemed_at,
    });
  } catch (error) {
    console.error('Error redeeming gift code:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to redeem gift code' },
      { status: 500 }
    );
  }
}
