"use client";

import Link from "next/link";
import { ShoppingBasket, Milk, Apple, Cookie, Coffee, Zap, ShoppingBag } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug?: string | null;
  _count?: { products: number };
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Dairy & Breakfast":    <Milk className="w-6 h-6" />,
  "Fruits & Vegetables":  <Apple className="w-6 h-6" />,
  "Snacks & Munchies":    <Cookie className="w-6 h-6" />,
  "Cold Drinks & Juices": <Coffee className="w-6 h-6" />,
  "Instant Food":         <Zap className="w-6 h-6" />,
};

const DEFAULT_ICON = <ShoppingBag className="w-6 h-6" />;

interface CategoryBarProps {
  categories: Category[];
  selected?: string | null;
}

export default function CategoryBar({ categories, selected }: CategoryBarProps) {
  return (
    <div className="mt-5 px-4">
      <h2 className="text-base font-bold text-[#1C1C1C] mb-3">Shop by Category</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {/* All */}
        <Link
          href="/"
          className="flex flex-col items-center gap-1.5 min-w-[64px] group"
        >
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              selected === null || selected === undefined
                ? "bg-[#F8C200] scale-105"
                : "bg-white border border-[#E8E8E8] group-hover:bg-gray-50"
            }`}
          >
            <ShoppingBasket className={`w-6 h-6 ${selected === null || selected === undefined ? "text-white" : "text-[#666666]"}`} />
          </div>
          <span className={`text-[11px] font-semibold text-center leading-tight ${selected === null || selected === undefined ? "text-[#1C1C1C]" : "text-[#666666]"}`}>
            All
          </span>
        </Link>

        {categories.map((cat) => {
          const icon = CATEGORY_ICONS[cat.name] ?? DEFAULT_ICON;
          const isSelected = selected === cat.id || selected === cat.slug;
          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug || cat.id}`}
              className="flex flex-col items-center gap-1.5 min-w-[64px] group"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-[#F8C200] scale-105"
                    : "bg-white border border-[#E8E8E8] group-hover:bg-gray-50"
                }`}
              >
                <span className={isSelected ? "text-white" : "text-[#666666]"}>{icon}</span>
              </div>
              <span
                className={`text-[11px] font-semibold text-center leading-tight w-16 ${
                  isSelected ? "text-[#1C1C1C]" : "text-[#666666]"
                }`}
              >
                {cat.name.split(" & ")[0]}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
