"use client";

import { useCart } from "../../hooks/useCart";
import CODConfirm from "./CODConfirm";

export default function OrderSummary() {
  const { items, cartTotal, promoCode } = useCart();
  
  const subtotal = cartTotal;
  const deliveryFee = subtotal >= 200 ? 0 : 25;

  const discount = promoCode ? promoCode.discount : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-5 py-4 border-b border-gray-100">
          <h3 className="font-black text-[#1C1C1C]">Order Summary</h3>
        </div>
        
        <div className="p-5 space-y-4">
          <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center border border-gray-100">
                  <img src={item.imageUrl} alt={item.name} className="w-8 h-8 object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1C1C1C] truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.quantity} × ₹{item.sellingPrice}</p>
                </div>
                <p className="text-sm font-black text-[#1C1C1C]">₹{item.quantity * item.sellingPrice}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span className="font-medium">Item Total</span>
              <span className="font-bold text-[#1C1C1C]">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span className="font-medium">Delivery Fee</span>
              <span className={`font-bold ${deliveryFee === 0 ? "text-[#0C831F]" : "text-[#1C1C1C]"}`}>
                {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-[#0C831F]">
                <span className="font-medium">Promo Discount ({promoCode?.code})</span>
                <span className="font-bold">-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between text-lg pt-2">
              <span className="font-black text-[#1C1C1C]">Total Amount</span>
              <span className="font-black text-[#1C1C1C]">₹{grandTotal}</span>
            </div>
          </div>
        </div>
      </div>

      <CODConfirm total={grandTotal} />
    </div>
  );
}
