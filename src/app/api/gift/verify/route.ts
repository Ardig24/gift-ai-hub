import { NextRequest, NextResponse } from 'next/server';
import { getGiftCodeByCode } from '@/lib/gift/service';
import { formatGiftCode } from '@/lib/gift/codes';

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

    // Get platform details
    // In a real app, you would fetch this from your database
    const platformMap: Record<string, { name: string; description: string }> = {
      'chatgpt': { 
        name: 'ChatGPT Plus', 
        description: 'Access to GPT-4o, faster response times, and priority features' 
      },
      'claude': { 
        name: 'Claude Pro', 
        description: 'Advanced AI assistant with improved reasoning and longer context' 
      },
      'midjourney': { 
        name: 'Midjourney', 
        description: 'Create stunning AI-generated images with simple text prompts' 
      },
      'perplexity': { 
        name: 'Perplexity Pro', 
        description: 'AI-powered search with real-time information and citations' 
      },
      'github-copilot': { 
        name: 'GitHub Copilot', 
        description: 'AI pair programmer that helps you write better code faster' 
      }
    };

    const platform = platformMap[giftCode.platform_id] || { 
      name: 'AI Platform', 
      description: 'Access to premium AI features and capabilities' 
    };

    // Return the gift code details
    return NextResponse.json({
      success: true,
      code: formatGiftCode(giftCode.code),
      platformId: giftCode.platform_id,
      platformName: platform.name,
      platformDescription: platform.description,
      subscriptionId: giftCode.subscription_id,
      subscriptionPeriod: giftCode.subscription_id.includes('1month') ? '1 Month' :
                          giftCode.subscription_id.includes('3months') ? '3 Months' :
                          giftCode.subscription_id.includes('1year') ? '1 Year' : giftCode.subscription_id,
      senderName: giftCode.sender_name,
      message: giftCode.message,
      expiresAt: giftCode.expires_at,
    });
  } catch (error) {
    console.error('Error verifying gift code:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify gift code' },
      { status: 500 }
    );
  }
}
