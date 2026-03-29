"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../src/app/Context/CartContext"; // Import Cart Context

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    oldPrice?: number;
    isOnSale: boolean;
    image: string;
  };
}

const ProductCardOnShop: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const { addToCart, cart } = useCart(); // Access global cart and addToCart function

  // Add to Wishlist
  const handleAddToWishlist = () => {
    const existingWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    // Add product to wishlist if it's not already there
    if (!existingWishlist.some((item: any) => item.id === product.id)) {
      existingWishlist.push({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        originalPrice: product.oldPrice || null,
        availability: "In stock",
        quantity: 1,
      });
      localStorage.setItem("wishlist", JSON.stringify(existingWishlist));
    }

    // Navigate to the Wishlist page
    router.push("/WishList");
  };

  // Add to Cart
  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    };

    addToCart(cartItem); // Instantly update global cart state using CartContext
  };

  // Add to Compare
  const handleCompare = () => {
    const existingProducts = JSON.parse(localStorage.getItem("comparisonProducts") || "[]");

    // Add product if it's not already in the comparison list
    if (!existingProducts.some((p: any) => p.id === product.id)) {
      existingProducts.push(product);
      localStorage.setItem("comparisonProducts", JSON.stringify(existingProducts));
    }

    // Navigate to the comparison page
    router.push("/Product-Comparison");
  };

  return (
    <div
      data-reveal="true"
      className="relative overflow-hidden group border border-gray-200 bg-white rounded-lg shadow-md shadow-gray-300 transition-transform transition-shadow duration-300 will-change-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-400"
    >
      {product.isOnSale && (
        <span className="absolute top-2 left-2 text-sm text-white bg-orange-500 rounded px-2 py-1 z-10">
          Sale
        </span>
      )}

      <div className="relative overflow-hidden">
        <Link href={`/product/${product.slug}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 sm:h-56 md:h-64 object-cover rounded transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="flex flex-wrap items-center justify-center space-x-4 space-y-2 sm:space-y-0">
            {/* View Product */}
            <Link href={`/product/${product.slug}`}>
              <button
                className="bg-white p-2 rounded-full hover:bg-gray-200 transition-transform transform hover:scale-110"
                title="View Product"
              >
                👁️
              </button>
            </Link>

            {/* Add to Wishlist */}
            <button
              onClick={handleAddToWishlist}
              className="bg-white p-2 rounded-full hover:bg-gray-200 transition-transform transform hover:scale-110"
              title="Add to Wishlist"
            >
              ❤️
            </button>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="bg-white p-2 rounded-full hover:bg-gray-200 transition-transform transform hover:scale-110"
              title="Add to Cart"
            >
              🛒
            </button>

            {/* Add to Compare */}
            <button
              onClick={handleCompare}
              className="bg-white p-2 rounded-full hover:bg-gray-200 transition-transform transform hover:scale-110"
              title="Add to Compare"
            >
              🔄
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 text-center">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-gray-800 font-semibold text-lg cursor-pointer transition-colors duration-300 hover:text-orange-500">
            {product.name}
          </h3>
        </Link>
        <div className="text-orange-500 font-bold">${product.price}</div>
        {product.oldPrice && (
          <div className="text-gray-800 font-bold line-through">${product.oldPrice}</div>
        )}
      </div>
    </div>
  );
};

export default ProductCardOnShop;
