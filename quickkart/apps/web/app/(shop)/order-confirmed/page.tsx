"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchApi } from "../../../lib/api";
import { useAuth } from "@clerk/nextjs";
import { CheckCircle2, Clock, MapPin, Package, Loader2, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

function OrderConfirmedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (orderId) {
      const loadOrder = async () => {
        try {
          const token = await getToken();
          const response = await fetchApi(`/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.success) {
            setOrder(response.data);
          }
        } catch (err) {
          console.error("Failed to load order", err);
        } finally {
          setLoading(false);
        }
      };
      loadOrder();
    }
  }, [orderId, isLoaded, isSignedIn, getToken, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="w-10 h-10 text-[#0C831F] animate-spin" />
        <p className="text-[#1C1C1C] font-bold">Fetching order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F6FA] p-6 text-center">
        <h1 className="text-2xl font-black text-[#1C1C1C] mb-2">Order Not Found</h1>
        <p className="text-[#666666] mb-8">We couldn&apos;t find the order you&apos;re looking for.</p>
        <Link href="/" className="bg-[#0C831F] text-white font-black px-8 py-4 rounded-2xl">
          Return Home
        </Link>
      </div>
    );
  }

  const subtotal = order.totalAmount;
  const deliveryFee = subtotal >= 200 ? 0 : 25;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-[#F4F6FA] pb-20">
      {/* Hero Success Section */}
      <div className="bg-white px-4 py-12 text-center border-b border-gray-100">
        <div className="max-w-xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#EBF9EE] rounded-full mb-6 animate-in zoom-in duration-500">
            <CheckCircle2 className="w-12 h-12 text-[#0C831F]" />
          </div>
          <h1 className="text-3xl font-black text-[#0C831F] mb-2">Order placed!</h1>
          <p className="text-gray-500 font-bold mb-4">Thank you for shopping with KashGro</p>
          
          <div className="inline-block bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 text-center">Order Number</p>
            <p className="font-mono font-black text-[#1C1C1C] text-lg">{order.orderNumber}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-4 space-y-4">
        {/* Delivery Time Banner */}
        <div className="bg-[#0C831F] text-white p-4 rounded-2xl shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest opacity-80">Estimated Delivery</p>
              <p className="text-xl font-black">20-30 minutes</p>
            </div>
          </div>
          <div className="text-right">
             <p className="text-[10px] uppercase font-black tracking-widest opacity-80">Payment</p>
             <p className="text-sm font-black">Cash on Delivery</p>
          </div>
        </div>

        {/* COD Notice Box */}
        <div className="bg-[#FFF9E0] border border-[#F8C200] p-4 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="text-2xl">🛵</span>
          </div>
          <p className="font-bold text-[#1C1C1C]">
            Pay <span className="text-xl font-black">₹{total}</span> when your order arrives
          </p>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-[#0C831F]" />
            <h3 className="font-black text-[#1C1C1C]">Delivery Address</h3>
          </div>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            {order.deliveryAddress}
          </p>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-400" />
              <h3 className="font-black text-[#1C1C1C]">Items ({order.items.length})</h3>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {order.items.map((item: any) => (
              <div key={item.id} className="p-4 flex gap-4">
                <div className="relative w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex-shrink-0">
                  <Image 
                    src={item.product.images?.[0] || "https://placehold.co/100x100/F4F6FA/1C1C1C?text=Product"} 
                    alt={item.product.name} 
                    fill 
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-[#1C1C1C] line-clamp-1">{item.product.name}</p>
                  <p className="text-xs text-gray-500 font-bold">{item.product.unit} × {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-[#1C1C1C]">₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Price Breakdown */}
          <div className="p-6 bg-gray-50/30 border-t border-gray-50 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-bold">Subtotal</span>
              <span className="text-[#1C1C1C] font-black">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-bold">Delivery Fee</span>
              <span className="text-[#1C1C1C] font-black">{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <span className="text-[#1C1C1C] font-black text-lg">Total Amount</span>
              <span className="text-[#1C1C1C] font-black text-lg">₹{total}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <Link 
            href={`/orders/${order.id}`}
            className="bg-[#F8C200] text-[#1C1C1C] font-black py-4 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Track Order
            <ChevronRight className="w-5 h-5" />
          </Link>
          <Link 
            href="/"
            className="bg-white text-[#1C1C1C] border-2 border-gray-100 font-black py-4 rounded-2xl text-center hover:bg-gray-50 transition-all active:scale-95"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="w-10 h-10 text-[#0C831F] animate-spin" />
        <p className="text-[#1C1C1C] font-bold">Loading confirmation...</p>
      </div>
    }>
      <OrderConfirmedContent />
    </Suspense>
  );
}
