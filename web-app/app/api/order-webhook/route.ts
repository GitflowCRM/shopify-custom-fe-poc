import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const hmac = req.headers.get('x-shopify-hmac-sha256');
  const body = await req.text();
  
  const generatedHash = crypto
    .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET!)
    .update(body)
    .digest('base64');

  if (generatedHash !== hmac) {
    return NextResponse.json({ error: 'Invalid Signature' }, { status: 401 });
  }

  const order = JSON.parse(body);
  
  // Process the order data as needed
  // You might want to store it in your database or trigger other actions

  return NextResponse.json({ message: 'Webhook received successfully' });
}