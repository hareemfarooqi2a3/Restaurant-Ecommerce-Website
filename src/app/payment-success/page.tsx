"use client";

import React, { useEffect, Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Loader2 } from 'lucide-react'; // Example icons

function PaymentSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams?.get('session_id');

    // State to manage what's displayed
    const [message, setMessage] = useState("Processing your order confirmation...");
    const [orderId, setOrderId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check if sessionId exists
        if (!sessionId) {
            console.error("Payment Success Page: No session_id found in URL.");
            setError("Could not verify payment session. Please check your orders or contact support.");
            setMessage("Error verifying payment."); // Update message on error
            return;
        }

        console.log("Payment Success Page: Found session_id:", sessionId);

        // 1. Clear the cart from localStorage IMMEDIATELY upon success
        //    Do this even before verification or redirect attempts.
        console.log("Clearing cart from localStorage...");
        localStorage.removeItem('cart');
        // Optional: Trigger cart context update if needed elsewhere
        // dispatchCartUpdate(); // Example if using context dispatch

        // 2. (Optional but Recommended) Verify session & get Order ID server-side
        //    This confirms payment and retrieves the sanityOrderId from metadata
        const verifySessionAndRedirect = async () => {
             try {
                 console.log("Calling API to verify session and get Order ID...");
                 // You need to create this API route: /api/payment/verify-session
                 const response = await fetch('/api/payment/verify-session', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ sessionId }),
                 });

                 if (!response.ok) {
                     const errorData = await response.json();
                     throw new Error(errorData.error || `Verification failed (Status: ${response.status})`);
                 }

                 const data = await response.json();
                 const fetchedOrderId = data.sanityOrderId; // API should return this

                 if (!fetchedOrderId) {
                     throw new Error("Verification succeeded, but Sanity Order ID was missing.");
                 }

                 setOrderId(fetchedOrderId); // Store the order ID
                 setMessage("Payment successful! Redirecting to your order...");
                 console.log("Redirecting to Order Confirmation for ID:", fetchedOrderId);
                 // Redirect to the final order confirmation page
                 router.replace(`/Order-Confirmation?orderId=${fetchedOrderId}`); // Use replace to avoid back button issues

             } catch (err: any) {
                 console.error("Error during payment verification or redirect:", err);
                 setError(`Payment confirmed, but failed to load order details automatically: ${err.message}. Please check 'My Orders' or contact support.`);
                 setMessage("Payment successful! Error loading order details."); // Update message
                 // Don't redirect on error, let user see the message and link
             }
         };

         // --- Choose how to handle redirect ---
         // Option A: Immediately redirect (less robust, relies solely on webhook)
         // setMessage("Payment successful! Redirecting...");
         // setTimeout(() => {
         //    // PROBLEM: We don't know the sanityOrderId here without verification!
         //    // This approach isn't ideal unless you store the pending order ID differently.
         //    // router.replace(`/Order-Confirmation?orderId=UNKNOWN`);
         //    setError("Could not automatically redirect. Please check your orders.");
         // }, 2000);

         // Option B: Verify Session then redirect (Recommended)
         verifySessionAndRedirect();

    }, [sessionId, router]); // Re-run if sessionId changes

    // Display loading/processing/error messages
    return (
        <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center max-w-lg">
            {error ? (
                <>
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                    <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">Payment Successful!</h1>
                    <p className="text-red-600 mb-6">{error}</p>
                    <Link href="/shop" className="text-blue-600 hover:underline">
                        Continue Shopping
                    </Link>
                     {/* Optionally add a link to a generic "My Orders" page */}
                     {/* <Link href="/account/orders" className="ml-4 text-blue-600 hover:underline">View My Orders</Link> */}
                </>
            ) : (
                <>
                    <Loader2 className="w-16 h-16 text-orange-500 mb-4 animate-spin" />
                    <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">{message}</h1>
                    <p className="text-gray-600 dark:text-gray-400">Please wait while we confirm the final details.</p>
                    {/* You can add a manual link as a fallback */}
                    {orderId && (
                         <p className="mt-6 text-sm">
                             If redirection doesn't happen automatically,
                             <Link href={`/Order-Confirmation?orderId=${orderId}`} className="text-blue-600 hover:underline ml-1">
                                 click here to view your order.
                             </Link>
                         </p>
                     )}
                </>
            )}
        </div>
    );
}

// Main page component using Suspense
export default function PaymentSuccessPage() {
    return (
        // You might want a minimal layout here, or your standard one
        <div className="main-content min-h-screen bg-gray-50 dark:bg-gray-900">
             {/* No need for ForAllHeroSections here usually */}
            <Suspense fallback={<div className="text-center p-20">Loading confirmation...</div>}>
                <PaymentSuccessContent />
            </Suspense>
        </div>
    );
}