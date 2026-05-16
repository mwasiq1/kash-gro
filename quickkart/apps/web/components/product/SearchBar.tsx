"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { fetchApi } from "../../lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SearchBar() {
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
        // Explicitly passing search parameter as requested
        const response = await fetchApi(`/products?search=${encodeURIComponent(query)}`);
        setResults(response.data || []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleProductClick = (productId: string) => {
    setShowDropdown(false);
    setQuery("");
    router.push(`/product/${productId}`);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="flex items-center gap-2 bg-[#F4F6FA] rounded-xl px-3 py-2.5 border border-[#E8E8E8]">
        <Search className="w-4 h-4 text-[#999999] flex-shrink-0" />
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
        {loading && <Loader2 className="w-4 h-4 animate-spin text-[#999999] flex-shrink-0" />}
      </div>

      {/* Dropdown */}
      {showDropdown && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-[#E8E8E8] overflow-hidden z-50 max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 flex items-center justify-center text-sm text-[#666666]">
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 flex items-center justify-center text-sm text-[#666666]">
              No results for &apos;{query}&apos;
            </div>
          ) : (
            <div className="py-2">
              {results.slice(0, 5).map((product: any) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition"
                >
                  <div className="relative w-10 h-10 bg-[#F4F6FA] rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden border border-[#E8E8E8]">
                    <Image 
                      src={product.images[0] || "https://placehold.co/32x32?text=P"} 
                      alt={product.name} 
                      fill
                      className="object-contain p-1"
                      sizes="40px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1C1C1C] truncate">{product.name}</p>
                    <p className="text-xs text-[#999999]">{product.unit}</p>
                  </div>
                  <p className="text-sm font-bold text-[#1C1C1C]">₹{product.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
