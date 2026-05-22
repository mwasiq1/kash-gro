"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import ProductCard from "./ProductCard";
import TopNav from "../home/TopNav";

interface Product {
  id: string;
  name: string;
  description: string;
  mrp: number;
  price: number;
  unit: string;
  images?: string[];
  imageUrl?: string;
  categoryId: string;
  category?: { name: string };
}

interface CategoryClientProps {
  categoryName: string;
  products: Product[];
}

export default function CategoryClient({ categoryName, products }: CategoryClientProps) {
  const [sortBy, setSortBy] = useState<string>("");

  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sortBy === "low-to-high") {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "high-to-low") {
      return list.sort((a, b) => b.price - a.price);
    }
    return list;
  }, [products, sortBy]);

  return (
    <div className="min-h-screen bg-[#F4F6FA]">
      <TopNav />

      {/* Category header strip with Back button and Sort */}
      <div className="bg-white border-b border-[#E8E8E8] py-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-5 h-5 text-[#1C1C1C]" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#1C1C1C]">{categoryName}</h1>
            <p className="text-xs text-[#999999] font-medium">{products.length} products</p>
          </div>
        </div>

        {/* Sort Select Dropdown */}
        {products.length > 0 && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-[#E8E8E8] text-xs font-bold rounded-xl px-3 min-h-[38px] text-[#1C1C1C] focus:ring-1 focus:ring-[#F8C200] outline-none cursor-pointer"
          >
            <option value="">Sort By</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
          </select>
        )}
      </div>

      <main className="pb-24 px-4 pt-5">
        {sortedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-[#999999] gap-3">
            <Package className="w-16 h-16 text-gray-200" />
            <p className="font-semibold text-[#1C1C1C]">No products in this category</p>
            <p className="text-xs text-center text-gray-400">Please check back later or view other categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
