"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // ✅ Use `/payment/api` instead of `/payment` to avoid conflicts
      const response = await fetch("/payment/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 50, currency: "usd" }),
      });

      const { sessionId } = await response.json();

      if (!sessionId) {
        alert("Failed to initiate payment.");
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        alert("Stripe initialization failed.");
        return;
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe Checkout Error:", error.message);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Payment processing failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content p-6">
      <h1 className="text-2xl font-bold mb-4">Payment Page</h1>
      <button
        className={`px-6 py-3 text-white font-bold rounded ${
          loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500"
        }`}
        disabled={loading}
        onClick={handlePayment}
      >
        {loading ? "Processing..." : "Pay $50"}
      </button>
    </div>
  );
}
