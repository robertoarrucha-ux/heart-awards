import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export const getStripe = (): Stripe => {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
    }
    stripeInstance = new Stripe(key, {
      apiVersion: '2024-06-20' as any, // Cast to any to bypass strict type checking of various SDK versions
    });
  }
  return stripeInstance;
};
