"use client";

import { Search, ShoppingCart, MapPin } from "lucide-react";
import { useCart } from "../../hooks/useCart";

interface TopNavProps {
  onCartOpen: () => void;
}

export default function TopNav({ onCartOpen }: TopNavProps) {
  const { itemCount, cartTotal } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      {/* Location row */}
      <div className="flex items-center gap-1.5 px-4 pt-3 pb-1">
        <MapPin className="w-4 h-4 text-[#F8C200] flex-shrink-0" />
        <div>
          <p className="text-xs font-extrabold text-[#1C1C1C] leading-none">Delivery in 10 mins</p>
          <p className="text-[11px] text-gray-400 truncate max-w-[180px]">Your location, India</p>
        </div>
        <button
          onClick={onCartOpen}
          className="ml-auto relative flex items-center gap-2 bg-[#0C831F] text-white text-xs font-bold px-3 py-2 rounded-xl"
        >
          <ShoppingCart className="w-4 h-4" />
          {/* itemCount=0 on server → always renders "Cart" first, no mismatch */}
          {itemCount > 0 ? (
            <span>{itemCount} item{itemCount !== 1 ? "s" : ""} · ₹{cartTotal.toFixed(0)}</span>
          ) : (
            <span>Cart</span>
          )}
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#F8C200] text-black text-[10px] font-extrabold rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pb-3 pt-1">
        <div className="flex items-center gap-2 bg-[#F4F6FA] rounded-xl px-3 py-2.5 border border-gray-100">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder='Search "milk", "bread"...'
            className="bg-transparent text-sm flex-1 outline-none text-[#1C1C1C] placeholder-gray-400"
          />
        </div>
      </div>
    </header>
  );
}
