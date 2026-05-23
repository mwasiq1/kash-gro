"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Loader2, Package } from "lucide-react";
import { fetchApi } from "../../../lib/api";
import ProductCard from "../../../components/product/ProductCard";
import TopNav from "../../../components/home/TopNav";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const popularSuggestions = ["Milk", "Bread", "Eggs", "Chips", "Coke", "Biscuit"];

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const loadResults = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetchApi(`/products?search=${encodeURIComponent(query)}`);
        if (response.success || response.data) {
          setResults(response.data || []);
        } else {
          setResults([]);
        }
      } catch (err: any) {
        console.error("Error searching:", err);
        setError("Failed to fetch search results");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSuggestionClick = (suggestion: string) => {
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA]">
      <TopNav />

      <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {query.trim().length < 2 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-[#F8C200]/10 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-[#F8C200]" />
            </div>
            <h2 className="text-lg font-extrabold text-[#1C1C1C] mb-2">Search for groceries</h2>
            <p className="text-sm text-[#666666] max-w-xs mb-6">
              Type at least 2 characters to search for fresh vegetables, milk, bread, snacks, and more.
            </p>

            <div className="w-full max-w-md">
              <p className="text-xs font-bold text-[#666666] uppercase tracking-wider mb-3 text-left">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="bg-white border border-[#E8E8E8] hover:border-[#F8C200] text-sm font-semibold text-[#1C1C1C] px-4 py-2 rounded-full transition active:scale-95 shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[#1C1C1C]">
                Search results for &ldquo;{query}&rdquo;
              </h2>
              {!loading && (
                <span className="text-xs text-[#999999] font-medium">
                  {results.length} {results.length === 1 ? "product" : "products"} found
                </span>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-[#666666] gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-[#F8C200]" />
                <p className="text-sm font-semibold">Searching for products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-500 font-bold">{error}</div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-[#666666] gap-3 text-center">
                <Package className="w-14 h-14 text-gray-200" />
                <p className="font-bold text-[#1C1C1C]">No items match your search</p>
                <p className="text-xs max-w-xs text-[#999999]">
                  We couldn&apos;t find any products matching &ldquo;{query}&rdquo;. Check spelling or try a different search.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F4F6FA] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#F8C200]" />
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
