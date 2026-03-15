// src/app/api/payment/verify-session/route.ts (Create this file if it doesn't exist)

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// IMPORTANT:
// Avoid throwing at module import time (Next may evaluate route modules during build).
// Initialize Stripe lazily inside the handler so builds can succeed without Stripe env vars.
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
function getStripe() {
  if (!stripeSecretKey) return null;
  return new Stripe(stripeSecretKey, {
    apiVersion: "2025-02-24.acacia",
    typescript: true,
  });
}

export async function POST(req: NextRequest) {
  console.log("API Route /api/payment/verify-session hit");
  if (req.method !== 'POST') {
    return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405, headers: { Allow: 'POST' } });
  }

  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe secret key is required (missing STRIPE_SECRET_KEY)." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const sessionId = body.sessionId;

    if (!sessionId || typeof sessionId !== 'string') {
      console.error("Verification API: Missing or invalid sessionId", sessionId);
      return NextResponse.json({ error: 'Missing or invalid session ID' }, { status: 400 });
    }

    console.log(`Verification API: Retrieving session ${sessionId}...`);

    // Retrieve the Checkout Session from Stripe, expanding payment_intent if needed later
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items', 'payment_intent'], // Expand if you need payment intent details
    });

    console.log(`Verification API: Session status=${session.status}, Payment status=${session.payment_status}`);

    // --- IMPORTANT CHECKS ---
    // Verify the session status indicates successful payment
    // Status 'complete' is the primary indicator for successful one-time payments
    if (session.status !== 'complete') {
        console.warn(`Verification API: Session ${sessionId} status is not complete (${session.status}).`);
         // You might still want to return the order ID if payment is 'paid' but session isn't 'complete' yet,
         // depending on your flow and webhook setup. For now, we require 'complete'.
        return NextResponse.json({ error: `Payment session not complete (Status: ${session.status})` }, { status: 400 });
    }

    // Optional but good: Check payment status if needed
    // if (session.payment_status !== 'paid') {
    //     console.warn(`Verification API: Session ${sessionId} payment status is not paid (${session.payment_status}).`);
    //     return NextResponse.json({ error: `Payment not confirmed (Status: ${session.payment_status})` }, { status: 400 });
    // }

    // Retrieve the sanityOrderId from the metadata you stored
    const sanityOrderId = session.metadata?.sanityOrderId;

    if (!sanityOrderId) {
        console.error(`Verification API: Missing sanityOrderId in metadata for session ${sessionId}!`);
        // This is a critical error - you can't link back to your order
        return NextResponse.json({ error: 'Order link missing from payment session.' }, { status: 500 });
    }

    console.log(`Verification API: Found sanityOrderId: ${sanityOrderId} for session ${sessionId}`);

    // --- SUCCESS RESPONSE ---
    // Return the sanityOrderId in a valid JSON object
    return NextResponse.json({ sanityOrderId: sanityOrderId }); // Ensure this is the structure expected by the frontend

  } catch (error: any) {
    console.error("Verification API Error:", error);
    // Check if it's a Stripe error
    let message = "Failed to verify payment session.";
    let status = 500;
    if (error instanceof Stripe.errors.StripeError) {
        message = error.message;
        status = error.statusCode || 500;
    }
     // --- ERROR RESPONSE (Ensure it's JSON) ---
    return NextResponse.json(
        { error: message, details: error.message },
        { status: status }
    );
  }
}