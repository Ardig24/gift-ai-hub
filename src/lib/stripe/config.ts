// Stripe configuration
export const STRIPE_CONFIG = {
  // Use Stripe test keys
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Qrh2VKkGJweJ0lkz8RXPRkDcIUigpCCHUU5i1nuMoHmRPhaxKgBC6m9M5CJdfHb4e0rw7rOTVRpG9cL1atokDMl00inwPTJVB',
  secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_51Qrh2VKkGJweJ0lkSAFw8p1aCKd1ZE7dHsnDBm4MqjLS0U3nPjnuGsFdcCXPv2K0xfPO1K71NjKjjFeUIa6O4ePv00L0bBVE2O',
  
  // Replace with your actual webhook secret for production
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  
  // Test mode flag
  testMode: true,
  
  // Currency
  currency: 'usd',
  
  // Success and cancel URLs - hardcoded for local development
  // These must be absolute URLs for Stripe to redirect properly
  successUrl: 'http://localhost:3000/checkout/success',
  cancelUrl: 'http://localhost:3000/checkout/cancel',
};
