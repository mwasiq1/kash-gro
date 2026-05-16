"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { fetchApi } from "@/lib/api";
import OrderTable from "../../../components/orders/OrderTable";
import OrderDetailModal from "../../../components/orders/OrderDetailModal";

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "PLACED", label: "Placed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

const STATUS_TAB_COLORS: Record<string, string> = {
  "": "bg-gray-900 text-white",
  PENDING: "bg-gray-100 text-gray-700",
  PLACED: "bg-blue-600 text-white",
  PROCESSING: "bg-yellow-400 text-black",
  OUT_FOR_DELIVERY: "bg-purple-600 text-white",
  DELIVERED: "bg-[#0C831F] text-white",
  CANCELLED: "bg-red-500 text-white",
};

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  createdAt: string;
  confirmedAt?: string | null;
  processingAt?: string | null;
  outForDeliveryAt?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
  cancelReason?: string | null;
  user: { name?: string | null; email?: string | null; phone?: string | null };
  items: any[];
}

export default function OrdersPage() {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: "20",
      ...(activeStatus && { status: activeStatus }),
      ...(search && { search }),
    });
    
    try {
      const token = await getToken();
      const res = await fetchApi(`/admin/orders?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.success) {
        setOrders(res.data);
        setTotalPages(res.pagination.totalPages);
        setTotal(res.pagination.total);
      }
    } catch (err) {
      console.error("Failed to fetch admin orders", err);
    }
    setLoading(false);
  }, [page, activeStatus, search, getToken]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [activeStatus, search]);

  useEffect(() => {
    const t = setTimeout(loadOrders, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [loadOrders]);

  const handleStatusUpdated = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    // If the detail modal is open for this order, update it too
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            {loading ? "Loading…" : `${total} total orders`}
          </p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => {
          const isActive = activeStatus === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveStatus(tab.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? STATUS_TAB_COLORS[tab.value]
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search order # or customer name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8C200] focus:border-transparent"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 flex flex-col items-center">
          <ShoppingBag className="w-10 h-10 text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">Loading orders…</p>
        </div>
      ) : (
        <OrderTable
          orders={orders}
          onRowClick={setSelectedOrder}
          onStatusUpdated={handleStatusUpdated}
        />
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-600 pt-2">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
