"use client";

import { ShoppingBasket, Milk, Apple, Cookie, Coffee, Zap, ShoppingBag } from "lucide-react";

interface Category {
  id: string;
  name: string;
  _count?: { products: number };
}

const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  "Dairy & Breakfast":    { icon: <Milk className="w-6 h-6" />,          color: "text-blue-600",   bg: "bg-blue-50" },
  "Fruits & Vegetables":  { icon: <Apple className="w-6 h-6" />,          color: "text-green-600",  bg: "bg-green-50" },
  "Snacks & Munchies":    { icon: <Cookie className="w-6 h-6" />,         color: "text-orange-500", bg: "bg-orange-50" },
  "Cold Drinks & Juices": { icon: <Coffee className="w-6 h-6" />,         color: "text-purple-600", bg: "bg-purple-50" },
  "Instant Food":         { icon: <Zap className="w-6 h-6" />,            color: "text-red-500",    bg: "bg-red-50" },
};

const DEFAULT_CONFIG = { icon: <ShoppingBag className="w-6 h-6" />, color: "text-[#666666]", bg: "bg-gray-100" };

interface CategoryBarProps {
  categories: Category[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export default function CategoryBar({ categories, selected, onSelect }: CategoryBarProps) {
  return (
    <div className="mt-5 px-4">
      <h2 className="text-base font-bold text-[#1C1C1C] mb-3">Shop by Category</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {/* All */}
        <button
          onClick={() => onSelect(null)}
          className="flex flex-col items-center gap-1.5 min-w-[64px] group"
        >
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              selected === null
                ? "bg-[#F8C200] shadow-md scale-105"
                : "bg-gray-100 group-hover:bg-gray-200"
            }`}
          >
            <ShoppingBasket className={`w-6 h-6 ${selected === null ? "text-[#1C1C1C]" : "text-[#666666]"}`} />
          </div>
          <span className={`text-[11px] font-semibold text-center leading-tight ${selected === null ? "text-[#1C1C1C]" : "text-[#666666]"}`}>
            All
          </span>
        </button>

        {categories.map((cat) => {
          const config = CATEGORY_CONFIG[cat.name] ?? DEFAULT_CONFIG;
          const isSelected = selected === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(isSelected ? null : cat.id)}
              className="flex flex-col items-center gap-1.5 min-w-[64px] group"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-[#F8C200] shadow-md scale-105"
                    : `${config.bg} group-hover:opacity-80`
                }`}
              >
                <span className={isSelected ? "text-[#1C1C1C]" : config.color}>{config.icon}</span>
              </div>
              <span
                className={`text-[11px] font-semibold text-center leading-tight w-16 ${
                  isSelected ? "text-[#1C1C1C]" : "text-[#666666]"
                }`}
              >
                {cat.name.split(" & ")[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
