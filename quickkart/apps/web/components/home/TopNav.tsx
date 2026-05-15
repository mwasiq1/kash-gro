"use client";

import { MapPin, ShoppingCart } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import SearchBar from "../product/SearchBar";

export default function TopNav() {
  const { itemCount, cartTotal, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm relative">
      {/* Location row */}
      <div className="flex items-center gap-1.5 px-4 pt-3 pb-1">
        <MapPin className="w-4 h-4 text-[#F8C200] flex-shrink-0" />
        <div>
          <p className="text-xs font-extrabold text-[#1C1C1C] leading-none">Delivery in 10 mins</p>
          <p className="text-[11px] text-gray-400 truncate max-w-[180px]">Your location, India</p>
        </div>
        <button
          onClick={openCart}
          className="ml-auto relative flex items-center gap-2 bg-[#0C831F] text-white text-xs font-bold px-3 py-2 rounded-xl"
        >
          <ShoppingCart className="w-4 h-4" />
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
        <SearchBar />
      </div>
    </header>
  );
}
