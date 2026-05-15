"use client";

import React from "react";
import { useCartStore } from "../../stores/cart.store";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { items, addItem, updateQuantity } = useCartStore();
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Button Clicked!', product);
    if (product.stock > 0) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        image: product.images[0] || "",
      });
    }
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    if (quantity > 0) {
      updateQuantity(product.id, quantity - 1);
    }
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    if (quantity < product.stock) {
      updateQuantity(product.id, quantity + 1);
    }
  };

  if (product.stock === 0) {
    return (
      <button
        disabled
        className="w-full py-4 rounded-2xl bg-gray-100 text-gray-400 font-bold text-base cursor-not-allowed border border-gray-200"
      >
        Out of Stock
      </button>
    );
  }

  if (quantity === 0) {
    return (
      <button
        onClick={handleAdd}
        className="w-full py-4 rounded-2xl bg-[#F8C200] text-black font-black text-base hover:bg-[#e6b400] transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
      >
        <ShoppingCart size={20} />
        ADD TO CART
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between bg-white border-2 border-[#F8C200] rounded-2xl overflow-hidden shadow-sm h-[60px]">
      <button
        onClick={handleDecrease}
        className="w-16 h-full flex items-center justify-center text-[#F8C200] hover:bg-yellow-50 transition-colors"
      >
        <Minus className="w-5 h-5 stroke-[3]" />
      </button>
      
      <span className="font-black text-[#1C1C1C] text-xl">
        {quantity}
      </span>
      
      <button
        onClick={handleIncrease}
        disabled={quantity >= product.stock}
        className={`w-16 h-full flex items-center justify-center text-[#F8C200] hover:bg-yellow-50 transition-colors ${
          quantity >= product.stock ? "opacity-30 cursor-not-allowed" : ""
        }`}
      >
        <Plus className="w-5 h-5 stroke-[3]" />
      </button>
    </div>
  );
}
