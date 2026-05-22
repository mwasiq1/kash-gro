"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../../hooks/useCart";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import api from "../../../lib/api";
import { useAuth } from "../../../hooks/useAuth";
import AddressSelector from "../../../components/checkout/AddressSelector";
import OrderSummary from "../../../components/checkout/OrderSummary";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { isMounted, items, cartTotal, clearCart, itemCount, promoCode } = useCart();
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?redirect_url=/checkout");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isMounted && itemCount === 0 && !isPlacingOrder) {
      router.push("/");
    }
  }, [isMounted, itemCount, router, isPlacingOrder]);

  if (!isMounted || !isLoaded || !isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-[#0C831F] animate-spin" />
        <p className="text-[#666666] font-bold">Securing your checkout...</p>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError("Please select a delivery address");
      return;
    }

    setIsPlacingOrder(true);
    setError(null);

    try {
      const token = await getToken();
      
      let deliveryFee = 0;
      if (cartTotal > 0 && cartTotal < 99) deliveryFee = 40;
      else if (cartTotal > 0 && cartTotal < 199) deliveryFee = 25;

      const discountAmount = promoCode ? promoCode.discount : 0;
      const grandTotal = Math.max(0, cartTotal + deliveryFee - discountAmount);

      const orderData = {
        addressId: selectedAddressId,
        items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
        subtotal: cartTotal,
        deliveryFee,
        discount: discountAmount,
        total: grandTotal,
        totalAmount: grandTotal, // Keep totalAmount for backward compatibility with the backend
        promoCode: promoCode ? promoCode.code : undefined,
      };

      const response = await api.post("/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data?.success) {
        const order = response.data.data;
        clearCart();
        router.push(`/order-confirmed?id=${order.id}`);
        // Do not reset isPlacingOrder here to prevent the empty cart useEffect from redirecting to "/"
      } else {
        throw new Error(response.data?.message || response.data?.error || "Failed to place order");
      }
    } catch (err: any) {
      console.error('Order failed:', err);
      const message = err?.response?.data?.error || err.message || 'Failed to place order. Please try again.';
      setError(message);
      // Ensure we re-enable the button if it failed
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 border-b border-[#E8E8E8] px-4 py-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-50 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-[#1C1C1C]" />
          </Link>
          <h1 className="text-xl font-black text-[#1C1C1C]">Checkout</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 md:px-8">
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6">
          {/* Left Column: Address Selection */}
          <div className="md:col-span-7 space-y-6">
            <AddressSelector 
              selectedId={selectedAddressId} 
              onSelect={(id) => {
                setSelectedAddressId(id);
                setError(null);
              }} 
            />
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="md:col-span-5 space-y-6">
            <OrderSummary />
            
            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-600 text-sm font-bold animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || !selectedAddressId || items.length === 0}
              className="w-full bg-[#F8C200] text-[#1C1C1C] font-black py-5 rounded-2xl text-xl shadow-lg hover:bg-[#e6b400] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 group"
            >
              {isPlacingOrder ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Place Order
                  <CheckCircle2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
            <p className="text-[10px] text-[#999999] text-center font-medium uppercase tracking-widest">
              By placing this order, you agree to our Terms & Conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
