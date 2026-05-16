"use client";

import { useEffect, useState } from "react";
import { X, ShoppingBag, ChevronRight } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import CartItem from "./CartItem";
import PromoInput from "./PromoInput";
import CartSummary from "./CartSummary";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { isMounted, items, isOpen, closeCart, cartTotal, promoCode } = useCart();
  const router = useRouter();
  const [render, setRender] = useState(false);

  // Mount/Unmount handling for animation
  useEffect(() => {
    if (isOpen) setRender(true);
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) setRender(false);
  };

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isMounted || !render) return null;

  const subtotal = cartTotal;
  let deliveryFee = 0;
  if (subtotal > 0 && subtotal < 99) deliveryFee = 40;
  else if (subtotal > 0 && subtotal < 199) deliveryFee = 25;
  const discount = promoCode ? promoCode.discount : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:flex-row md:justify-end">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div 
        onTransitionEnd={handleAnimationEnd}
        className={`relative w-full h-[90vh] rounded-t-2xl md:h-full md:w-[420px] md:rounded-none bg-[#F4F6FA] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-y-0 md:translate-x-full"}`}
      >
        {/* Header */}
        <header className="bg-white rounded-t-2xl md:rounded-none px-4 py-4 border-b border-[#E8E8E8] flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <h2 className="font-extrabold text-[#1C1C1C] text-lg flex items-center gap-2">
            My Cart
            {items.length > 0 && (
              <span className="bg-[#1C1C1C] text-white text-xs px-2 py-0.5 rounded-full">
                {items.reduce((acc, i) => acc + i.quantity, 0)} items
              </span>
            )}
          </h2>
          <button 
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[#1C1C1C]" />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-[#1C1C1C] mb-2">Your cart is empty</h3>
              <p className="text-[#666666] text-sm mb-6 max-w-[250px]">
                Looks like you haven&apos;t added anything to your cart yet.
              </p>
              <button
                onClick={closeCart}
                className="bg-[#F8C200] text-[#1C1C1C] font-bold px-8 py-3.5 rounded-xl hover:bg-[#e6b400] transition active:scale-95 shadow-sm"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="p-4 flex flex-col gap-6">
              {/* Items List */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E8E8E8]">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              {/* Promo Section */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E8E8E8]">
                <h3 className="font-bold text-[#1C1C1C] text-sm mb-3">Offers & Benefits</h3>
                <PromoInput />
              </div>

              {/* Bill Details */}
              <CartSummary />
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {items.length > 0 && (
          <div className="bg-white p-4 border-t border-[#E8E8E8] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] sticky bottom-0 z-10">
            <button
              onClick={handleCheckout}
              className="w-full bg-[#F8C200] text-[#1C1C1C] font-bold text-lg px-6 py-4 rounded-xl hover:bg-[#e6b400] transition-all active:scale-[0.98] shadow-sm flex items-center justify-between"
            >
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold opacity-90">
                  {items.reduce((acc, i) => acc + i.quantity, 0)} items
                </span>
                <span className="text-xl">₹{grandTotal}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Proceed to Checkout</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
