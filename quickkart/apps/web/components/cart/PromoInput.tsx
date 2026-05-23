"use client";

import { useState } from "react";
import { useCart } from "../../hooks/useCart";
import { fetchApi } from "../../lib/api";
import { Tag, Loader2, X } from "lucide-react";

export default function PromoInput() {
  const { cartTotal, promoCode, applyPromo, removePromo } = useCart();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async () => {
    if (!code.trim()) return;
    
    setLoading(true);
    setError("");

    try {
      const response = await fetchApi("/promo/validate", {
        method: "POST",
        body: JSON.stringify({
          code: code.trim(),
          subtotal: cartTotal,
        }),
      });

      if (response.success) {
        applyPromo(response.data);
        setCode("");
      } else {
        setError(response.message || "Invalid promo code");
      }
    } catch (err: any) {
      setError(err.message || "Failed to apply promo code");
    } finally {
      setLoading(false);
    }
  };

  if (promoCode) {
    return (
      <div className="bg-[#EBF9EE] border border-[#0C831F] rounded-xl p-3 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#0C831F]" />
            <span className="font-bold text-[#0C831F]">{promoCode.code} applied</span>
          </div>
          <button
            onClick={removePromo}
            className="text-[#666666] hover:text-red-500 transition p-1"
            title="Remove Promo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <span className="text-sm text-[#0C831F] font-medium ml-6">
          ₹{promoCode.discount} savings
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Tag className="w-4 h-4 text-[#999999]" />
          </div>
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError("");
            }}
            placeholder="Enter promo code"
            className="w-full pl-9 pr-3 py-3 rounded-xl border border-[#E8E8E8] focus:outline-none focus:border-[#0C831F] focus:ring-1 focus:ring-[#0C831F] text-sm font-bold uppercase transition"
          />
        </div>
        <button
          onClick={handleApply}
          disabled={!code.trim() || loading}
          className="bg-[#1C1C1C] text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-black transition disabled:opacity-50 min-w-[80px] flex justify-center"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs font-bold px-1">{error}</p>}
    </div>
  );
}
