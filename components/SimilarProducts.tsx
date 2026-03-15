// components/SimilarProductsSection.tsx
// Enhanced for professionalism and visual appeal

"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from 'swiper'; // Import SwiperCore
import { Autoplay, Navigation, Pagination } from "swiper/modules"; // Import necessary modules
import "swiper/css"; // Core Swiper styles
import "swiper/css/navigation"; // Navigation styles
import "swiper/css/pagination"; // Pagination styles
import ProductCardOnShop from "./ProductCardOnShop";
import { client } from "../src/sanity/lib/client";
import { Skeleton } from "../src/components/ui/skeleton";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Swiper modules installation
// eslint-disable-next-line react-hooks/rules-of-hooks -- SwiperCore.use is not a React Hook; ESLint flags it due to the "use" name.
SwiperCore.use([Autoplay, Navigation, Pagination]);

interface SimilarProductsProps {
  currentProductId: string;
  // Optional: Pass category or tags from the current product for better filtering
  // category?: string | null;
  // tags?: string[] | null;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  image: string;
  isOnSale: boolean;
}

const SimilarProductsSection: React.FC<SimilarProductsProps> = ({
  currentProductId,
  // category, // Receive category if passed
  // tags,     // Receive tags if passed
}) => {
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetching logic
  useEffect(() => {
    // No need for isBrowser check with useEffect in client components
    async function fetchSimilarProducts() {
      setIsLoading(true);
      setError(null);
      console.log("Fetching similar products excluding currentProductId:", currentProductId);

      try {
        // --- Refined Query ---
        // Fetches products, EXCLUDING the current one.
        // LIMITS the number fetched (e.g., 10).
        // TODO: Ideally, filter by category or tags for better relevance.
        const query = `*[_type == "food" && _id != $currentProductId][0...10]{
          _id,
          name,
          "slug": slug.current, // Directly get current slug
          price,
          originalPrice,
          "image": image.asset->url
        }`;
        const params = { currentProductId };

        const products = await client.fetch<any[]>(query, params);
        console.log("Fetched potential similar products:", products);

        if (!products) {
             throw new Error("Received null response from Sanity fetch.");
        }

        // Map fetched data to Product interface
        const mappedProducts: Product[] = products
          .filter(p => p?._id && p?.slug && p?.name) // Basic validation
          .map((product) => ({
            id: product._id,
            slug: product.slug,
            name: product.name,
            price: product.price ?? 0,
            oldPrice: product.originalPrice ?? null,
            image: product.image || "/placeholder-image.png",
            isOnSale: product.originalPrice != null && product.price != null ? product.price < product.originalPrice : false,
          }));

        setSimilarProducts(mappedProducts);

      } catch (err) {
        console.error("Error fetching similar products:", err);
        setError("Could not load similar products."); // Set user-friendly error
        setSimilarProducts([]); // Clear products on error
      } finally {
        setIsLoading(false);
      }
    }

    fetchSimilarProducts();
  }, [currentProductId]); // Dependency array

  // --- Skeleton Loader ---
  const renderSkeletons = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <SwiperSlide key={`skeleton-${index}`} className="p-1"> {/* Add padding for shadow */}
        <div className="space-y-3">
          <Skeleton className="h-[200px] w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700" />
        </div>
      </SwiperSlide>
    ));
  };

  return (
    // Added more padding and background color for definition
    <div className="mt-16 md:mt-24 py-12 dark:bg-gray-900/50 rounded-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8"> {/* Ensure container padding */}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-100 dark:text-gray-100">
          You Might Also Like {/* Changed Title */}
        </h2>

        {error && ( // Display error message
            <div className="text-center text-red-500 dark:text-red-400 py-10">{error}</div>
        )}

        {!error && ( // Only show swiper or "no products" if no error occurred
            <div className="relative px-8 md:px-10"> {/* Add padding for navigation arrows */}
                <Swiper
                    modules={[Autoplay, Navigation, Pagination]} // Include needed modules
                    spaceBetween={30} // Increased space
                    slidesPerView={1}  // Default to 1 on smallest screens
                    autoplay={{ delay: 4000, disableOnInteraction: true }} // Slower autoplay, stop on interaction
                    pagination={{ clickable: true, dynamicBullets: true }} // Added pagination dots
                    navigation={{ // Custom navigation buttons
                        nextEl: '.swiper-button-next-custom',
                        prevEl: '.swiper-button-prev-custom',
                    }}
                    breakpoints={{ // Responsive slidesPerView
                        640: { slidesPerView: 2, spaceBetween: 20 }, // sm
                        768: { slidesPerView: 3, spaceBetween: 25 }, // md
                        1024: { slidesPerView: 4, spaceBetween: 30 }, // lg
                    }}
                    className="!pb-12 md:!pb-16" // Add padding-bottom for pagination dots
                >
                    {isLoading ? (
                        renderSkeletons(4) // Show 4 skeletons while loading
                    ) : similarProducts.length > 0 ? (
                        similarProducts.map((product) => (
                        <SwiperSlide key={product.id} className="p-1 group"> {/* Add group for potential hover effects */}
                           {/* Removed extra div, ProductCardOnShop likely has its own container */}
                            <ProductCardOnShop
                                product={{
                                id: product.id,
                                slug: product.slug,
                                name: product.name,
                                price: product.price,
                                oldPrice: product.oldPrice ?? undefined, // Convert null to undefined
                                isOnSale: product.isOnSale,
                                image: product.image,
                                }}
                            />
                        </SwiperSlide>
                        ))
                    ) : (
                        // No similar products found - render a placeholder slide or message
                         <div className="text-center col-span-full py-10 text-gray-500 dark:text-gray-400">No similar products found.</div>
                    )}
                </Swiper>

                 {/* Custom Navigation Buttons */}
                 {!isLoading && similarProducts.length > 4 && ( // Show arrows only if enough slides potentially
                    <>
                        <button className="swiper-button-prev-custom absolute top-1/2 left-0 md:left-[-10px] transform -translate-y-1/2 z-10 p-2 bg-white dark:bg-gray-700 rounded-full shadow-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all disabled:opacity-0 disabled:cursor-not-allowed">
                            <ArrowLeft size={20} />
                        </button>
                        <button className="swiper-button-next-custom absolute top-1/2 right-0 md:right-[-10px] transform -translate-y-1/2 z-10 p-2 bg-white dark:bg-gray-700 rounded-full shadow-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all disabled:opacity-0 disabled:cursor-not-allowed">
                            <ArrowRight size={20} />
                        </button>
                    </>
                 )}
            </div>
        )}
      </div>

       {/* Optional: Add custom Swiper pagination/navigation styles if needed */}
       <style jsx global>{`
            .swiper-pagination-bullet {
                background-color: #9ca3af; /* gray-400 */
                opacity: 0.6;
                transition: background-color 0.2s ease, opacity 0.2s ease;
            }
            .swiper-pagination-bullet-active {
                background-color: #f97316; /* orange-500 */
                opacity: 1;
            }
            /* Style custom nav buttons if default swiper styles conflict */
            .swiper-button-disabled {
                 opacity: 0.2;
                 cursor: not-allowed;
            }
       `}</style>
    </div>
  );
};

export default SimilarProductsSection;