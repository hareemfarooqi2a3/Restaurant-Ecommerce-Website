"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ForAllHeroSections from "../../../components/ForAllHeroSections"; // Adjust path if needed
import ProductCardOnShop from "../../../components/ProductCardOnShop"; // Adjust path if needed
import FiltersSidebarOnShop from "../../../components/FiltersSidebarOnShop"; // Adjust path if needed
import PaginationOnShop from "../../../components/PaginationOnShop"; // Adjust path if needed
import { client } from "../../sanity/lib/client"; // Adjust path if needed

// Define Food interface (keep as is or refine based on actual needs)
interface Food {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number | null; // Allow null
  image: string;
  description?: string;
  tags?: string[];
  available: boolean;
  category?: string;
  isOnSale: boolean;
}

function ShopPageContent() {
  const [products, setProducts] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams(); // Can return null initially

  // --- FIX: Use optional chaining ?. and nullish coalescing ?? ---
  const searchQuery = searchParams?.get("search") ?? ""; // Default to "" if searchParams is null or "search" is missing
  // --- END FIX ---

  useEffect(() => {
    // Only run fetch if searchParams is available (avoids extra fetch on initial null)
    // Note: searchQuery defaulting to "" handles the initial state well enough here,
    // but you could add `if (searchParams === null) return;` if needed.

    async function fetchProducts() {
       console.log(`Fetching products (search: "${searchQuery}")...`);
       setIsLoading(true); // Set loading true at the start of fetch
      try {
        // Define the base query
        const query = `*[_type == "food"]{
          _id,
          name,
          "slug": slug.current, // Directly get current slug
          price,
          originalPrice,
          "image": image.asset->url,
          description,
          tags,
          available,
          category
        }`;

        const sanityProducts = await client.fetch<any[]>(query); // Fetch all products initially
        console.log(`Fetched ${sanityProducts?.length ?? 0} products from Sanity.`);

        // Map and filter IN MEMORY after fetching ALL products
        // NOTE: For large datasets, filtering in the Sanity query (GROQ) is MUCH more efficient
        const mappedProducts: Food[] = sanityProducts
          .filter((product): product is { _id: string; slug?: string; name?: string; price?: number; image?: string; originalPrice?: number; description?: string; tags?: string[]; available?: boolean; category?: string; } => !!product?._id && !!product?.slug) // Ensure required fields exist and slug is defined
          .map((product) => ({
            id: product._id,
            slug: product.slug!, // Use non-null assertion as we filtered above
            name: product.name ?? "Unnamed Product", // Provide defaults
            price: product.price ?? 0,
            originalPrice: product.originalPrice ?? null,
            image: product.image || "/placeholder-image.png", // Use consistent placeholder
            description: product.description || "",
            tags: product.tags || [],
            available: product.available ?? false,
            category: product.category || "Uncategorized",
            isOnSale: product.originalPrice != null && product.price != null ? product.price < product.originalPrice : false,
          }));

        // Filter based on the searchQuery obtained safely earlier
        const filteredProducts = mappedProducts.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        console.log(`Filtered down to ${filteredProducts.length} products matching search.`);

        setProducts(filteredProducts);
        // setLoading false moved to finally block

      } catch (error) {
        console.error("Error fetching/processing products:", error);
        setProducts([]); // Clear products on error
        // Optionally set an error state to display to the user
      } finally {
          setIsLoading(false); // Ensure loading is set to false always
      }
    }

    fetchProducts();
  // searchQuery is derived from searchParams, add searchParams if direct dependency is needed
  }, [searchQuery]); // Re-run effect when searchQuery changes


  return (
    <div className="main-content">
      <div>
        <ForAllHeroSections />
      </div>
      <div
        id="main-content"
        className="transition-all duration-700 max-w-[1320px] mx-auto flex flex-col lg:flex-row space-y-12 lg:space-y-0 lg:space-x-12 mt-12 mb-36 px-4 sm:px-8 lg:px-36" // Adjusted horizontal padding
      >
        {/* Filters Sidebar */}
        <div className="w-full lg:w-1/4 xl:w-1/5 order-1 lg:order-none">
           <FiltersSidebarOnShop />
        </div>

        {/* Products Grid & Pagination */}
        <div className="flex-1 order-2 lg:order-none">
          {/* Optional: Show search term */}
          {searchQuery && <p className="mb-4 text-sm text-gray-100">Showing results for: "{searchQuery}"</p>}

          {isLoading ? (
            <div className="text-center py-10 text-gray-100">Loading products...</div>
          ) : products.length > 0 ? (
            // Products Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {products.map((product) => (
                <ProductCardOnShop
                  key={product.id}
                  product={{
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    oldPrice: product.originalPrice ?? undefined, // Pass undefined if null
                    isOnSale: product.isOnSale,
                    image: product.image || "/placeholder-image.png"
                  }}
                />
              ))}
            </div>
          ) : (
             // No Products Found Message
             <div className="text-center py-10 text-gray-100">
                 No products found{searchQuery ? ` matching "${searchQuery}"` : ''}.
             </div>
          )}

          {/* Pagination (conditionally render if needed) */}
          {/* Only show pagination if there are potentially multiple pages */}
          {/* You'll need total product count and items per page for real pagination */}
          {!isLoading && products.length > 0 && (
             <div className="mt-12">
                <PaginationOnShop />
             </div>
          )}
        </div>

      </div>
    </div>
  );
}

// Keep the Suspense wrapper
export default function ShopPage() {
  return (
    <Suspense fallback={<div className="text-center py-40">Loading Shop...</div>}> {/* Added padding */}
      <ShopPageContent />
    </Suspense>
  );
}