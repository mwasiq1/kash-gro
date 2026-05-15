"use client";

import { Plus, Minus } from "lucide-react";
import Link from "next/link";
import { useCart } from "../../hooks/useCart";

interface Product {
  id: string;
  name: string;
  description: string;
  mrp: number;
  sellingPrice: number;
  unit: string;
  imageUrl: string;
  category?: { name: string };
}

export default function ProductCard({ product }: { product: Product }) {
  const { items, addItem, updateQuantity } = useCart();

  const cartItem = items.find((i) => i.id === product.id);
  const quantity = cartItem?.quantity ?? 0;
  const discount = Math.round(
    ((product.mrp - product.sellingPrice) / product.mrp) * 100
  );

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      sellingPrice: product.sellingPrice,
      unit: product.unit,
      imageUrl: product.imageUrl,
    });
  };

  const handleUpdateQuantity = (e: React.MouseEvent, newQuantity: number) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, newQuantity);
  };

  return (
    <Link href={`/product/${product.id}`} className="bg-white rounded-2xl p-3 flex flex-col shadow-sm hover:shadow-md transition-shadow border border-gray-50 h-full">
      {/* Image */}
      <div className="relative bg-[#F4F6FA] rounded-xl h-32 mb-3 flex items-center justify-center overflow-hidden">
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-[#0C831F] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md z-10">
            {discount}% OFF
          </span>
        )}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-24 h-24 object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/96x96/F4F6FA/1C1C1C?text=${encodeURIComponent(product.name.slice(0, 2))}`;
          }}
        />
      </div>

      {/* Meta */}
      <span className="text-[10px] text-gray-400 font-medium mb-0.5">{product.unit}</span>
      <h3 className="text-sm font-bold text-[#1C1C1C] leading-snug line-clamp-2 mb-2 flex-1">
        {product.name}
      </h3>

      {/* Price + CTA */}
      <div className="flex items-end justify-between mt-auto gap-1">
        <div>
          <p className="text-base font-extrabold text-[#1C1C1C]">₹{product.sellingPrice}</p>
          {discount > 0 && (
            <p className="text-[11px] text-gray-400 line-through">₹{product.mrp}</p>
          )}
        </div>

        {/* quantity=0 on server (isMounted=false) → always renders ADD first */}
        {quantity === 0 ? (
          <button
            onClick={handleAdd}
            className="flex items-center gap-1 bg-[#EBF9EE] border-2 border-[#0C831F] text-[#0C831F] font-bold text-sm px-3 py-1.5 rounded-xl hover:bg-[#0C831F] hover:text-white transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            ADD
          </button>
        ) : (
          <div className="flex items-center bg-[#0C831F] rounded-xl overflow-hidden">
            <button
              onClick={(e) => handleUpdateQuantity(e, quantity - 1)}
              className="px-2 py-1.5 text-white hover:bg-[#0a6b19] transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-white font-bold text-sm w-6 text-center">{quantity}</span>
            <button
              onClick={handleAdd}
              className="px-2 py-1.5 text-white hover:bg-[#0a6b19] transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}
