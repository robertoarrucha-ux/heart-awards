
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Acumbamail Webhook received:', JSON.stringify(body, null, 2));

    // Acumbamail might send different types of events (delivery, open, click, etc.)
    // For now, we just acknowledge receipt.
    
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing Acumbamail webhook:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET() {
  // Some services ping the webhook URL with a GET request to verify it exists.
  return new Response('Acumbamail Webhook Endpoint Active', { status: 200 });
}
