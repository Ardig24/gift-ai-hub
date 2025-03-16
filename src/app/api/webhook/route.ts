import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { STRIPE_CONFIG } from '@/lib/stripe/config';
import { ordersTable } from '@/lib/supabase/client';
import { retrieveCheckoutSession } from '@/lib/stripe/server';
import { createGiftCode, sendGiftEmail } from '@/lib/gift/service';

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
        // Get the full session details
        const sessionDetails = await retrieveCheckoutSession(session.id);
        
        // Parse the metadata from the session
        let orderItems = [];
        let recipientInfo: { message?: string } = {};
        
        try {
          // Parse the compact order items from metadata
          if (sessionDetails.metadata?.orderItems) {
            orderItems = JSON.parse(sessionDetails.metadata.orderItems);
          }
          
          // Parse the recipient info from metadata
          if (sessionDetails.metadata?.recipientInfo) {
            recipientInfo = JSON.parse(sessionDetails.metadata.recipientInfo);
          }
        } catch (error) {
          console.error('Error parsing session metadata:', error);
        }
        
        // Update the order in the database
        const order = await ordersTable.updateBySessionId(session.id, {
          status: 'completed',
          payment_id: session.payment_intent,
          updated_at: new Date().toISOString(),
        });
        
        // Send gift emails for each order item
        if (orderItems.length > 0) {
          // For each item in the order, generate a gift code and send an email
          for (const item of orderItems) {
            try {
              // Create a gift code in the database
              const giftCodeData = await createGiftCode({
                order_id: order?.id, // Link to the order
                platform_id: item.p, // Platform ID
                subscription_id: item.s, // Subscription ID
                recipient_email: item.e, // Recipient email
                recipient_name: item.r, // Recipient name
                sender_name: item.f, // Sender name
                message: recipientInfo.message, // Gift message
              });
              
              // Send the gift email
              await sendGiftEmail(giftCodeData);
              
              console.log(`Gift code created and email sent for order ${session.id}, platform ${item.p}`);
            } catch (error) {
              console.error('Error creating gift code or sending email:', error);
            }
          }
        }
        
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
