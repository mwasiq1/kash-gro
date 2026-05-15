"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "../../lib/api";
import ProductCard from "./ProductCard";
import { Product } from "../../types";

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
}

export default function RelatedProducts({
  categoryId,
  currentProductId,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRelated() {
      try {
        setLoading(true);
        const { data } = await fetchApi(`/products?categoryId=${categoryId}&limit=10`);
        const filtered = (data || [])
          .filter((p: Product) => p.id !== currentProductId)
          .slice(0, 6);
        setProducts(filtered);
      } catch (err) {
        console.error("Error loading related products:", err);
      } finally {
        setLoading(false);
      }
    }

    if (categoryId) loadRelated();
  }, [categoryId, currentProductId]);

  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-lg font-bold text-[#1C1C1C] mb-4 px-4 md:px-0">
          Related Products
        </h2>
        <div className="flex gap-3 overflow-x-auto px-4 md:px-0 pb-4 scrollbar-hide">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-40 flex-shrink-0 aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold text-[#1C1C1C] mb-4 px-4 md:px-0">
        Related Products
      </h2>
      <div className="flex gap-3 overflow-x-auto px-4 md:px-0 pb-4 scrollbar-hide snap-x">
        {products.map((p) => (
          <div key={p.id} className="w-40 flex-shrink-0 snap-start">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
