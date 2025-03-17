// Stripe configuration
export const STRIPE_CONFIG = {
  // Use Stripe keys from environment variables
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  
  // Webhook secret from environment variable
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  
  // Test mode flag
  testMode: true,
  
  // Currency
  currency: 'usd',
  
  // Success and cancel URLs
  // These must be absolute URLs for Stripe to redirect properly
  successUrl: process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success` : 'https://intelligift.ai/checkout/success',
  cancelUrl: process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel` : 'https://intelligift.ai/checkout/cancel',
};
