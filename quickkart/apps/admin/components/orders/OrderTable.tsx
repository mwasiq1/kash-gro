"use client";

import React from "react";
import { ChevronRight, Package } from "lucide-react";
import OrderStatusSelect, { STATUS_COLORS } from "./OrderStatusSelect";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { id: string; name: string; imageUrl: string; unit: string };
}

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
  items: OrderItem[];
}

interface OrderTableProps {
  orders: Order[];
  onRowClick: (order: Order) => void;
  onStatusUpdated: (orderId: string, newStatus: string) => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function OrderTable({
  orders,
  onRowClick,
  onStatusUpdated,
}: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 py-16 flex flex-col items-center">
        <Package className="w-10 h-10 text-gray-300 mb-3" />
        <p className="text-sm text-gray-500">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden rounded-xl border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              {["Order #", "Customer", "Items", "Total", "Status", "Placed", ""].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onRowClick(order)}
              >
                {/* Order Number */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono font-semibold text-gray-900">
                    {order.orderNumber}
                  </span>
                </td>

                {/* Customer */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm font-medium text-gray-900">
                    {order.user.name ?? order.user.email ?? "Guest"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {order.user.email ?? order.user.phone ?? ""}
                  </p>
                </td>

                {/* Items count */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-700">
                    {order.items.reduce((s, i) => s + i.quantity, 0)} items
                  </span>
                </td>

                {/* Total */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">
                    ₹{order.totalAmount.toFixed(2)}
                  </span>
                </td>

                {/* Status dropdown — stopPropagation so click doesn't open modal */}
                <td
                  className="px-6 py-4 whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <OrderStatusSelect
                    orderId={order.id}
                    currentStatus={order.status}
                    onStatusUpdated={(s) => onStatusUpdated(order.id, s)}
                  />
                </td>

                {/* Placed date */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-xs text-gray-500">
                    {formatDate(order.createdAt)}
                  </span>
                </td>

                {/* Arrow */}
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
