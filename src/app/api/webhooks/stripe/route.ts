import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripe = getStripe();

  // Basic logging
  console.log(`[Webhook] Incoming request: ${req.method}`);

  if (!sig || !webhookSecret) {
    console.error('[Webhook] Missing Stripe signature or webhook secret');
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log(`[Webhook] Verified: ${event.type} [${event.id}]`);
  } catch (err: any) {
    console.error(`[Webhook] Signature Verification Failed: ${err.message}`);
    return NextResponse.json({ 
      error: `Webhook Error: ${err.message}`,
      details: 'La firma del webhook no coincide. Verifica que STRIPE_WEBHOOK_SECRET sea el secreto de firma correcto.'
    }, { status: 400 });
  }

  // Handle successful payments
  if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded' || event.type === 'charge.succeeded') {
    const obj = event.data.object as any;
    console.log(`[Webhook] Processing successful payment: ${obj.id}`);
    
    // Extract consumer details based on object type
    const email = obj.customer_details?.email || 
                  obj.billing_details?.email || 
                  obj.receipt_email || 
                  obj.customer_email || 
                  '';
                  
    const name = obj.customer_details?.name || 
                 obj.billing_details?.name || 
                 'Unspecified Name';
    
    // metadata is common to both, but sometimes nested
    const metadata = obj.metadata || {};
    
    let discountPercent = 0;
    if (metadata.discount_detail && metadata.discount_detail !== 'none') {
      try {
        const detail = JSON.parse(metadata.discount_detail);
        if (detail.type === 'custom_firestore' || detail.type === 'stripe_percentage') {
          discountPercent = detail.value;
        }
      } catch (e) {
        console.error('Error parsing discount_detail:', e);
      }
    }

    const attendeeInfo = {
      stripeId: obj.id,
      email: email,
      name: name,
      amount: (obj.amount_total || obj.amount) / 100,
      currency: obj.currency,
      ticketType: metadata.ticketType || metadata.method || 'general',
      edition: metadata.edition || metadata.tripId || '2026',
      partnerId: metadata.partnerId !== 'none' ? metadata.partnerId : null,
      couponCode: metadata.couponCode !== 'none' ? metadata.couponCode : null,
      discountPercent: discountPercent,
      status: 'paid',
      createdAt: FieldValue.serverTimestamp(),
      // Store raw metadata for debugging if it doesn't match expected fields
      rawMetadata: metadata
    };

    try {
      // Use adminDb to bypass security rules on the server
      await adminDb.collection('registrations').add(attendeeInfo);
      console.log(`Registration saved to Firestore (${event.type}):`, email);
    } catch (error) {
      console.error('Error saving registration to Firestore:', error);
    }
  }

  return NextResponse.json({ received: true });
}
