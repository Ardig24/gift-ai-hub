import Stripe from 'stripe';
import { STRIPE_CONFIG } from './config';

// Service fee amount in cents
export const SERVICE_FEE = 499; // $4.99

// Initialize Stripe with the secret key
const stripe = new Stripe(STRIPE_CONFIG.secretKey, {
  apiVersion: '2023-10-16' as any, // Use a compatible API version
});

export interface CheckoutSessionParams {
  platformId: string;
  platformName: string;
  subscriptionId: string;
  period: string;
  price: number;
  recipientEmail?: string;
  recipientName?: string;
  senderName?: string;
  message?: string;
}

export const createCheckoutSession = async ({
  platformId,
  platformName,
  subscriptionId,
  period,
  price,
  recipientEmail,
  recipientName,
  senderName,
  message,
}: CheckoutSessionParams) => {
  try {
    console.log('Creating checkout session with params:', {
      platformId,
      platformName,
      subscriptionId,
      period,
      price,
      recipientEmail,
      recipientName,
      senderName,
    });
    
    // Ensure price is a valid number
    const unitAmount = Math.round(price * 100); // Stripe uses cents
    if (isNaN(unitAmount) || unitAmount <= 0) {
      throw new Error(`Invalid price: ${price}`);
    }
    
    // Use the SERVICE_FEE constant defined at the top of the file
    
    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: STRIPE_CONFIG.currency,
            product_data: {
              name: `${platformName} - ${period} Subscription`,
              description: `Gift subscription to ${platformName} for ${period}`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: STRIPE_CONFIG.currency,
            product_data: {
              name: 'Service Fee',
              description: 'GiftAI Hub service fee',
            },
            unit_amount: SERVICE_FEE,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${STRIPE_CONFIG.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: STRIPE_CONFIG.cancelUrl,
      metadata: {
        platformId,
        platformName,
        subscriptionId,
        period,
        recipientEmail: recipientEmail || '',
        recipientName: recipientName || '',
        senderName: senderName || '',
        message: message || '',
      },
    });
    
    console.log('Checkout session created:', { 
      sessionId: session.id, 
      url: session.url 
    });

    return { sessionId: session.id, url: session.url };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const retrieveCheckoutSession = async (sessionId: string) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'line_items'],
    });
    return session;
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    throw error;
  }
};

export { stripe };
