"use client";

import HeroCarousel from "./HeroCarousel";
import CategoryBar from "./CategoryBar";
import ProductCard from "../product/ProductCard";
import TopNav from "./TopNav";
import { Package } from "lucide-react";

interface Category {
  id: string;
  name: string;
  _count?: { products: number };
}

interface Product {
  id: string;
  name: string;
  description: string;
  mrp: number;
  price: number;
  unit: string;
  images: string[];
  categoryId: string;
  category?: { name: string };
}

interface HomeClientProps {
  categories: Category[];
  allProducts: Product[];
}

export default function HomeClient({ categories, allProducts }: HomeClientProps) {
  const categoryLabel = "All Products";

  return (
    <div className="min-h-screen bg-[#F4F6FA]">
      <TopNav />

      <main className="pb-24">
        <HeroCarousel />
        <CategoryBar
          categories={categories}
          selected={null}
        />

        {/* Product Grid */}
        <section className="mt-5 px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-[#1C1C1C]">{categoryLabel}</h2>
            <span className="text-xs text-[#999999] font-medium">{allProducts.length} items</span>
          </div>

          {allProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#999999] gap-3">
              <Package className="w-14 h-14 text-gray-200" />
              <p className="font-semibold">No products found</p>
              <p className="text-xs text-center">Try selecting a different category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {allProducts.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
