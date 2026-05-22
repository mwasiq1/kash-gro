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

  const imageSrc = product.imageUrl || "";

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
      className="bg-white rounded-2xl p-3 flex flex-col shadow-sm hover:shadow-md transition-all border border-[#E8E8E8] h-full"
    >
      <div className="relative bg-gray-50 rounded-t-2xl aspect-square mb-3 overflow-hidden">
        {!imgError && imageSrc ? (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
            onError={(e) => {
              e.currentTarget.src = "";
              e.currentTarget.onerror = null;
              setImgError(true);
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <ShoppingBag className="w-8 h-8 text-[#666666]" size={32} />
          </div>
        )}

        {discount > 0 && (
          <span className="absolute top-2 left-2 z-10 bg-[#F8C200] text-[#1C1C1C] text-[10px] font-bold px-2 py-0.5 rounded-full">
            {discount}% OFF
          </span>
        )}
      </div>

      <h3 className="text-sm font-semibold text-[#1C1C1C] leading-snug line-clamp-2 mb-1">
        {product.name}
      </h3>
      <span className="text-xs text-[#666666] font-medium mb-2">
        {product.unit}
      </span>

      <div className="flex items-center justify-between mt-auto pt-2 gap-1">
        <div>
          <p className="text-sm font-bold text-[#1C1C1C]">₹{product.price}</p>
          {discount > 0 && (
            <p className="text-[11px] text-[#666666] line-through">₹{product.mrp}</p>
          )}
        </div>

        <div>
          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="flex items-center justify-center gap-1 bg-[#F8C200] text-[#1C1C1C] font-bold text-sm px-3 rounded-full min-h-[44px] min-w-[44px] hover:bg-[#E6B400] transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              ADD
            </button>
          ) : (
            <div className="flex items-center bg-[#F8C200] rounded-full overflow-hidden min-h-[44px]">
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
      </div>
    </Link>
  );
}
