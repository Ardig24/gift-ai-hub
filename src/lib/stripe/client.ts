import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG } from './config';

// Load the Stripe client once
let stripePromise: Promise<any> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);
  }
  return stripePromise;
};
