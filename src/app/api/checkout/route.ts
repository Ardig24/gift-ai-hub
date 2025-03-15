import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe/server';
import { ordersTable } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    console.log('Received checkout request');
    const body = await request.json();
    console.log('Request body:', body);
    
    const {
      platformId,
      platformName,
      subscriptionId,
      period,
      price,
      recipientEmail,
      recipientName,
      senderName,
      message,
    } = body;

    // Validate required fields
    if (!platformId || !subscriptionId || !price) {
      console.error('Missing required fields:', { platformId, subscriptionId, price });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (recipientEmail && !recipientEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid recipient email format' },
        { status: 400 }
      );
    }

    console.log('Creating checkout session with params:', {
      platformId,
      platformName,
      subscriptionId,
      period,
      price,
    });

    // Create a checkout session
    const { sessionId, url } = await createCheckoutSession({
      platformId,
      platformName,
      subscriptionId,
      period,
      price,
      recipientEmail,
      recipientName,
      senderName,
      message,
    });

    console.log('Checkout session created successfully:', { sessionId, url });

    // Create a pending order in the database
    const order = await ordersTable.create({
      platform_id: platformId,
      subscription_id: subscriptionId,
      session_id: sessionId,
      amount: price,
      status: 'pending',
      recipient_email: recipientEmail,
      recipient_name: recipientName,
      sender_name: senderName,
      message: message,
      created_at: new Date().toISOString(),
    });

    console.log('Order created in database:', order);

    // Return the session ID and URL to the client
    return NextResponse.json({ sessionId, url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Error creating checkout session' },
      { status: 500 }
    );
  }
}
