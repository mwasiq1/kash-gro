"use client";

import { Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "../../hooks/useCart";

interface Product {
  id: string;
  name: string;
  description: string;
  mrp: number;
  price: number;
  unit: string;
  images?: string[];
  imageUrl?: string;
  category?: { name: string };
}

export default function ProductCard({ product }: { product: Product }) {
  const { items, addItem, updateQuantity } = useCart();
  const [imgError, setImgError] = useState(false);

  const cartItem = items.find((i) => i.id === product.id);
  const quantity = cartItem?.quantity ?? 0;
  const discount = Math.round(
    ((product.mrp - product.price) / product.mrp) * 100
  );

  // Support both imageUrl (flat) and images[] (array) from API
  const imageSrc = product.imageUrl || product.images?.[0] || "";

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: imageSrc,
    });
  };

  const handleUpdateQuantity = (e: React.MouseEvent, newQuantity: number) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, newQuantity);
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="bg-white rounded-2xl p-3 flex flex-col shadow-sm hover:shadow-md transition-shadow border border-[#E8E8E8] h-full"
    >
      {/* FIX 4: Image area with badge INSIDE (relative container) */}
      <div className="relative bg-[#F4F6FA] rounded-xl aspect-square mb-3 overflow-hidden">
        {/* FIX 2: Image with error fallback */}
        {!imgError && imageSrc ? (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <ShoppingBag className="w-8 h-8 text-gray-300" />
          </div>
        )}

        {/* FIX 4: Badge absolutely positioned inside image container */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 z-10 bg-[#F8C200] text-[#1C1C1C] text-[10px] font-bold px-2 py-0.5 rounded-full">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* FIX 3: Product name appears ONCE only — below image */}
      <span className="text-[10px] text-[#999999] font-medium mb-0.5">
        {product.unit}
      </span>
      <h3 className="text-sm font-bold text-[#1C1C1C] leading-snug line-clamp-2 mb-2 flex-1">
        {product.name}
      </h3>

      {/* Price + CTA */}
      <div className="flex items-end justify-between mt-auto gap-1">
        <div>
          <p className="text-base font-bold text-[#1C1C1C]">₹{product.price}</p>
          {discount > 0 && (
            <p className="text-[11px] text-[#999999] line-through">₹{product.mrp}</p>
          )}
        </div>

        {/* FIX 1: ADD button uses #F8C200 yellow with #1C1C1C text */}
        {quantity === 0 ? (
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-1 bg-[#F8C200] border-2 border-[#F8C200] text-[#1C1C1C] font-bold text-sm px-3 min-h-[44px] min-w-[44px] rounded-xl hover:bg-[#E6B400] hover:border-[#E6B400] transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            ADD
          </button>
        ) : (
          /* FIX 1: Stepper uses #F8C200 yellow with #1C1C1C text */
          <div className="flex items-center bg-[#F8C200] rounded-xl overflow-hidden">
            <button
              onClick={(e) => handleUpdateQuantity(e, quantity - 1)}
              className="px-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#1C1C1C] hover:bg-[#E6B400] transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-[#1C1C1C] font-bold text-sm w-6 text-center">
              {quantity}
            </span>
            <button
              onClick={handleAdd}
              className="px-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#1C1C1C] hover:bg-[#E6B400] transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}
