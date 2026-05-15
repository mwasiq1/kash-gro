"use client";

import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useCart } from "../../hooks/useCart";

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    unit: string;
    image: string;
    quantity: number;
  };
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity } = useCart();

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="relative w-16 h-16 bg-[#F4F6FA] rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-contain p-1"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-[#1C1C1C] line-clamp-2 leading-snug">
          {item.name}
        </h4>
        <p className="text-xs text-gray-500 mt-0.5">{item.unit}</p>
        <p className="text-sm font-black text-[#1C1C1C] mt-1">
          ₹{item.price}
        </p>
      </div>

      <div className="flex items-center bg-[#0C831F] rounded-xl overflow-hidden shadow-sm flex-shrink-0">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="px-2 py-1.5 text-white hover:bg-[#0a6b19] transition-colors"
        >
          <Minus className="w-4 h-4 stroke-[3]" />
        </button>
        <span className="text-white font-bold text-sm w-6 text-center">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="px-2 py-1.5 text-white hover:bg-[#0a6b19] transition-colors"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
}
