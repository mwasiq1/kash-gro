"use client";

import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
              <p className="text-xs text-[#999999]">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#999999] gap-3">
              <ShoppingCart className="w-14 h-14 text-gray-200" />
              <p className="font-semibold text-sm">Your cart is empty</p>
              <p className="text-xs text-center">Add items to get started!</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-[#F4F6FA] rounded-xl p-3">
                <div className="relative w-12 h-12 bg-white rounded-lg flex-shrink-0 overflow-hidden">
                  <Image
                    src={item.image || `https://placehold.co/48x48/F4F6FA/1C1C1C?text=${item.name.slice(0, 2)}`}
                    alt={item.name}
                    fill
                    className="object-contain p-1"
                    sizes="48px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1C1C1C] truncate">{item.name}</p>
                  <p className="text-xs text-[#999999]">{item.unit}</p>
                </div>
                <div className="flex items-center bg-[#F8C200] rounded-xl overflow-hidden flex-shrink-0">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1.5 text-[#1C1C1C] hover:bg-[#E6B400] transition">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[#1C1C1C] font-bold text-sm w-5 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1.5 text-[#1C1C1C] hover:bg-[#E6B400] transition">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-sm font-extrabold text-[#1C1C1C] w-14 text-right flex-shrink-0">
                  ₹{(item.price * item.quantity).toFixed(0)}
                </p>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            {/* Free Delivery Progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">
                  {cartTotal >= 200 ? (
                    <span className="text-[#0C831F] font-bold">Yay! Free delivery unlocked</span>
                  ) : (
                    `Add ₹${(200 - cartTotal).toFixed(0)} more for free delivery`
                  )}
                </span>
                <span className="text-[11px] font-black text-[#1C1C1C]">₹200</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#F8C200] transition-all duration-500" 
                  style={{ width: `${Math.min(100, (cartTotal / 200) * 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#666666] font-medium">Subtotal</span>
                <span className="font-bold text-[#1C1C1C]">₹{cartTotal.toFixed(0)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#666666] font-medium">Delivery Fee</span>
                <span className={`font-bold ${cartTotal >= 200 ? "text-[#0C831F]" : "text-[#1C1C1C]"}`}>
                  {cartTotal >= 200 ? "FREE" : "₹25"}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="w-full bg-[#F8C200] text-[#1C1C1C] font-black py-4 rounded-xl flex items-center justify-between px-6 hover:bg-[#E6B400] active:scale-[0.98] transition-all text-base shadow-lg shadow-yellow-100"
            >
              <div className="text-left">
                <p className="text-[10px] uppercase opacity-80 leading-none mb-1">Total</p>
                <p className="font-black">₹{(cartTotal + (cartTotal >= 200 ? 0 : 25)).toFixed(0)}</p>
              </div>
              <span className="flex items-center gap-1 font-black">
                Proceed to Checkout
                <span className="text-xl">→</span>
              </span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
