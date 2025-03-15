import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }

    // Calculate total price and prepare line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    
    // Service fee amount in cents
    const SERVICE_FEE = 499; // $4.99
    
    // Add each gift as a line item
    for (const item of items) {
      // Validate required fields
      if (!item.platformId || !item.subscriptionId || !item.recipientEmail || !item.recipientName || !item.senderName) {
        return NextResponse.json(
          { error: 'Missing required fields for one or more items' },
          { status: 400 }
        );
      }
      
      // Fetch platform and subscription details
      // In a production app, you would fetch this from your database
      // For now, we'll use the hardcoded data
      const platformsResponse = await fetch(new URL('/api/platforms/hardcoded', request.url));
      const platforms = await platformsResponse.json();
      
      const platform = platforms.find((p: any) => p.id === item.platformId);
      if (!platform) {
        return NextResponse.json(
          { error: `Platform with ID "${item.platformId}" not found` },
          { status: 400 }
        );
      }
      
      const subscription = platform.subscriptions.find((s: any) => s.id === item.subscriptionId);
      if (!subscription) {
        return NextResponse.json(
          { error: `Subscription with ID "${item.subscriptionId}" not found for platform "${platform.name}"` },
          { status: 400 }
        );
      }
      
      // Add the subscription as a line item
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${platform.name} - ${subscription.period}`,
            description: `Gift subscription for ${item.recipientName}`,
          },
          unit_amount: Math.round(subscription.price * 100), // Convert to cents
        },
        quantity: 1,
      });
    }
    
    // Add service fee as a separate line item
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Service Fee',
          description: 'Processing and handling fee',
        },
        unit_amount: SERVICE_FEE,
      },
      quantity: 1,
    });
    
    // Create a compact version of the order details to fit within Stripe's metadata limits (500 chars)
    // Only store essential information and use a more compact format
    const compactOrderDetails = items.map(item => ({
      p: item.platformId,                  // platformId
      s: item.subscriptionId,              // subscriptionId
      r: item.recipientName?.substring(0, 20),    // recipientName (truncated)
      e: item.recipientEmail,              // recipientEmail
      f: item.senderName?.substring(0, 20),       // from/senderName (truncated)
    }));
    
    // Store recipient info separately since it's the same for all items
    const recipientInfo = {
      name: items[0].recipientName,
      email: items[0].recipientEmail,
      sender: items[0].senderName,
      message: items[0].message?.substring(0, 100) || '', // Truncate message if needed
    };
    
    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/gift/${items[0].platformId}`,
      metadata: {
        // Store compact order details and recipient info separately
        orderItems: JSON.stringify(compactOrderDetails),
        recipientInfo: JSON.stringify(recipientInfo),
      },
    });
    
    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while creating the checkout session' },
      { status: 500 }
    );
  }
}
