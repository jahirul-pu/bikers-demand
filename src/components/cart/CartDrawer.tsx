"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
} from "lucide-react";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  size?: string | null;
  imageUrl: string;
  categorySlug?: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Sync with localStorage on drawer open
  useEffect(() => {
    if (isOpen) {
      try {
        const savedCart = localStorage.getItem("bikers_demand_cart");
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCartItems(parsed);
          }
        }
      } catch (e) {
        console.error("Error reading cart from storage:", e);
      }
    }
  }, [isOpen]);

  const saveCartToStorage = (newItems: CartItem[]) => {
    setCartItems(newItems);
    try {
      localStorage.setItem("bikers_demand_cart", JSON.stringify(newItems));
      window.dispatchEvent(new CustomEvent("cart-updated"));
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Error saving cart to storage:", e);
    }
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveCartToStorage(updated);
  };

  const handleRemoveItem = (id: string) => {
    const updated = cartItems.filter((item) => item.id !== id);
    saveCartToStorage(updated);
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-mono text-xs">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-asphalt/80 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Slide-over Right Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-asphalt-2 border-l border-steel/30 text-off-white shadow-2xl flex flex-col justify-between transform transition-transform animate-slide-left">
          
          {/* Drawer Header */}
          <div className="p-5 bg-asphalt border-b border-asphalt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-ignition-red" />
              <h2 className="display-font text-xl font-extrabold uppercase text-off-white tracking-wider">
                Shopping Cart ({totalItemCount})
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-steel hover:text-off-white hover:bg-asphalt-2 transition-colors rounded"
              title="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-4 text-steel">
                <ShoppingBag className="w-12 h-12 mx-auto text-steel/40" />
                <p className="font-bold uppercase text-off-white">Cart is empty</p>
                <p className="text-xs">Browse items and add them to your cart.</p>
                <div className="pt-2">
                  <Link
                    href="/shop"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold uppercase text-xs px-6 py-3 tracking-wider transition-colors transform -skew-x-6 shadow-md cursor-pointer"
                  >
                    <span className="transform skew-x-6 flex items-center gap-2">
                      <span>Shop Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-asphalt p-3.5 border border-asphalt-2 hover:border-steel/40 transition-all flex items-center gap-3"
                  >
                    <div className="w-16 h-16 bg-asphalt-2 p-1 border border-steel/20 shrink-0 flex items-center justify-center">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <span className="text-[10px] text-plate-yellow font-bold uppercase block truncate">
                        {item.brand}
                      </span>
                      <h4 className="text-xs font-semibold text-off-white line-clamp-1">
                        {item.name}
                      </h4>
                      {item.size && (
                        <div className="text-[10px] text-plate-yellow font-bold uppercase flex items-center gap-1">
                          <span>Size:</span>
                          <span className="bg-asphalt-2 px-1.5 py-0.5 border border-plate-yellow/40 rounded-xs">{item.size}</span>
                        </div>
                      )}
                      <div className="text-[11px] text-steel">
                        Tk {item.price.toLocaleString("en-BD")}
                      </div>

                      {/* Stepper & Trash */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center border border-steel/30 bg-asphalt-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            className="px-2 py-0.5 text-steel hover:text-off-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 py-0.5 font-bold text-off-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            className="px-2 py-0.5 text-steel hover:text-off-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-bold text-plate-yellow display-font text-sm">
                          Tk {(item.price * item.quantity).toLocaleString("en-BD")}
                        </span>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-steel hover:text-ignition-red p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer & Proceed to Checkout CTA */}
          {cartItems.length > 0 && (
            <div className="p-5 bg-asphalt border-t border-asphalt-2 space-y-4">
              <div className="flex justify-between text-sm font-extrabold text-off-white items-baseline">
                <span>Subtotal:</span>
                <span className="text-plate-yellow display-font text-2xl font-extrabold">
                  Tk {subtotal.toLocaleString("en-BD")}
                </span>
              </div>

              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full bg-ignition-red hover:bg-red-600 text-asphalt font-extrabold uppercase text-xs py-3.5 text-center tracking-wider block transition-all transform -skew-x-6 shadow-lg"
              >
                <span className="transform skew-x-6 flex items-center justify-center gap-2">
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
