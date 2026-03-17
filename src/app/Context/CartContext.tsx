"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextProps {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    }
    return [];
  });

  const updateLocalStorage = (newCart: CartItem[]) => {
    setCart(newCart);
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(newCart));
    }
  };

  const addToCart = (item: CartItem) => {
    const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === item.id);
    const updatedCart = [...cart];

    if (existingItemIndex > -1) {
      updatedCart[existingItemIndex].quantity += item.quantity || 1;
    } else {
      updatedCart.push({ ...item, quantity: item.quantity || 1 });
    }

    updateLocalStorage(updatedCart);
  };

  const removeFromCart = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    updateLocalStorage(updatedCart);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    updateLocalStorage(updatedCart);
  };

  const clearCart = () => {
    updateLocalStorage([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        getTotalPrice 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
