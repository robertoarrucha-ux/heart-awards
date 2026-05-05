
'use server';

import { getStripe } from '@/lib/stripe';
import { revalidatePath } from 'next/cache';

/**
 * Gets all active products and their prices from Stripe.
 */
export async function getStripeProductsAction() {
  const stripe = getStripe();
  try {
    const products = await stripe.products.list({ active: true, expand: ['data.default_price'] });
    return { success: true, products: products.data };
  } catch (error: any) {
    console.error('Error fetching Stripe products:', error);
    return { success: false, message: error.message || 'Error al obtener productos de Stripe' };
  }
}

/**
 * Gets all active coupons from Stripe.
 */
export async function getStripeCouponsAction() {
  const stripe = getStripe();
  try {
    const coupons = await stripe.coupons.list({ });
    return { success: true, coupons: coupons.data };
  } catch (error: any) {
    console.error('Error fetching Stripe coupons:', error);
    return { success: false, message: error.message || 'Error al obtener cupones de Stripe' };
  }
}

/**
 * Creates a new simple product and price in Stripe.
 */
export async function createStripeProductAction(formData: { name: string; description: string; amount: number; currency: string }) {
  const stripe = getStripe();
  try {
    const product = await stripe.products.create({
      name: formData.name,
      description: formData.description,
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(formData.amount * 100),
      currency: formData.currency,
    });

    await stripe.products.update(product.id, {
      default_price: price.id,
    });

    revalidatePath('/admin/payments');
    return { success: true, product, price };
  } catch (error: any) {
    console.error('Error creating Stripe product:', error);
    return { success: false, message: error.message || 'Error al crear producto en Stripe' };
  }
}

/**
 * Creates a new coupon in Stripe.
 */
export async function createStripeCouponAction(formData: { id?: string; percent_off?: number; amount_off?: number; currency?: string; name: string; duration: 'once' | 'repeating' | 'forever' }) {
  const stripe = getStripe();
  try {
    const coupon = await stripe.coupons.create({
      id: formData.id,
      percent_off: formData.percent_off,
      amount_off: formData.amount_off ? Math.round(formData.amount_off * 100) : undefined,
      currency: formData.currency,
      name: formData.name,
      duration: formData.duration,
    });

    revalidatePath('/admin/payments');
    return { success: true, coupon };
  } catch (error: any) {
    console.error('Error creating Stripe coupon:', error);
    return { success: false, message: error.message || 'Error al crear cupón en Stripe' };
  }
}

/**
 * Creates a payment link for a specific price.
 */
export async function createStripePaymentLinkAction(priceId: string) {
  const stripe = getStripe();
  try {
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: priceId, quantity: 1 }],
    });
    return { success: true, url: paymentLink.url };
  } catch (error: any) {
    console.error('Error creating Stripe payment link:', error);
    return { success: false, message: error.message || 'Error al crear link de pago' };
  }
}
