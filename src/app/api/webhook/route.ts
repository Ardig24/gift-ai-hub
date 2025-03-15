import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { STRIPE_CONFIG } from '@/lib/stripe/config';
import { ordersTable } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  let event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_CONFIG.webhookSecret
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle specific events
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      // Update the order status in the database
      try {
        await ordersTable.updateBySessionId(session.id, {
          status: 'completed',
          payment_id: session.payment_intent,
          updated_at: new Date().toISOString(),
        });
        
        // TODO: Send confirmation emails to sender and recipient
        
      } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json(
          { error: 'Error updating order' },
          { status: 500 }
        );
      }
      break;
      
    case 'checkout.session.expired':
      try {
        await ordersTable.updateBySessionId(event.data.object.id, {
          status: 'expired',
          updated_at: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error updating expired order:', error);
      }
      break;
      
    default:
      // Unexpected event type
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
