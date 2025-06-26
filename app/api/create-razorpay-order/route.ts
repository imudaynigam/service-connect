import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Make sure to add these to your .env.local:
// NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_abc123XYZ
// RAZORPAY_KEY_SECRET=your_key_secret_here

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { amount, currency = 'INR', receipt } = body;

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100), // amount in paise
      currency,
      receipt,
      payment_capture: 1,
    });
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 