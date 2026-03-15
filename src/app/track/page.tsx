// src/app/track/page.tsx
// Updated with input field for tracking number

"use client";

import React, { useEffect, useState, Suspense, FormEvent, useCallback } from 'react'; // Added FormEvent, useCallback
import { useSearchParams, useRouter, usePathname } from 'next/navigation'; // Added useRouter, usePathname
import { client } from '@/sanity/lib/client';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react'; // Added Search icon
import ForAllHeroSections from "../../../components/ForAllHeroSections"; // Adjust path

// Interface matching order structure
interface TrackedOrder {
    _id: string;
    orderNumber: string;
    status: string;
    trackingNumber?: string | null;
    shippingMethod?: { provider?: string | null } | null;
}

function TrackingContent() {
    const router = useRouter();
    const pathname = usePathname(); // Get current pathname for updating URL
    const searchParams = useSearchParams(); // Get initial params

    // State for the input field
    const [trackingInput, setTrackingInput] = useState('');
    // State to hold the tracking number we are actively searching for
    const [currentTrackingNumber, setCurrentTrackingNumber] = useState<string | null>(null);

    const [order, setOrder] = useState<TrackedOrder | null>(null);
    const [loading, setLoading] = useState(false); // Start not loading initially
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false); // Track if a search has been performed

    // Function to update URL query param without full page reload
    const updateQueryParam = useCallback((number: string) => {
        const params = new URLSearchParams(searchParams?.toString()); // Use existing params if available
        if (number) {
            params.set('number', number);
        } else {
            params.delete('number');
        }
        // Use router.replace to update URL without adding to history
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
     }, [searchParams, pathname, router]);


    // Effect to read initial tracking number from URL on load
    useEffect(() => {
        const initialNumber = searchParams?.get('number');
        if (initialNumber) {
            console.log("Initial tracking number from URL:", initialNumber);
            setTrackingInput(initialNumber);
            setCurrentTrackingNumber(initialNumber); // Trigger fetch on load if number is present
            setSearched(true); // Indicate that an initial search is happening
        } else {
            // Clear results if URL doesn't have the number initially
            setOrder(null);
            setError(null);
            setLoading(false);
            setSearched(false);
        }
    }, [searchParams]); // Depend only on searchParams for initial load

    // Effect to fetch order details when currentTrackingNumber changes
    useEffect(() => {
        if (!currentTrackingNumber) {
            // Don't fetch if no tracking number is set to be searched
            // Clear previous results if tracking number is cleared
             setOrder(null);
             // Keep error only if it was explicitly set (e.g. "not found")
             // setError(null); // Optionally clear general errors
             setLoading(false);
             // setSearched(false); // Keep searched true if we are clearing after a search
            return;
        }

        const fetchOrderByTracking = async () => {
            console.log("Tracking page: Fetching order for tracking number:", currentTrackingNumber);
            setLoading(true);
            setError(null); // Clear previous errors
            setOrder(null); // Clear previous order data

            try {
                 const query = `*[_type == "order" && trackingNumber == $trackingNumber][0] {
                    _id, orderNumber, status, trackingNumber, shippingMethod { provider }
                }`;
                const params = { trackingNumber: currentTrackingNumber };
                const data = await client.fetch<TrackedOrder>(query, params);
                console.log("Sanity tracking fetch result:", data);

                if (data) {
                    setOrder(data);
                    setError(null); // Clear error on success
                } else {
                    console.error(`No order found with tracking number: ${currentTrackingNumber}`);
                    setError(`No order found with tracking number: ${currentTrackingNumber}`);
                    setOrder(null); // Ensure order is null if not found
                }
            } catch (err) {
                console.error("Failed to fetch order by tracking:", err);
                setError("Failed to load tracking details. Please try again later.");
                setOrder(null); // Ensure order is null on fetch error
            } finally {
                setLoading(false);
            }
        };

        fetchOrderByTracking();

    }, [currentTrackingNumber]); // Re-run only when the number to search for changes


    // Handle form submission
    const handleTrackSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission
        const trimmedInput = trackingInput.trim();
        if (!trimmedInput) {
            setError("Please enter a tracking number.");
            setCurrentTrackingNumber(null); // Clear search if input is empty
            updateQueryParam(''); // Clear URL param
            setSearched(false);
            return;
        }
        setError(null); // Clear previous errors
        setSearched(true); // Mark that a search was attempted
        setCurrentTrackingNumber(trimmedInput); // Set the number to search for
        updateQueryParam(trimmedInput); // Update the URL
    };

     // Function to generate carrier tracking URL
     const getCarrierTrackingUrl = (provider?: string | null, trackingNumber?: string | null): string | null => {
        if (!provider || !trackingNumber) return null;
        
        const trackingUrls: Record<string, string> = {
            'usps': `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
            'ups': `https://www.ups.com/track?tracknum=${trackingNumber}`,
            'fedex': `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`,
            'dhl': `https://www.dhl.com/us-en/home/tracking/tracking-express.html?submit=1&tracking-id=${trackingNumber}`
        };

        return trackingUrls[provider.toLowerCase()] || null;
     };
     const trackingUrl = getCarrierTrackingUrl(order?.shippingMethod?.provider, order?.trackingNumber);

    // --- Render Logic ---
    return (
        <div className="bg-grey-900 container mx-auto px-4 py-8 max-w-2xl"> {/* Increased max-width */}
            <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block text-sm">
                <ArrowLeft size={16} className="inline mr-1 relative -top-px" /> Back to Home
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-100">Track Your Order</h1>

            {/* Tracking Input Form */}
            <form onSubmit={handleTrackSubmit} className="mb-8 flex gap-2 items-center max-w-lg mx-auto">
                <label htmlFor="trackingNumberInput" className="sr-only">Tracking Number</label>
                <input
                    id="trackingNumberInput"
                    type="text"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="Enter your tracking number..."
                    className="bg-gray-900 flex-grow px-4 py-2 border font-bold border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-md shadow transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                    <Search size={16} /> Track
                </button>
            </form>

            {/* Display Area: Loading, Error, Not Found, or Order Details */}
            <div className="min-h-[200px]"> {/* Give the results area some minimum height */}
                {loading && (
                    <p className="text-center p-10 text-gray-600 dark:text-gray-400">Searching for tracking information...</p>
                )}

                {!loading && error && ( // Display error if not loading
                    <p className="text-center p-10 text-red-500">{error}</p>
                )}

                {!loading && !error && searched && !order && ( // Only show "not found" if search happened and no order/error
                    <p className="text-center p-10 text-gray-500 dark:text-gray-400">No order found for the provided tracking number.</p>
                )}

                {!loading && !error && order && ( // Display order details only if loading is false, no error, and order exists
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700 space-y-3">
                        <p><strong>Order Number:</strong> {order.orderNumber}</p>
                        <p><strong>Tracking Number:</strong> {order.trackingNumber || 'N/A'}</p>
                        <p><strong>Status:</strong> <span className="font-semibold capitalize">{order.status}</span></p>
                        {order.shippingMethod?.provider && (
                            <p><strong>Carrier:</strong> {order.shippingMethod.provider}</p>
                        )}
                        {trackingUrl ? (
                            <a href={trackingUrl} target="_blank" rel="noopener noreferrer" className="block w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition duration-200 text-center">
                                Track on {order.shippingMethod?.provider || 'Carrier Website'}
                            </a>
                        ) : (
                            order.trackingNumber && <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">Official carrier tracking link could not be generated.</p>
                        )}
                    </div>
                )}
                 {/* Initial state message before search */}
                 {!loading && !error && !searched && (
                     <p className="text-center p-10 text-gray-400 dark:text-gray-500 italic">Enter your tracking number above to see order status.</p>
                 )}
            </div>
        </div>
    );
}

// Main Page Component with Suspense and Hero Section
export default function TrackPage() { // Renamed component for clarity
    return (
        <div className="main-content">
            {/* Assuming ForAllHeroSections handles dark mode internally */}
            <ForAllHeroSections />

            <div className="text-gray-100 dark:text-gray-200 py-8 md:py-12"> {/* Added container div with background */}
                <Suspense fallback={<p className="text-center p-10 text-gray-100 dark:text-gray-400">Loading Tracking Page...</p>}>
                    <TrackingContent />
                </Suspense>
            </div>
        </div>
    );
}