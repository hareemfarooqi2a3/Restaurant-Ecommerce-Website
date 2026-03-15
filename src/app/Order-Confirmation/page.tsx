"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Home, ShoppingCart, Download, Truck, CheckCircle, Info, ExternalLink, FileText, Loader2, Copy, Mail, PackageCheck } from "lucide-react";
import Link from "next/link";
import { client } from '@/sanity/lib/client'; // Adjust path if needed
import Image from "next/image";
import { OrderDetails } from "@/types/orderTypes"; // Use your shared type
import Confetti from 'react-confetti';
import { useWindowSize } from '@uidotdev/usehooks'; // Make sure to install: npm install @uidotdev/usehooks

const PLACEHOLDER_IMAGE = "/placeholder-image.png";

// --- Helper Function for Tracking URLs ---
const getCarrierTrackingUrl = (provider?: string | null, trackingNumber?: string | null): string | null => {
    if (!provider || !trackingNumber) return null;
    // Normalize provider name aggressively for matching keys
    const p = provider.toLowerCase().trim().replace(/ /g, '').replace('ground', '').replace('express','').replace('standard','');

    const trackingUrls: Record<string, string> = {
        'usps': `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
        'ups': `https://www.ups.com/track?tracknum=${trackingNumber}`,
        'fedex': `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`,
        'dhl': `https://www.dhl.com/global-en/home/tracking/tracking-express.html?submit=1&tracking-id=${trackingNumber}`,
        // Add other base carrier keys here (lowercase, no spaces/common suffixes)
    };

    // Attempt direct lookup first with normalized key
    if (trackingUrls[p]) {
        return trackingUrls[p];
    }
    // Fallback: check if the ORIGINAL provider string *includes* a known carrier name
    const lowerProvider = provider.toLowerCase();
    if (lowerProvider.includes('fedex')) return trackingUrls['fedex'];
    if (lowerProvider.includes('ups')) return trackingUrls['ups'];
    if (lowerProvider.includes('dhl')) return trackingUrls['dhl'];
    if (lowerProvider.includes('usps')) return trackingUrls['usps'];

    console.warn(`Unknown carrier provider for tracking link: ${provider}`);
    return null; // Return null if carrier is not recognized
};
// --- End Helper Function ---


function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null); // State for copy feedback
  const [showConfetti, setShowConfetti] = useState(false);
  const orderIdFromUrl = searchParams?.get("orderId");
  const { width, height } = useWindowSize(); // Get window dimensions for confetti

  // --- Data Fetching Effect ---
  useEffect(() => {
    if (!orderIdFromUrl) {
      if (searchParams !== null) { setError("Order ID missing from URL parameters."); }
      else { console.log("Order Confirmation: searchParams is null, waiting..."); }
      setLoading(false); return;
    }

    const fetchOrderFromSanity = async () => {
      setLoading(true); setError(null); setOrder(null);
      try {
        // Fetch ALL necessary fields from Sanity
        const query = `*[_type == "order" && _id == $orderId][0] {
          _id, orderNumber, orderDate, status, subtotal, discountAmount, discountCode,
          shippingCost, total, paymentMethod, shippingLabelUrl, trackingNumber, email,
          shippingAddress,
          shippingMethod { provider }, // Fetch provider for tracking link
          items[]{
             _key, quantity, nameAtPurchase, priceAtPurchase, image
             // If image is reference: "image": image.asset->url
          }
        }`;
        const params = { orderId: orderIdFromUrl };
        const data = await client.fetch<OrderDetails>(query, params);
        if (data) {
            setOrder(data);
            // Trigger confetti only once when order loads successfully
            if (!loading) { // Avoid triggering on initial load state change if fetch is fast
                 setShowConfetti(true);
                 setTimeout(() => setShowConfetti(false), 6000); // Duration of confetti
             }
        } else { setError(`Order details could not be found (ID: ${orderIdFromUrl}).`); }
      } catch (err: any) { setError("Failed to load order details."); console.error("Error fetching order:", err); }
      finally { setLoading(false); }
    };
    fetchOrderFromSanity();
  }, [orderIdFromUrl, searchParams]); // Rerun if orderId or searchParams change


  // --- Copy to Clipboard Function ---
  const copyToClipboard = (textToCopy: string | undefined | null, fieldName: string) => {
    if (!textToCopy || !navigator.clipboard) {
        console.warn("Clipboard API not available or no text to copy.");
        // Optionally show a fallback message to the user
        alert("Could not copy to clipboard.");
        return;
    };
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopied(fieldName); // Indicate which field was copied
        setTimeout(() => setCopied(null), 2000); // Reset after 2 seconds
      })
      .catch(err => {
          console.error(`Failed to copy ${fieldName}:`, err);
          alert(`Failed to copy ${fieldName}.`); // Inform user
        });
  };

  // --- Loading / Error / Not Found States ---
  if (loading) return <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500 dark:text-gray-400"><Loader2 className="animate-spin h-12 w-12 mb-4 text-orange-500" /> Loading Order Details...</div>;
  if (error) return <div className="text-center py-20 px-6 text-red-600 dark:text-red-400 flex flex-col items-center gap-4"><Info size={48} className="text-red-400"/> <p className="text-lg font-medium">Error Loading Order</p><p className="text-sm">{error}</p> <Link href="/shop" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">Go Shopping</Link></div>;
  if (!order) return <div className="text-center py-20 text-gray-500 dark:text-gray-400">Order details could not be found.</div>;


  // --- Prepare Derived Data ---
  const address = order.shippingAddress || {};
  const trackingUrl = getCarrierTrackingUrl(order.shippingMethod?.provider, order.trackingNumber);
  // --- End Derived Data ---

  // --- Render Order Details ---
  return (
    <>
      {/* Conditionally render Confetti */}
      {showConfetti && width && height && <Confetti width={width} height={height} recycle={false} numberOfPieces={350} tweenDuration={5500} initialVelocityY={15} gravity={0.12} />}

      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        className="max-w-5xl mx-auto my-10 md:my-16 p-6 sm:p-8 md:p-12 bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden"
      >
        {/* --- Header --- */}
        <div className="text-center mb-10 pb-8 border-b border-gray-200 border-gray-700/50 relative">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}>
                 <CheckCircle className="w-20 h-20 md:w-24 md:h-24 text-green-500 dark:text-green-400 mb-5 mx-auto drop-shadow-lg"/>
            </motion.div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-100 dark:text-white mb-3 tracking-tight"> Order Confirmed! </h1>
            <p className="text-gray-100 dark:text-gray-300 text-lg md:text-xl mb-4"> Thank you, <span className="font-medium">{order.email ? order.email.split('@')[0] : 'Valued Customer'}</span>! Your order <span className="font-semibold text-orange-500 dark:text-orange-400">#{order.orderNumber}</span> is confirmed. </p>
            <div className="text-sm text-gray-100 dark:text-gray-400 flex flex-wrap justify-center items-center gap-x-4 gap-y-1">
                <span>Placed on {new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span className="hidden sm:inline text-gray-100 dark:text-gray-600">•</span>
                <span className="inline-flex items-center gap-1.5 capitalize px-3 py-1 rounded-full bg-gray-900 text-blue-300 font-bold dark:bg-blue-900/70 dark:text-blue-200 text-xs"> <PackageCheck size={14}/> {order.status} </span>
            </div>
            {order.email && <p className="text-xs text-gray-500 dark:text-gray-500 mt-4 flex items-center justify-center gap-1"><Mail size={12}/> Confirmation sent to {order.email}.</p>}
        </div>

         {/* --- Items Summary --- */}
         <div className="mb-10">
             <h2 className="text-2xl font-semibold text-gray-100 dark:text-gray-100 mb-5">Items Ordered</h2>
             {(order.items && order.items.length > 0) ? (
               <div className="space-y-5 border border-gray-200 dark:border-gray-700/50 rounded-lg p-4 md:p-6 bg-gray-900 dark:bg-gray-800/30 shadow-sm max-h-[450px] overflow-y-auto custom-scrollbar">
                {order.items.map((item, index) => (
                   <motion.div key={item._key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + index * 0.05, duration: 0.4 }} className="flex items-center gap-5 border-b border-gray-200 dark:border-gray-700/50 pb-4 last:border-b-0">
                     <div className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border dark:border-gray-600 bg-gray-900 dark:bg-gray-700 shadow-inner">
                         <Image src={item.image || PLACEHOLDER_IMAGE} alt={item.nameAtPurchase || 'Product'} fill className="object-contain p-1"/>
                     </div>
                     <div className="flex-grow">
                       <p className="font-semibold text-base text-gray-100 dark:text-gray-50 leading-tight">{item.nameAtPurchase || 'N/A'}</p>
                       <p className="text-sm text-gray-100 dark:text-gray-400"> Qty: {item.quantity || 0} </p>
                       <p className="text-sm text-gray-100 dark:text-gray-300 font-medium">@ ${(item.priceAtPurchase ?? 0).toFixed(2)} each</p>
                     </div>
                     <p className="font-semibold text-lg text-gray-100 dark:text-gray-100 text-right flex-shrink-0"> ${((item.quantity || 0) * (item.priceAtPurchase ?? 0)).toFixed(2)} </p>
                   </motion.div>
                ))}
              </div>
             ) : ( <p className="text-gray-100 dark:text-gray-400 text-center py-4 italic border rounded-md dark:border-gray-700">No items listed.</p> )}
           </div>

       {/* --- Financial & Shipping Grid --- */}
       <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 mb-10">

           {/* Billing Summary (Column 1) */}
           <div className="lg:col-span-2 border-t border-gray-200 dark:border-gray-100 pt-6">
               <h2 className="text-xl font-bold text-gray-100 dark:text-gray-100 mb-4">Billing Summary</h2>
               <div className="text-sm space-y-3 bg-gray-900 dark:bg-gray-700/40 p-6 rounded-lg border border-gray-200 dark:border-gray-600/50">
                    <div className="flex justify-between text-gray-100 dark:text-gray-300"><span>Subtotal:</span> <span className="font-medium">${(order.subtotal ?? 0).toFixed(2)}</span></div>
                    {order.discountAmount > 0 && ( <div className="flex justify-between text-green-200 dark:text-green-400"><span>Discount {order.discountCode ? `(${order.discountCode})` : ''}:</span> <span className="font-medium">-${order.discountAmount.toFixed(2)}</span></div> )}
                    <div className="flex justify-between text-gray-100 dark:text-gray-300"><span>Shipping:</span> <span className="font-medium">${(order.shippingCost ?? 0).toFixed(2)}</span></div>
                    <div className="flex justify-between text-lg font-bold text-gray-100 dark:text-white mt-4 border-t border-gray-300 dark:border-gray-500 pt-3"><span>Total Paid:</span> <span>${(order.total ?? 0).toFixed(2)}</span></div>
                    <div className="flex justify-between text-xs pt-1 text-gray-100 dark:text-gray-400"><span>Payment Method:</span><span className="capitalize">{order.paymentMethod?.replace('_', ' ') || 'N/A'}</span></div>
               </div>
           </div>

           {/* Shipping, Tracking & Downloads (Column 2) */}
           <div className="lg:col-span-3 border-t border-gray-200 pt-6">
               <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2"><Truck size={20} className="text-blue-500 dark:text-blue-400"/> Shipping & Links</h2>
               <div className="space-y-4">
                   {/* Address Box */}
                   <div className="text-sm text-gray-100 border-gray-200 bg-gray-900 p-5 rounded-lg border space-y-1.5">
                        <p className="font-medium text-gray-100 dark:text-gray-100 mb-1">Shipping Address:</p>
                        <p>{address.street || 'N/A'}</p> {address.address2 && <p>{address.address2}</p>}
                        <p>{address.city || ''}, {address.state || ''} {address.zip || ''} [{address.country || ''}]</p>
                   </div>

                   {/* Tracking & Downloads Box */}
                   <div className="text-sm text-gray-100 border-gray-200 bg-gray-900 p-5 rounded-lg border space-y-4">
                        <p className="font-bold text-gray-100 mb-1">Status & Links:</p>

                        {/* Tracking Info */}
                        <div className="border-t border-gray-200 pt-3 space-y-1.5">
                            <p className="text-xs font-semibold text-gray-100">Tracking Information:</p>
                            {order.trackingNumber ? (
                                <div className="flex items-center justify-between flex-wrap gap-x-4 gap-y-1">
                                    <div className="flex items-center gap-2 flex-grow">
                                        <span className="font-mono bg-gray-200 px-2 py-1 rounded text-sm">{order.trackingNumber}</span>
                                        <button onClick={() => copyToClipboard(order.trackingNumber, 'Tracking #')} title="Copy Tracking Number" className="text-gray-100 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-200">{copied === 'Tracking #' ? <CheckCircle size={14} className="text-green-500"/> : <Copy size={14} />}</button>
                                        {copied === 'Tracking #' && <span className="text-xs text-green-600 animate-pulse">Copied!</span>}
                                    </div>
                                     <div className="text-right flex-shrink-0">
                                         {order.shippingMethod?.provider && ( <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Carrier: {order.shippingMethod.provider}</p> )}
                                         {trackingUrl ? ( <a href={trackingUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline font-medium inline-flex items-center gap-1 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100"> Track <ExternalLink size={12} /> </a> ) : ( <span className="text-xs text-gray-100 italic">Link N/A</span> )}
                                     </div>
                                </div>
                             ) : <p className="italic text-gray-100 text-xs">Tracking info pending.</p>}
                        </div>

                        {/* Downloads Section */}
                         <div className="border-t pt-3 space-y-3"> {/* Increased spacing */}
                             <p className="text-xs font-bold text-gray-100">Downloads:</p>
                             {/* Shipping Label */}
                             <div className="flex items-center"> {/* Use flex for alignment */}
                                 {order.shippingLabelUrl ? (
                                    <a href={order.shippingLabelUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-600 hover:underline text-sm"><Download size={14} /> Shipping Label</a>
                                 ) : <p className="italic text-gray-100 text-xs flex items-center gap-1.5"><Download size={14} className="text-gray-100"/> Label not available.</p>}
                             </div>
                             {/* Invoice */}
                             <div className="flex items-center"> {/* Use flex for alignment */}
                                 <a href={`/api/order/generate-pdf?orderId=${order._id}&download=true`} rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-300 font-bold hover:underline text-sm"><FileText size={14} /> Invoice (PDF)</a>
                             </div>
                         </div>
                   </div>
               </div>
           </div>
           {/* --- End Shipping, Tracking & Downloads Column --- */}
       </div>
       {/* --- End Financial & Shipping Grid --- */}


      {/* --- Action Buttons --- */}
      <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row justify-center items-center mt-12 pt-8 border-t border-gray-200 gap-4" // Added more top margin/padding
      >
        <Link href="/Shop" className="group flex items-center justify-center gap-2 px-6 py-2.5 text-white font-bold bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300 ease-in-out w-full sm:w-auto text-sm"> <ShoppingCart size={16} className="transition-transform duration-300 group-hover:rotate-[-12deg]"/> Continue Shopping </Link>
        <Link href="/" className="group flex items-center justify-center gap-2 px-6 py-2.5 text-gray-900 font-bold dark:text-gray-200 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200 ease-in-out w-full sm:w-auto text-sm"> <Home size={16} className="transition-transform duration-300 group-hover:scale-110"/> Go to Homepage </Link>
      </motion.div>
    </motion.div>
    </>
  );
}

// --- Main Page Component ---
export default function OrderConfirmationPage() {
  return (
    <div className="main-content min-h-screen text-gray-300"> {/* Added gradient */}
        <Suspense fallback={ <div className="flex items-center justify-center min-h-[50vh] text-gray-500 dark:text-gray-400"><Loader2 className="animate-spin h-12 w-12" /> Loading Confirmation...</div> }>
            <OrderConfirmationContent />
        </Suspense>
    </div>
  );
}

// Optional: Add CSS for custom scrollbar
// <style jsx global>{` .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; } /* ... */ `}</style>