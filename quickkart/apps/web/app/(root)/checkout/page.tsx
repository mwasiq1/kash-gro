"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../../hooks/useCart";
import { MapPin, Receipt, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
const DELIVERY_FEE = 25;

export default function CheckoutPage() {
  const router = useRouter();
  const { isMounted, items, cartTotal, clearCart, itemCount } = useCart();

  const [address, setAddress] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Return null or skeleton if not mounted (Hydration fix via useCart)
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#F4F6FA] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0C831F]" />
      </div>
    );
  }

  // Redirect to home if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F4F6FA] flex flex-col items-center justify-center p-6 text-center">
        <Receipt className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-[#1C1C1C] mb-2">Cart is empty</h2>
        <p className="text-sm text-gray-500 mb-6">Add items to proceed to checkout.</p>
        <button
          onClick={() => router.push("/")}
          className="bg-[#0C831F] text-white px-6 py-3 rounded-xl font-bold active:scale-95 transition"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  const grandTotal = cartTotal + DELIVERY_FEE;

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      setError("Please provide a delivery address");
      return;
    }

    try {
      setIsPlacingOrder(true);
      setError(null);

      // Format payload
      const orderPayload = {
        address: address.trim(),
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      const res = await fetch(`${API}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer placeholder-token`,
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      // Success
      clearCart();
      router.push(`/orders?success=${data.orderId}`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] pb-28">
      {/* Header */}
      <header className="bg-white sticky top-0 z-40 shadow-sm px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1 -ml-1 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft className="w-6 h-6 text-[#1C1C1C]" />
        </button>
        <h1 className="text-lg font-extrabold text-[#1C1C1C]">Checkout</h1>
      </header>

      <main className="p-4 space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        {/* Address Section */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-[#0C831F]" />
            <h2 className="font-bold text-[#1C1C1C]">Delivery Address</h2>
          </div>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your complete delivery address (House No., Street, Landmark)"
            className="w-full bg-[#F4F6FA] rounded-xl p-3 text-sm text-[#1C1C1C] outline-none border border-transparent focus:border-[#0C831F] transition resize-none h-24"
          />
        </section>

        {/* Cart Review */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <h2 className="font-bold text-[#1C1C1C] mb-3">Items ({itemCount})</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F4F6FA] rounded-lg p-1 flex-shrink-0">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1C1C1C] line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-[#1C1C1C]">₹{(item.sellingPrice * item.quantity).toFixed(0)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Order Summary */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <div className="flex items-center gap-2 mb-3">
            <Receipt className="w-5 h-5 text-[#1C1C1C]" />
            <h2 className="font-bold text-[#1C1C1C]">Bill Details</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Items total</span>
              <span className="font-semibold text-[#1C1C1C]">₹{cartTotal.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery fee</span>
              <span className="font-semibold text-[#1C1C1C]">₹{DELIVERY_FEE.toFixed(0)}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between">
              <span className="font-extrabold text-[#1C1C1C]">Grand Total</span>
              <span className="font-extrabold text-[#1C1C1C] text-lg">₹{grandTotal.toFixed(0)}</span>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-50">
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          className="w-full max-w-lg mx-auto bg-[#0C831F] text-white flex items-center justify-between px-5 py-4 rounded-xl font-bold text-base active:scale-[0.98] transition disabled:opacity-70"
        >
          <span>₹{grandTotal.toFixed(0)}</span>
          <div className="flex items-center gap-2">
            {isPlacingOrder ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Place Order <ArrowRight className="w-5 h-5" />
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
