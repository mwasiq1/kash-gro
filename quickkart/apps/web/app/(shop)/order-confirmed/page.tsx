"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchApi } from "../../../lib/api";
import { useAuth } from "@clerk/nextjs";
import { CheckCircle2, Clock, MapPin, Package, ShoppingBag, Loader2, ArrowRight } from "lucide-react";
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F6FA] gap-4">
        <Loader2 className="w-10 h-10 text-[#0C831F] animate-spin" />
        <p className="text-[#666666] font-bold">Verifying your order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F6FA] p-6 text-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h1 className="text-2xl font-black text-[#1C1C1C] mb-2">Order Not Found</h1>
        <p className="text-[#666666] mb-8 max-w-sm">We couldn&apos;t retrieve the details for this order. It might still be processing.</p>
        <Link href="/" className="bg-[#1C1C1C] text-white font-black px-8 py-4 rounded-2xl hover:bg-black transition-all">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA] pb-24">
      {/* Confetti-like Hero Section */}
      <div className="bg-white pt-16 pb-12 px-6 text-center border-b border-[#E8E8E8] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#0C831F]" />
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#EBF9EE] rounded-full mb-6 text-[#0C831F] animate-in zoom-in duration-500">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#1C1C1C] mb-3">Order Placed!</h1>
          <p className="text-[#666666] font-medium mb-1">Order ID: <span className="font-bold text-[#1C1C1C]">{order.orderNumber}</span></p>
          <div className="flex items-center justify-center gap-2 text-[#0C831F] font-black">
            <Clock className="w-5 h-5" />
            <span>Arriving in 20-30 mins</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Delivery Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E8E8]">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-[#0C831F]" />
            <h3 className="font-black text-[#1C1C1C]">Delivery to</h3>
          </div>
          <p className="text-sm text-[#666666] leading-relaxed pl-8">
            {order.deliveryAddress}
          </p>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E8E8] overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-[#E8E8E8] flex items-center gap-3">
            <Package className="w-5 h-5 text-[#999999]" />
            <h3 className="font-black text-[#1C1C1C]">Order Details</h3>
          </div>
          <div className="p-6 space-y-6">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-14 h-14 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center border border-[#E8E8E8] overflow-hidden">
                  <Image src={item.product.images[0] || "https://placehold.co/48x48/F4F6FA/1C1C1C?text=P"} alt={item.product.name} fill className="object-contain p-2" sizes="56px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1C1C1C] truncate">{item.product.name}</p>
                  <p className="text-xs text-[#666666] font-medium">{item.quantity} × {item.product.unit}</p>
                </div>
                <p className="text-sm font-black text-[#1C1C1C]">₹{item.price * item.quantity}</p>
              </div>
            ))}

            <div className="pt-6 border-t border-[#E8E8E8] flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-[#999999] uppercase tracking-widest">Total Paid via COD</p>
                <p className="text-2xl font-black text-[#1C1C1C]">₹{order.totalAmount}</p>
              </div>
              <Link 
                href="/" 
                className="bg-[#F8C200] text-[#1C1C1C] font-black px-6 py-3 rounded-xl hover:bg-[#E6B400] transition-all flex items-center gap-2 group shadow-sm"
              >
                Keep Shopping
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F6FA] gap-4">
        <Loader2 className="w-10 h-10 text-[#0C831F] animate-spin" />
        <p className="text-[#666666] font-bold">Verifying your order...</p>
      </div>
    }>
      <OrderConfirmedContent />
    </Suspense>
  );
}
