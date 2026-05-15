"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { fetchApi } from "../../../../lib/api";
import StatusTimeline from "../../../../components/orders/StatusTimeline";
import { ArrowLeft, MapPin, Package, Clock, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

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

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      loadOrder();
    } else if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, orderId]);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    
    setCancelling(true);
    try {
      const token = await getToken();
      const response = await fetchApi(`/orders/${orderId}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: "Cancelled by user" }),
      });
      if (response.success) {
        await loadOrder();
      } else {
        alert(response.error || "Failed to cancel order");
      }
    } catch (err) {
      console.error("Failed to cancel order", err);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6FA]">
        <Loader2 className="w-10 h-10 text-[#0C831F] animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-black text-[#1C1C1C]">Order Not Found</h1>
        <Link href="/orders" className="text-[#0C831F] font-bold hover:underline mt-4 block">
          Back to My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA] pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 border-b border-gray-100 px-4 py-4 md:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/orders" className="p-2 hover:bg-gray-50 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-[#1C1C1C]" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-[#1C1C1C]">Order #{order.orderNumber}</h1>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {order.status === "PLACED" && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="bg-red-50 text-red-600 font-black px-6 py-2.5 rounded-xl hover:bg-red-100 transition-all flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              Cancel Order
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Timeline & Address */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-black text-[#1C1C1C] mb-8 flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#0C831F]" />
              Order Status
            </h3>
            <StatusTimeline currentStatus={order.status} cancelledAt={order.cancelledAt} />
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-black text-[#1C1C1C] mb-6 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#0C831F]" />
              Delivery Address
            </h3>
            <div className="bg-gray-50 p-6 rounded-2xl">
              <p className="text-sm font-bold text-[#1C1C1C] leading-relaxed">
                {order.deliveryAddress}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Summary & Items */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
              <Package className="w-5 h-5 text-gray-400" />
              <h3 className="font-black text-[#1C1C1C]">Order Details</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-14 h-14 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center border border-gray-100 overflow-hidden">
                      <Image src={item.product.images[0] || "https://placehold.co/48x48/F4F6FA/1C1C1C?text=P"} alt={item.product.name} fill className="object-contain p-2" sizes="56px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1C1C1C] truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500 font-medium">{item.quantity} × {item.product.unit}</p>
                    </div>
                    <p className="text-sm font-black text-[#1C1C1C]">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="font-medium">Total Amount</span>
                  <span className="font-black text-[#1C1C1C]">₹{order.totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="font-medium">Payment Mode</span>
                  <span className="font-bold text-[#0C831F]">Cash on Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
