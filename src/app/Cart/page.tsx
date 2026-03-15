'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // Use empty array instead of null
  const [loading, setLoading] = useState(true); // Track loading state
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[];
      setCartItems(storedCart);
      setLoading(false); // Mark loading as complete
    }
  }, []);

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 0) return;
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const handleRemoveItem = (id: number) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const handleApplyCoupon = () => {
    setDiscount(couponCode === 'DISCOUNT10' ? 0.1 : 0);
  };

  const handleCheckout = () => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    router.push('/Checkout');
  };

  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCharges = 0.0;
  const totalAmount = cartSubtotal - cartSubtotal * discount + shippingCharges;

  return (
    <div className="main-content min-h-screen bg-black px-4 py-8 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-screen-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-lg font-bold">
            Your cart is empty.{' '}
            <a href="/Shop" className="text-orange-500">Continue Shopping</a>
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-gray-900 text-left">
                    <th className="p-4 font-bold">Product</th>
                    <th className="p-4 font-bold">Price</th>
                    <th className="p-4 font-bold">Quantity</th>
                    <th className="p-4 font-bold">Total</th>
                    <th className="p-4 font-bold">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-4 font-bold flex items-center space-x-4">
                        <Image src={item.image} alt={item.name} width={64} height={64} className="w-16 h-16 object-cover rounded" />
                        <span>{item.name}</span>
                      </td>
                      <td className="p-4 font-bold">${item.price.toFixed(2)}</td>
                      <td className="p-4">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                          className="bg-black font-bold w-16 border rounded px-2 py-1 text-center"
                          min="0"
                        />
                      </td>
                      <td className="p-4 font-bold">${(item.price * item.quantity).toFixed(2)}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="bg-red-500 text-white font-bold px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:justify-end">
              <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 border border-spacing-1 p-6 rounded-lg text-center md:text-left">
                <div className="flex justify-between mb-2 text-sm md:text-base">
                  <span>Subtotal</span>
                  <span>${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2 text-sm md:text-base">
                  <span>Discount</span>
                  <span>${(cartSubtotal * discount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2 text-sm md:text-base">
                  <span>Shipping</span>
                  <span>Choose shipping on checkout</span>
                </div>
                <div className="flex justify-between font-semibold text-lg md:text-xl">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <button onClick={handleCheckout} className="w-full bg-orange-500 text-white mt-4 py-2 rounded font-semibold hover:bg-orange-600 text-sm md:text-lg">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
