"use client";

import { useCart } from "../../hooks/useCart";
import { Minus, Plus, Loader2 } from "lucide-react";

interface QuantityStepperProps {
  product: {
    id: string;
    name: string;
    price: number;
    unit: string;
    imageUrl?: string;
    stock: number;
  };
}

export default function QuantityStepper({ product }: QuantityStepperProps) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    if (product.stock > 0) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        image: product.imageUrl || "",
      });
    }
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      updateQuantity(product.id, quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < product.stock) {
      updateQuantity(product.id, quantity + 1);
    }
  };

  if (product.stock === 0) {
    return (
      <button
        disabled
        className="w-full py-3.5 rounded-xl bg-gray-100 text-[#999999] font-bold text-base cursor-not-allowed border border-[#E8E8E8]"
      >
        Out of Stock
      </button>
    );
  }

  if (quantity === 0) {
    return (
      <button
        onClick={handleAdd}
        className="w-full py-3.5 rounded-xl bg-[#F8C200] text-[#1C1C1C] font-bold text-base hover:bg-[#e6b400] transition-all active:scale-[0.98] shadow-sm"
      >
        ADD
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between bg-white border-2 border-[#F8C200] rounded-xl overflow-hidden shadow-sm">
      <button
        onClick={handleDecrease}
        className="p-3.5 text-[#F8C200] hover:bg-yellow-50 transition-colors"
      >
        <Minus className="w-5 h-5 stroke-[3]" />
      </button>
      
      <span className="font-extrabold text-[#1C1C1C] text-lg w-8 text-center">
        {quantity}
      </span>
      
      <button
        onClick={handleIncrease}
        disabled={quantity >= product.stock}
        className={`p-3.5 text-[#F8C200] hover:bg-yellow-50 transition-colors ${
          quantity >= product.stock ? "opacity-30 cursor-not-allowed" : ""
        }`}
      >
        <Plus className="w-5 h-5 stroke-[3]" />
      </button>
    </div>
  );
}
