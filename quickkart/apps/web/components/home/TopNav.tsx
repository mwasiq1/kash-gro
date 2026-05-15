"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ShoppingCart, MapPin, Loader2 } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { fetchApi } from "../../lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface TopNavProps {
  onCartOpen: () => void;
}

export default function TopNav({ onCartOpen }: TopNavProps) {
  const { itemCount, cartTotal } = useCart();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowDropdown(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setShowDropdown(true);
        const { data } = await fetchApi(`/products?search=${encodeURIComponent(query)}`);
        setResults(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

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
      <div className="px-4 pb-3 pt-1 relative" ref={dropdownRef}>
        <div className="flex items-center gap-2 bg-[#F4F6FA] rounded-xl px-3 py-2.5 border border-gray-100">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder='Search "milk", "bread"...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (query.length >= 2) setShowDropdown(true);
            }}
            className="bg-transparent text-sm flex-1 outline-none text-[#1C1C1C] placeholder-gray-400"
          />
          {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-400 flex-shrink-0" />}
        </div>

        {/* Dropdown */}
        {showDropdown && query.length >= 2 && (
          <div className="absolute top-full left-4 right-4 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 flex items-center justify-center text-sm text-gray-500">
                Searching...
              </div>
            ) : results.length === 0 ? (
              <div className="p-4 flex items-center justify-center text-sm text-gray-500">
                No results for '{query}'
              </div>
            ) : (
              <div className="py-2">
                {results.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setShowDropdown(false);
                      setQuery("");
                      router.push(`/product/${product.id}`);
                    }}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition"
                  >
                    <div className="w-10 h-10 bg-[#F4F6FA] rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-50">
                      <img src={product.imageUrl} alt={product.name} className="w-8 h-8 object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1C1C1C] truncate">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.unit}</p>
                    </div>
                    <p className="text-sm font-bold text-[#1C1C1C]">₹{product.sellingPrice}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
