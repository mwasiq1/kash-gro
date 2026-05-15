"use client";

import React from "react";
import Image from "next/image";

interface TopProductsProps {
  products: {
    id: string;
    name: string;
    imageUrl?: string;
    unit?: string;
    unitsSold: number;
    revenue: number;
  }[];
}

export default function TopProducts({ products }: TopProductsProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full">
      <h3 className="text-lg font-black text-[#1C1C1C] mb-1">Top Selling Products</h3>
      <p className="text-xs text-gray-400 font-medium mb-6">Best performers by volume and revenue</p>

      <div className="space-y-4">
        {products.length === 0 ? (
          <div className="py-10 text-center text-gray-400 text-sm font-medium">
            No sales data available yet.
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
              <div className="w-12 h-12 relative bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                <Image
                  src={product.imageUrl || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as any).src = "https://placehold.co/48x48?text=P";
                  }}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#1C1C1C] truncate">{product.name}</p>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{product.unit}</p>
              </div>

              <div className="text-right">
                <p className="text-sm font-black text-[#1C1C1C]">₹{product.revenue.toLocaleString()}</p>
                <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">{product.unitsSold} Sold</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
