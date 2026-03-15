// src/app/Checkout/page.tsx
// Full component with Stripe Checkout integration

"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import ForAllHeroSections from "../../../components/ForAllHeroSections"; // Adjust path if needed
import { v4 as uuidv4 } from "uuid";
import ShippingRates from "../../../components/ShippingRates"; // Adjust path if needed
import { client } from "@/sanity/lib/client"; // Used for fetching discounts initially
import { loadStripe } from '@stripe/stripe-js'; // Import Stripe.js loader

// --- Stripe.js Initialization ---
// Load Stripe.js outside the component render cycle
// Ensure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set in your .env.local
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!stripePublishableKey) {
    console.error("CRITICAL ERROR: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable is not set.");
    // Potentially disable checkout button or show error if key is missing
}
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;
// --- End Stripe.js Initialization ---


// --- Interface Definitions ---
interface CartItem {
  id: string; // This MUST be the Sanity document _id of the product/food
  name: string;
  price: number;
  quantity: number;
  image: string;
}

type ShippingRateDetail = {
  id: string;
  provider: string;
  service?: string;
  amount: number;
  duration?: string;
  logo?: string;
};

interface Discount {
    _id: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
}
// --- End Interface Definitions ---


export default function CheckoutPage() {
  // --- Component State ---
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    street: "", city: "", state: "", zip: "", country: "", address2: "",
    billingSameAsShipping: true,
  });
  const [loading, setLoading] = useState(false); // For overall processing
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [shippingOptions, setShippingOptions] = useState<ShippingRateDetail[]>([]);
  const [selectedShippingId, setSelectedShippingId] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(""); // For UI selection record keeping
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discountDetails, setDiscountDetails] = useState<Discount | null>(null);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  // --- End Component State ---


  // --- Helper Functions ---
  const calculateSubtotal = (items: CartItem[]) =>
    items.reduce((total, item) => total + item.price * item.quantity, 0);

  const fetchCartData = useCallback(() => {
    console.log("Fetching cart data...");
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsedItems = (JSON.parse(storedCart) as CartItem[]).map(item => {
             if (!item || typeof item.id !== 'string' || !item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number' || item.quantity <= 0) {
                 console.warn("Invalid item structure found in localStorage cart, skipping:", item); return null;
             }
             return { ...item, id: String(item.id) };
        }).filter((item): item is CartItem => item !== null);

        if (parsedItems.length !== JSON.parse(storedCart).length) {
             console.warn("Some cart items from localStorage were invalid and skipped.");
        }
        console.log("Cart items loaded:", parsedItems);
        setCartItems(parsedItems);
        setSubtotal(calculateSubtotal(parsedItems));
      } catch (error) {
        console.error("Error parsing cart data from localStorage:", error);
        localStorage.removeItem("cart");
        setCartItems([]);
        setSubtotal(0);
       }
    } else {
      console.log("No cart data found in localStorage.");
      setCartItems([]);
      setSubtotal(0);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress((prev) => ({ ...prev, billingSameAsShipping: e.target.checked }));
  };

  const removeItemFromCart = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setSubtotal(calculateSubtotal(updatedCart));
    console.log(`Item ${id} removed from cart.`);
  };

  const handleSelectShipping = useCallback((shippingId: string | null) => {
    console.log("CheckoutPage: handleSelectShipping called with:", shippingId);
    setSelectedShippingId(shippingId);
  }, []);

  const applyDiscount = () => {
     const codeUpper = discountCode.trim().toUpperCase();
    const discount = discounts.find((d) => d.code === codeUpper);
    if (discount) {
        if (discount.type === "percentage") { setAppliedDiscount(discount.value); }
        else if (discount.type === "fixed" && subtotal > 0) { setAppliedDiscount(Math.min(100, (discount.value / subtotal) * 100)); }
        else { setAppliedDiscount(0); }
        setDiscountDetails(discount);
        alert(`Discount Applied: ${discount.code}`);
    } else {
        alert("Invalid or expired discount code.");
        setAppliedDiscount(0); setDiscountDetails(null); setDiscountCode("");
    }
  };
  // --- End Helper Functions ---


  // --- Effects ---
  useEffect(() => { // Fetch cart on mount & listen for storage changes
    fetchCartData();
    const handleStorageChange = (event: StorageEvent) => { if (event.key === "cart") fetchCartData(); };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchCartData]);

  useEffect(() => { // Fetch discounts on mount
    const fetchDiscounts = async () => {
      try {
        const discountData = await client.fetch<Discount[]>(
          `*[_type == "discount" && active == true && (!defined(expiry) || expiry > now())] { code, type, value, _id }`
        );
        setDiscounts(discountData || []);
        console.log("Fetched discounts:", discountData);
      } catch (error) { console.error("Error fetching discounts from Sanity:", error); }
    };
    fetchDiscounts();
  }, []);

  const fetchShippingRates = useCallback(async () => { // Fetch shipping rates
    if (!shippingAddress.zip || !shippingAddress.country || cartItems.length === 0) { return; }
    console.log("Fetching shipping rates for:", shippingAddress.zip, shippingAddress.country);
    setLoadingShipping(true); setShippingError(null); setShippingOptions([]); setSelectedShippingId(null);
    try {
      const response = await fetch("/api/shipping-rates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ zip: shippingAddress.zip, country: shippingAddress.country }) });
      // Handle fetch error (using read-once pattern)
      if (!response.ok) {
        let errorMsg = `Failed to fetch shipping rates (Status: ${response.status})`; let responseBodyText = '';
        try { responseBodyText = await response.text(); console.error("Shipping API error:", responseBodyText); try { const d = JSON.parse(responseBodyText); errorMsg = d.error || errorMsg; } catch (_) {} } catch (e) { errorMsg += ' & could not read response.' }
        throw new Error(errorMsg);
      }
      const data = await response.json();
      if (!data || Object.keys(data).length === 0) { setShippingError("No rates available."); setShippingOptions([]); return; }
      // Map rates
      const DELIVERY_LABELS: Record<string, { provider: string; service: string; duration: string }> = {
        standard_delivery:  { provider: "Standard Delivery",  service: "Our Delivery Riders", duration: "45–60 min" },
        express_delivery:   { provider: "Express Delivery",   service: "Priority Dispatch",   duration: "20–30 min" },
        scheduled_delivery: { provider: "Scheduled Delivery", service: "Your Chosen Time",    duration: "Flexible"  },
        pickup:             { provider: "Self Pickup",         service: "Collect In-Store",    duration: "Ready in 15 min" },
      };
      const formattedOptions: ShippingRateDetail[] = Object.entries(data).map(([key, value]) => {
        const meta = DELIVERY_LABELS[key] ?? { provider: key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()), service: "Restaurant Delivery", duration: "45–60 min" };
        return { id: key, provider: meta.provider, service: meta.service, amount: Number(value), duration: meta.duration };
      });
      setShippingOptions(formattedOptions);
    } catch (error) { console.error("Shipping fetch error:", error); setShippingError(error instanceof Error ? error.message : "Unknown shipping error."); setShippingOptions([]); }
    finally { setLoadingShipping(false); }
  }, [shippingAddress.zip, shippingAddress.country, cartItems]);

  useEffect(() => { // Debounced shipping fetch
    const timerId = setTimeout(() => { fetchShippingRates(); }, 1000);
    return () => clearTimeout(timerId);
  }, [fetchShippingRates]);
  // --- End Effects ---


  // --- Calculated Values ---
  const selectedShippingRate = shippingOptions.find(opt => opt.id === selectedShippingId);
  const selectedShippingCost = selectedShippingRate?.amount ?? 0;
  const discountRate = appliedDiscount / 100;
  const discountAmount = subtotal * discountRate;
  const totalWithDiscount = Math.max(0, subtotal - discountAmount + selectedShippingCost);
  // --- End Calculated Values ---


  // --- INTEGRATED: Handle Order Submission & Stripe Checkout Redirect ---
  const handlePlaceOrder = async () => {
    // 1. Frontend Validations
    if (!stripePromise) {
        alert("Payment system is not available. Please contact support.");
        console.error("Stripe Promise is null. Check NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.");
        return;
    }
    if (cartItems.length === 0) { alert("Your cart is empty."); return; }
    const { street, city, state, zip, country } = shippingAddress;
    if (!street || !city || !state || !zip || !country) { alert("Please fill in all required shipping address fields."); return; }
    if (!selectedShippingId) { alert("Please select a shipping method."); return; }
    const selectedShippingOption = shippingOptions.find(s => s.id === selectedShippingId);
    if (!selectedShippingOption) { alert("Selected shipping method is invalid."); return; }
    if (!selectedPaymentMethod) { alert("Please select a payment method (for our records)."); return; }


    setLoading(true); // Start loading indicator
    console.log("--- Initiating Order & Redirect to Payment ---");

    // 2. Prepare Data for INITIAL Order Creation in Sanity (Pending Status)
    const initialOrderData = {
        items: cartItems.map((item) => {
             console.log(`Preparing item for API: ID=${item.id}, Name=${item.name}`);
             if (!item.id || !item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
                console.error("❌ Invalid item structure detected before sending to API:", item);
                // Consider throwing an error here to stop the process if an item is invalid
                 throw new Error(`Invalid item data for ${item.name || 'unknown item'}. Cannot proceed.`);
             }
             return { id: item.id, name: item.name, price: item.price, quantity: item.quantity, image: item.image || null };
        }),
        subtotal: subtotal,
        discountAmount: discountAmount,
        discountCode: discountDetails ? discountDetails.code : null,
        shippingCost: selectedShippingOption.amount,
        total: totalWithDiscount,
        shippingAddress: {
            street: shippingAddress.street, address2: shippingAddress.address2 || null,
            city: shippingAddress.city, state: shippingAddress.state, zip: shippingAddress.zip, country: shippingAddress.country,
        },
        billingSameAsShipping: shippingAddress.billingSameAsShipping,
        // Conditionally add billing address
        ...(shippingAddress.billingSameAsShipping === false && {
             billingAddress: { street: '', city: '', state: '', zip: '', country: '' /* Populate with actual billing fields */ }
        }),
        paymentMethod: selectedPaymentMethod, // Record UI selection
        shippingMethod: {
            provider: selectedShippingOption.provider, service: selectedShippingOption.service || "Standard",
            cost: selectedShippingOption.amount, estimatedDelivery: selectedShippingOption.duration || "N/A",
            rateId: selectedShippingOption.id
        },
    };
    console.log("📦 Initial Order Data Prepared for /api/order/create:", JSON.stringify(initialOrderData, null, 2));


    let sanityOrderId: string | null = null; // Store the created Sanity order _id

    try {
        // === Step 1: Create the PENDING Order in Sanity ===
        console.log("📞 Calling POST /api/order/create...");
        const orderResponse = await fetch("/api/order/create", {
            method: "POST", headers: { "Content-Type": 'application/json' }, body: JSON.stringify(initialOrderData),
        });

        // Handle errors from order creation using "read once" pattern
        if (!orderResponse.ok) {
            let errorMsg = `Failed to create initial order (Status: ${orderResponse.status})`; let responseBodyText = '';
            try { responseBodyText = await orderResponse.text(); console.error("Order creation API error:", responseBodyText); try { const d=JSON.parse(responseBodyText); errorMsg=d.message||d.error||errorMsg; } catch(_){} } catch(e){ errorMsg+=' & could not read response.' }
            throw new Error(errorMsg);
        }

        const responseData = await orderResponse.json();
        sanityOrderId = responseData?.orderId;
        console.log("✅ Initial pending order created response:", JSON.stringify(responseData, null, 2));
        if (!sanityOrderId) throw new Error("Order created, but API did not return a valid Sanity Order ID.");
        console.log("✅ Pending Order created successfully with Sanity ID:", sanityOrderId);


        // === Step 2: Call API to Create Stripe Checkout Session ===
        console.log("📞 Calling POST /api/payment to create Stripe Checkout Session...");
        const paymentApiData = {
             items: cartItems.map(item => ({ name: item.name, price: item.price, quantity: item.quantity, image: item.image })),
             currency: 'usd', // Or get dynamically
             metadata: { sanityOrderId: sanityOrderId } // Link session to Sanity order
        };
        const paymentResponse = await fetch('/api/payment', { // Ensure path is correct
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(paymentApiData)
        });

        // Handle errors from payment session API using "read once" pattern
        if (!paymentResponse.ok) {
            let errorMsg = `Failed to create payment session (Status: ${paymentResponse.status})`; let responseBodyText = '';
            try { responseBodyText = await paymentResponse.text(); console.error("Payment session API error:", responseBodyText); try { const d=JSON.parse(responseBodyText); errorMsg=d.message||d.error||errorMsg; } catch(_){} } catch(e){ errorMsg+=' & could not read response.' }
            throw new Error(errorMsg);
        }

        const { sessionId, error: sessionError } = await paymentResponse.json();
        if (sessionError) throw new Error(sessionError.message || "Failed to get payment session ID.");
        if (!sessionId) throw new Error("Payment session created, but API did not return a Session ID.");
        console.log("✅ Stripe Checkout Session ID received:", sessionId);


        // === Step 3: Redirect to Stripe Checkout ===
        console.log("⏳ Redirecting to Stripe Checkout...");
        const stripe = await stripePromise;
        if (!stripe) throw new Error("Stripe.js failed to load."); // Should be caught by initial check

        const { error: stripeRedirectError } = await stripe.redirectToCheckout({ sessionId });
        // If redirect fails (unlikely unless session ID is bad client-side), error is thrown
        if (stripeRedirectError) {
            console.error("Stripe redirect error:", stripeRedirectError);
            throw new Error(stripeRedirectError.message || "Failed to redirect to payment page.");
        }
        // On successful redirect start, this component potentially unmounts / stops execution here

    } catch (error) { // Catch errors from any step
        console.error('💥 Order placement or payment initiation failed:', error);
        alert(`Processing failed: ${error instanceof Error ? error.message : 'An unknown error occurred.'}\nPlease try again or contact support.`);
        setLoading(false); // Stop loading ON ERROR
    }
    // No 'finally' block for setLoading(false) needed here, as success involves navigating away.
  };
  // --- End handlePlaceOrder ---


  // --- Payment Methods (for UI display) ---
  const paymentMethods = [
    { id: "stripe_checkout", name: "Card / Other (via Stripe)" },
  ];
  // --- End Payment Methods ---

  console.log("📦 Final Shipping Options being passed to component:", JSON.stringify(shippingOptions, null, 2));

  // --- JSX Rendering ---
  return (
    <div className="main-content">
      <ForAllHeroSections />

      {/* Loading Overlay */}
      {loading && (
         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[999]">
           <div className="bg-white p-8 rounded-lg shadow-xl text-center">
             <div className="loader mb-4 mx-auto"></div>
             <p className="text-lg font-semibold text-gray-700">Processing your order...</p>
             <p className="text-sm text-gray-500">Redirecting to payment...</p>
           </div>
         </div>
      )}

      {/* Main Checkout Layout */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row justify-between lg:gap-12">

          {/* Left Section: Shipping & Payment */}
          <div className="w-full lg:w-3/5 order-2 lg:order-1">
            {/* Shipping Address Form */}
             <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white">
                    <input type="text" name="street" placeholder="Street Address *" className="text-white border p-3 rounded w-full focus:ring-1 focus:ring-orange-400 outline-1 bg-gray-800" value={shippingAddress.street} onChange={handleInputChange} required />

                    <input type="text" name="address2" placeholder="Apt, Suite, etc. (Optional)" className="text-white border p-3 rounded w-full focus:ring-1 focus:ring-orange-400 outline-1 bg-gray-800" value={shippingAddress.address2} onChange={handleInputChange} />

                    <input type="text" name="city" placeholder="City *" className="text-white border p-3 rounded w-full focus:ring-1 focus:ring-orange-400 outline-1 bg-gray-800" value={shippingAddress.city} onChange={handleInputChange} required />

                    <input type="text" name="state" placeholder="State / Province *" className="text-white border p-3 rounded w-full focus:ring-1 focus:ring-orange-400 outline-1 bg-gray-800" value={shippingAddress.state} onChange={handleInputChange} required />

                    <input type="text" name="zip" placeholder="ZIP / Postal Code *" className="text-white border p-3 rounded w-full focus:ring-1 focus:ring-orange-400 outline-1 bg-gray-800" value={shippingAddress.zip} onChange={handleInputChange} required />

                    <select name="country" value={shippingAddress.country} onChange={handleInputChange} className="border p-3 rounded w-full text-gray-100 focus:ring-1 focus:ring-orange-400 outline-1 bg-gray-800" required>
                        <option value="">Select Country *</option>
                        <option value="PK">Pakistan</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="JP">Japan</option>
                        <option value="BR">Brazil</option>
                        <option value="IN">India</option>
                        <option value="CN">China</option>
                        <option value="RU">Russia</option>
                        <option value="NG">Nigeria</option>
                        <option value="ZA">South Africa</option>
                        <option value="EG">Egypt</option>
                        <option value="KE">Kenya</option>
                    </select>
                </div>
                {/* Billing Address Section */}
                 <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-medium mb-2 text-white">Billing Address</h3>
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-400" onChange={handleCheckboxChange} checked={shippingAddress.billingSameAsShipping} />
                        <span>Same as shipping address</span>
                    </label>
                    {!shippingAddress.billingSameAsShipping && (
                        <div className="mt-4 p-4 border rounded bg-gray-50">
                            <p className="text-sm text-gray-600 font-medium mb-2">Enter Billing Address:</p>
                            {/* Implement actual input fields for billing address here */}
                            <p className="text-xs text-red-500">(Billing address input fields need to be implemented)</p>
                        </div>
                    )}
                 </div>
            </div> {/* End Shipping Address Form */}

            {/* Shipping Method Section */}
            <div id="shipping-options-section" className="bg-gray-800 text-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Shipping Method</h2>
                <ShippingRates
                    shippingAddress={shippingAddress}
                    cartItems={cartItems}
                    onSelectShipping={handleSelectShipping}
                    selectedShippingId={selectedShippingId}
                    shippingOptionsFromParent={shippingOptions}
                    loading={loadingShipping}
                    error={shippingError}
                />
            </div> {/* End Shipping Method Section */}

            {/* Payment Method Section */}
             <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-white">Payment Method</h2>
                <div className="space-y-3 text-white bg-gray-800">
                    {paymentMethods.map((method) => (
                        <label key={method.id} className="text-white flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-orange-400 transition-colors duration-200 has-[:checked]:bg-gray-700 has-[:checked]:border-orange-500">
                            <input type="radio" name="paymentMethod" value={method.id} checked={selectedPaymentMethod === method.id} onChange={(e) => setSelectedPaymentMethod(e.target.value)} className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"/>
                            <span className="text-white font-medium">{method.name}</span>
                        </label>
                    ))}
                </div>
                {/* No direct payment inputs needed here for Stripe Checkout */}
             </div> {/* End Payment Method Section */}

            {/* Action Buttons */}
             <div className="text-white flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                <button className="px-6 py-3 bg-gray-800 text-white rounded-md shadow-sm hover:bg-gray-700 transition duration-200 order-2 sm:order-1 w-full sm:w-auto" onClick={() => window.history.back()}>
                    ← Back
                </button>
                {/* Changed button text to reflect payment step */}
                <button className="w-full bg-orange-500 text-white mt-4 py-3 rounded font-semibold hover:bg-orange-600 text-sm md:text-lg px-8 transition duration-50 flex items-center justify-center gap-2 order-1 sm:order-2 sm:w-auto disabled:cursor-not-allowed"
                    onClick={handlePlaceOrder}
                    disabled={loading || cartItems.length === 0 || !selectedShippingId || !selectedPaymentMethod || !stripePromise} // Disable if stripe not loaded
                >
                    {loading ? 'Processing...' : 'Proceed to Payment'} → {/* Updated Button Text */}
                </button>
             </div> {/* End Action Buttons */}

          </div> {/* End Left Section */}

          {/* Right Section: Order Summary */}
           <div className="w-full lg:w-2/5 order-1 lg:order-2 mb-8 lg:mb-0">
                <div className="sticky top-24 bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-xl font-semibold mb-5 text-white border-b pb-3">Order Summary</h2>
                    {/* Cart Items Display */}
                    <div className="max-h-60 overflow-y-auto space-y-4 mb-4 pr-2">
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 border-b pb-2 last:border-b-0">
                                    <div className="relative flex-shrink-0">
                                        <Image src={item.image || "/placeholder-image.png"} alt={item.name} className="w-14 h-14 rounded object-cover border" width={56} height={56}/>
                                        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">{item.quantity}</span>
                                    </div>
                                    <div className="flex-grow min-w-0"> {/* Added min-w-0 for flex shrink */}
                                        <h3 className="text-sm font-medium text-gray-100 truncate">{item.name}</h3> {/* Added truncate */}
                                        <p className="text-xs text-gray-200">${item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="text-sm font-semibold text-white flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</div>
                                    <button title="Remove item" className="text-red-400 hover:text-red-600 text-lg ml-1 flex-shrink-0 p-1" onClick={() => removeItemFromCart(item.id)}> × </button>
                                </div>
                            ))
                        ) : ( <p className="text-white text-center py-4">Your cart is empty.</p> )}
                    </div>
                    {/* Discount Code Input */}
                    <div className="mt-4 border-t pt-4">
                         <label htmlFor="discountCode" className="block text-sm font-medium text-white mb-1">Apply Discount Code</label>
                         <div className="flex gap-2">
                             <input id="discountCode" type="text" className="bg-gray-800 border p-2 rounded w-full text-sm focus:ring-1 focus:ring-orange-400 outline-none" placeholder="Enter code" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} disabled={!!discountDetails}/>
                             <button onClick={applyDiscount} className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition duration-200" disabled={!discountCode || !!discountDetails || subtotal === 0}>Apply</button>
                         </div>
                         {discountDetails && (
                             <div className="mt-2 text-sm text-green-600">
                                 Discount applied: {discountDetails.code}
                             </div>
                         )}
                    </div>
                    {/* Price Breakdown */}
                    <div className="mt-5 space-y-2 border-t pt-4 text-sm">
                         <div className="flex justify-between text-white"><span>Subtotal</span> <span>${subtotal.toFixed(2)}</span></div>
                         {discountAmount > 0 && (<div className="flex justify-between text-green-600"><span>Discount ({appliedDiscount.toFixed(0)}%)</span> <span>-${discountAmount.toFixed(2)}</span></div>)}
                         <div className="flex justify-between text-white"><span>Shipping</span> <span>{selectedShippingId ? `$${selectedShippingCost.toFixed(2)}` : 'Select address'}</span></div>
                    </div>
                    {/* Total */}
                    <div className="flex justify-between text-lg font-bold text-white mt-4 border-t pt-4">
                        <span>Total</span> <span>${totalWithDiscount.toFixed(2)}</span>
                    </div>
                </div>
           </div> {/* End Right Section */}
        </div>
      </div>

      {/* Loader styles */}
      <style jsx>{`
        .loader { width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #ff9f0d; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}