"use client";

import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "../../hooks/useCart";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, updateQuantity, cartTotal, itemCount } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <h2 className="font-extrabold text-lg text-[#1C1C1C]">Your Cart</h2>
            {itemCount > 0 && (
              <p className="text-xs text-gray-400">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <ShoppingCart className="w-14 h-14 text-gray-200" />
              <p className="font-semibold text-sm">Your cart is empty</p>
              <p className="text-xs text-center">Add items to get started!</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-[#F4F6FA] rounded-xl p-3">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-12 h-12 object-contain rounded-lg bg-white flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/48x48/F4F6FA/1C1C1C?text=${item.name.slice(0, 2)}`;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1C1C1C] truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.unit}</p>
                </div>
                <div className="flex items-center bg-[#0C831F] rounded-xl overflow-hidden flex-shrink-0">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1.5 text-white hover:bg-[#0a6b19] transition">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-white font-bold text-sm w-5 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1.5 text-white hover:bg-[#0a6b19] transition">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-sm font-extrabold text-[#1C1C1C] w-14 text-right flex-shrink-0">
                  ₹{(item.sellingPrice * item.quantity).toFixed(0)}
                </p>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t bg-white">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-600">Subtotal</span>
              <span className="font-extrabold text-[#1C1C1C] text-lg">₹{cartTotal.toFixed(0)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="w-full bg-[#0C831F] text-white font-bold py-4 rounded-xl flex justify-center hover:bg-[#0a6b19] active:scale-[0.98] transition-all text-base"
            >
              Proceed to Checkout →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
