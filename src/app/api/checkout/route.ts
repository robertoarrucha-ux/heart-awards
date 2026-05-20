import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const { priceId, edition, ticketType, successUrl, cancelUrl, coupon } = await req.json();
    const stripe = getStripe();

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      // allow_promotion_codes y discounts son mutuamente excluyentes en Stripe
      ...(coupon
        ? { discounts: [{ coupon }] }
        : { allow_promotion_codes: true }),
      metadata: {
        edition,
        ticketType,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
