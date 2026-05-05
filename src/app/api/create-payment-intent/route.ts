import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency, metadata, couponCode, partnerId } = body;

    console.log('--- Intent Creation Request ---');
    console.log('Body:', JSON.stringify(body));

    if (!amount || !currency) {
      return NextResponse.json({ error: 'Monto y moneda son requeridos' }, { status: 400 });
    }

    const stripe = getStripe();

    // Stripe requiere montos enteros en la unidad mínima (centavos)
    let amountInCents = Math.round(Number(amount));
    let discountApplied = null;
    let finalPartnerId = partnerId || null;
    let finalCouponCode = couponCode || null;

    // 1. Lógica de Cupón Personalizado (Firestore)
    if (couponCode) {
      const couponQuery = await adminDb.collection('coupons')
        .where('code', '==', couponCode.toUpperCase())
        .where('status', '==', 'active')
        .limit(1)
        .get();

      if (!couponQuery.empty) {
        const couponData = couponQuery.docs[0].data();
        const discountValue = Math.min(couponData.discount, 30); // Hard limit 30%
        const discountAmount = (amountInCents * discountValue) / 100;
        
        amountInCents = Math.round(amountInCents - discountAmount);
        finalPartnerId = couponData.partnerId;
        finalCouponCode = couponData.code;
        
        discountApplied = {
          type: 'custom_firestore',
          value: discountValue,
          amount: discountAmount
        };
        console.log(`Applied Firestore Coupon: ${couponData.code} (${discountValue}%)`);
      } else {
        // 2. Lógica de Cupón Legacy (Stripe)
        try {
          console.log(`Validating Stripe coupon/promo: ${couponCode}`);
          let stripeCoupon = null;

          const promoCodes = await stripe.promotionCodes.list({
            code: couponCode,
            active: true,
            limit: 1,
          });

          if (promoCodes.data.length > 0) {
            stripeCoupon = (promoCodes.data[0] as any).coupon;
          } else {
            stripeCoupon = await stripe.coupons.retrieve(couponCode);
          }
          
          if (stripeCoupon && stripeCoupon.valid) {
            if (stripeCoupon.percent_off) {
              const discount = (amountInCents * stripeCoupon.percent_off) / 100;
              amountInCents = Math.round(amountInCents - discount);
              discountApplied = {
                type: 'stripe_percentage',
                value: stripeCoupon.percent_off,
                amount: discount
              };
            } else if (stripeCoupon.amount_off) {
              amountInCents = Math.round(amountInCents - stripeCoupon.amount_off);
              discountApplied = {
                type: 'stripe_fixed',
                value: stripeCoupon.amount_off,
                amount: stripeCoupon.amount_off
              };
            }
          }
        } catch (err: any) {
          console.warn(`Invalid coupon/promo attempted: ${couponCode}`, err.message);
          return NextResponse.json({ 
            error: 'El código de descuento no es válido o ha expirado.',
            code: 'invalid_coupon' 
          }, { status: 400 });
        }
      }
    }

    if (amountInCents <= 0) {
      amountInCents = Math.max(50, amountInCents);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      metadata: {
        ...(metadata || {}),
        partnerId: finalPartnerId || 'none',
        couponCode: finalCouponCode || couponCode || 'none',
        discount_detail: discountApplied ? JSON.stringify(discountApplied) : 'none'
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      discountedAmount: amountInCents
    });
  } catch (error: any) {
    console.error('Stripe Intent Error Detail:', error);
    return NextResponse.json({ 
      error: error.message || 'Error interno al crear el pago',
      code: error.code
    }, { status: 500 });
  }
}
