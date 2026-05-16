"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { fetchApi } from "../../../lib/api";
import OrderCard from "../../../components/orders/OrderCard";
import { ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const loadOrders = async () => {
        try {
          const token = await getToken();
          const response = await fetchApi("/orders", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.success) {
            setOrders(response.data);
          }
        } catch (err) {
          console.error("Failed to load orders", err);
        } finally {
          setLoading(false);
        }
      };
      loadOrders();
    } else if (isLoaded && !isSignedIn) {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, getToken]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
        <div className="h-10 w-48 bg-gray-100 rounded-xl animate-pulse mb-8" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-50 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h1 className="text-2xl font-black text-[#1C1C1C] mb-2">My Orders</h1>
        <p className="text-[#666666] mb-8">Please sign in to view your order history.</p>
        <Link href="/sign-in" className="bg-[#1C1C1C] text-white font-black px-8 py-4 rounded-2xl hover:bg-black transition-all">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-[#1C1C1C] mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-[#E8E8E8]">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-200" />
          </div>
          <h2 className="text-xl font-black text-[#1C1C1C] mb-2">No orders yet</h2>
          <p className="text-[#666666] mb-8 max-w-xs mx-auto">Looks like you haven&apos;t placed any orders yet. Start shopping to see them here!</p>
          <Link href="/" className="bg-[#F8C200] text-[#1C1C1C] font-black px-10 py-4 rounded-2xl hover:bg-[#e6b400] transition-all shadow-lg shadow-yellow-100">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
