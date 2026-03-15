"use client";

import React, { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import { FaCartPlus } from "react-icons/fa";
import { useCart } from "../../../src/app/Context/CartContext";

interface WishlistItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  availability: string;
  quantity: number;
}

const WishList: React.FC = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const savedItems = localStorage.getItem("wishlist");
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  const handleRemoveItem = (id: string) => {
    const filteredItems = items.filter((item) => item.id !== id);
    setItems(filteredItems);
    localStorage.setItem("wishlist", JSON.stringify(filteredItems));
  };

  const handleAddToCart = (item: WishlistItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    });
  };

  return (
    <div className="main-content container mx-auto p-6 bg-grey-900 shadow-md rounded-lg mb-36">
      <h1 className="text-3xl font-bold text-gray-100 mb-6 text-center">WishList</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-900 text-center">
              <th className="p-4 border border-gray-200">Image</th>
              <th className="p-4 border border-gray-200">Product Name</th>
              <th className="p-4 border border-gray-200">Quantity</th>
              <th className="p-4 border border-gray-200">Price</th>
              <th className="p-4 border border-gray-200">Availability</th>
              <th className="p-4 border border-gray-200">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-gray-100 py-6 font-medium"
                >
                  Your wishlist is empty.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-900">
                  <td className="p-4 border border-gray-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </td>
                  <td className="p-4 border border-gray-200">
                    <span className="text-gray-100 font-medium">{item.name}</span>
                  </td>
                  <td className="p-4 border border-gray-200">
                    <span className="text-gray-100">{item.quantity}</span>
                  </td>
                  <td className="p-4 border border-gray-200">
                    {item.originalPrice && (
                      <span className="line-through text-gray-100 mr-2">
                        ${item.originalPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-gray-100 font-medium">
                      ${item.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4 border border-gray-200">
                    <span className="text-green-200">{item.availability}</span>
                  </td>
                  <td className="p-4 border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 flex items-center space-x-1"
                      >
                        <FaCartPlus />
                        <span>Add to Cart</span>
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 flex items-center space-x-1"
                      >
                        <FiTrash2 />
                        <span>Remove</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WishList;
