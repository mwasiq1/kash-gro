"use client";

import { ShoppingBag, ChevronRight, X, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "../../hooks/useCart";

export default function CartBottomSheet() {
  const { isMounted, items, updateQuantity, cartTotal, itemCount } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // useCart returns isMounted=false on server → items=[] → renders nothing
  if (!isMounted || items.length === 0) return null;

  return (
    <>
      {/* ── Sticky Bottom Bar ─────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-4 pointer-events-none">
        <div className="pointer-events-auto max-w-lg mx-auto bg-[#0C831F] rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-full flex items-center justify-between px-5 py-4 active:opacity-90 transition"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-extrabold">
                  {itemCount} item{itemCount !== 1 ? "s" : ""}
                </span>
              </div>
              <span className="text-white/60 text-sm">|</span>
              <span className="text-white font-extrabold text-sm">₹{cartTotal.toFixed(0)}</span>
            </div>
            <div className="flex items-center gap-0.5 text-white font-extrabold text-sm">
              View Cart <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      </div>

      {/* ── Full Cart Drawer ───────────────────────────────────────────────── */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-white z-[60] flex flex-col shadow-2xl transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <h2 className="font-extrabold text-lg text-[#1C1C1C]">Your Cart</h2>
            <p className="text-xs text-gray-400">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-32">
          {items.map((item) => (
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
              <p className="text-sm font-extrabold text-[#1C1C1C] w-12 text-right flex-shrink-0">
                ₹{(item.sellingPrice * item.quantity).toFixed(0)}
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 border-t bg-white">
          <div className="flex items-center justify-between mb-3 text-sm">
            <span className="text-gray-500 font-medium">Delivery fee</span>
            <span className="font-bold text-[#0C831F]">FREE</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-gray-700">Total</span>
            <span className="font-extrabold text-[#1C1C1C] text-lg">₹{cartTotal.toFixed(0)}</span>
          </div>
          <Link
            href="/checkout"
            onClick={() => setDrawerOpen(false)}
            className="w-full bg-[#0C831F] text-white font-bold py-4 rounded-xl flex justify-center hover:bg-[#0a6b19] active:scale-[0.98] transition-all text-base"
          >
            Proceed to Checkout →
          </Link>
        </div>
      </div>
    </>
  );
}
