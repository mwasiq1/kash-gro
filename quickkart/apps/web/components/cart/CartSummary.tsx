"use client";

import { useCart } from "../../hooks/useCart";

export default function CartSummary() {
  const { cartTotal, promoCode } = useCart();
  
  const subtotal = cartTotal;
  
  // Delivery Fee Logic
  let deliveryFee = 0;
  if (subtotal < 99) {
    deliveryFee = 40;
  } else if (subtotal < 199) {
    deliveryFee = 25;
  }

  const discount = promoCode ? promoCode.discount : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

  // Free delivery progress logic
  const remainingForFreeDelivery = 199 - subtotal;
  const progressPercent = Math.min(100, Math.max(0, (subtotal / 199) * 100));

  return (
    <div className="flex flex-col gap-4">
      {/* Free Delivery Progress */}
      {subtotal > 0 && remainingForFreeDelivery > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E8E8E8]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-[#1C1C1C]">
              Add ₹{remainingForFreeDelivery} more for FREE delivery
            </span>
            <span className="text-xs font-bold text-[#999999]">₹199</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-[#F8C200] h-full rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
        </div>
      )}

      {/* Bill Details */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E8E8E8] flex flex-col gap-3">
        <h3 className="font-bold text-[#1C1C1C] text-sm mb-1">Bill Details</h3>
        
        <div className="flex justify-between text-sm text-[#666666]">
          <span>Item Total</span>
          <span className="font-medium text-[#1C1C1C]">₹{subtotal}</span>
        </div>

        <div className="flex justify-between text-sm text-[#666666]">
          <span>Delivery Fee</span>
          <span className="font-medium text-[#1C1C1C]">
            {deliveryFee === 0 ? (
              <span className="text-[#0C831F] font-bold">FREE</span>
            ) : (
              `₹${deliveryFee}`
            )}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm text-[#0C831F] font-medium">
            <span>Promo Discount</span>
            <span>-₹{discount}</span>
          </div>
        )}

        <div className="border-t border-[#E8E8E8] pt-3 mt-1 flex justify-between font-bold text-base text-[#1C1C1C]">
          <span>Grand Total</span>
          <span>₹{grandTotal}</span>
        </div>
      </div>
    </div>
  );
}
