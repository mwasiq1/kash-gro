"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
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
  const { updateQuantity, removeItem } = useCart();
  const [imgError, setImgError] = useState(false);

  const fallbackImage = !item.image || imgError;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-[#E8E8E8] last:border-0">
      <div className="relative w-16 h-16 bg-[#F4F6FA] rounded-xl overflow-hidden flex-shrink-0 border border-[#E8E8E8] flex items-center justify-center">
        {fallbackImage ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <ShoppingBag className="w-5 h-5 text-[#999999]" />
          </div>
        ) : (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-contain p-1"
            onError={() => setImgError(true)}
            sizes="64px"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-[#1C1C1C] line-clamp-2 leading-snug">
          {item.name}
        </h4>
        <p className="text-xs text-[#666666] mt-0.5">{item.unit}</p>
        <p className="text-sm font-black text-[#1C1C1C] mt-1">
          ₹{item.price}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center bg-[#F8C200] rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="px-2 py-1.5 text-[#1C1C1C] hover:bg-[#E6B400] transition-colors"
          >
            <Minus className="w-4 h-4 stroke-[3]" />
          </button>
          <span className="text-[#1C1C1C] font-bold text-sm w-6 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="px-2 py-1.5 text-[#1C1C1C] hover:bg-[#E6B400] transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        <button
          onClick={() => removeItem(item.id)}
          className="p-3 text-gray-400 hover:text-[#D0190A] transition-colors rounded-xl flex items-center justify-center min-w-[44px] min-h-[44px]"
          aria-label="Remove item"
        >
          <Trash2 className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  );
}
