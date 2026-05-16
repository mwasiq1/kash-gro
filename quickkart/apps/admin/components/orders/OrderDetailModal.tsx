"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, MapPin, User, Phone, Mail, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { STATUS_COLORS } from "./OrderStatusSelect";
import { fetchApi } from "@/lib/api";

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
  pickingAt?: string | null;
  packedAt?: string | null;
  processingAt?: string | null;
  outForDeliveryAt?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
  cancelReason?: string | null;
  user: { name?: string | null; email?: string | null; phone?: string | null };
  items: OrderItem[];
}

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onStatusUpdated?: (orderId: string, newStatus: string) => void;
}

const STATUS_STEPS = [
  { key: "PLACED", label: "Order Placed", tsKey: "createdAt" },
  { key: "CONFIRMED", label: "Order Confirmed", tsKey: "confirmedAt" },
  { key: "PICKING", label: "Picking", tsKey: "pickingAt" },
  { key: "PACKED", label: "Packed", tsKey: "packedAt" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", tsKey: "outForDeliveryAt" },
  { key: "DELIVERED", label: "Delivered", tsKey: "deliveredAt" },
] as const;

const CANCELLED_STEP = { key: "CANCELLED", label: "Cancelled", tsKey: "cancelledAt" };

const STATUS_ORDER = ["PLACED", "CONFIRMED", "PICKING", "PACKED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

const fmt = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

export default function OrderDetailModal({ order, onClose, onStatusUpdated }: OrderDetailModalProps) {
  const [updating, setUpdating] = useState(false);
  const isCancelled = order.status === "CANCELLED";

  const steps = isCancelled
    ? [...STATUS_STEPS.slice(0, 1), CANCELLED_STEP]
    : STATUS_STEPS;

  const currentIdx = STATUS_ORDER.indexOf(order.status);

  const getNextStatusAction = () => {
    switch (order.status) {
      case "PLACED": return { next: "CONFIRMED", label: "Confirm Order" };
      case "CONFIRMED": return { next: "PICKING", label: "Start Picking" };
      case "PICKING": return { next: "PACKED", label: "Mark as Packed" };
      case "PACKED": return { next: "OUT_FOR_DELIVERY", label: "Out for Delivery" };
      case "OUT_FOR_DELIVERY": return { next: "DELIVERED", label: "Mark as Delivered" };
      case "DELIVERED": return { badge: "Order Complete", color: "bg-[#0C831F] text-white" };
      case "CANCELLED": return { badge: "Cancelled", color: "bg-red-500 text-white" };
      default: return null;
    }
  };

  const handleUpdateStatus = async (nextStatus: string) => {
    setUpdating(true);
    const res = await fetchApi(`/admin/orders/${order.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: nextStatus }),
    });
    setUpdating(false);

    if (res.success) {
      alert("Order status updated");
      if (onStatusUpdated) {
        onStatusUpdated(order.id, nextStatus);
      }
    } else {
      alert(res.error || "Failed to update status");
    }
  };

  const action = getNextStatusAction();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
            <p className="text-sm font-mono text-gray-500">{order.orderNumber}</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-700"}`}
            >
              {order.status.replace(/_/g, " ")}
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
          {/* Customer Info */}
          <section className="bg-gray-50 rounded-xl p-4 space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Customer
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <User className="w-4 h-4 text-gray-400" />
              <span>{order.user.name ?? order.user.email ?? "Guest"}</span>
            </div>
            {order.user.email && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{order.user.email}</span>
              </div>
            )}
            {order.user.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{order.user.phone}</span>
              </div>
            )}
            <div className="flex items-start gap-2 text-sm text-gray-700 pt-1">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span>{order.deliveryAddress}</span>
            </div>
          </section>

          {/* Status Timeline */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Status History
            </h3>
            <ol className="relative border-l-2 border-gray-200 ml-3 space-y-6">
              {steps.map((step) => {
                const ts = fmt((order as any)[step.tsKey]);
                const stepIdx = STATUS_ORDER.indexOf(step.key);
                const reached = stepIdx <= currentIdx || ts !== null;

                return (
                  <li key={step.key} className="ml-5">
                    <span
                      className={`absolute -left-[9px] flex items-center justify-center w-4 h-4 rounded-full ${
                        reached ? "bg-[#F8C200]" : "bg-gray-200"
                      }`}
                    >
                      {reached ? (
                        <CheckCircle2 className="w-3 h-3 text-black" />
                      ) : (
                        <Circle className="w-3 h-3 text-gray-400" />
                      )}
                    </span>
                    <p
                      className={`text-sm font-medium ${reached ? "text-gray-900" : "text-gray-400"}`}
                    >
                      {step.label}
                    </p>
                    {ts && (
                      <p className="text-xs text-gray-500 mt-0.5">{ts}</p>
                    )}
                    {step.key === "CANCELLED" && order.cancelReason && (
                      <p className="text-xs text-red-500 mt-0.5">
                        Reason: {order.cancelReason}
                      </p>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>

          {/* Order Items (snapshot) */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Items
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.product.unit} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">
                      ₹{item.price.toFixed(2)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Order Total */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4 mb-4">
            <span className="text-sm font-medium text-gray-600">Order Total</span>
            <span className="text-lg font-bold text-gray-900">
              ₹{order.totalAmount.toFixed(2)}
            </span>
          </div>

          {/* Action Button */}
          {action && (
            <div className="pt-2">
              {action.next ? (
                <button
                  onClick={() => handleUpdateStatus(action.next!)}
                  disabled={updating}
                  className="w-full bg-[#F8C200] text-black font-bold py-3.5 rounded-xl hover:bg-[#e6b400] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {action.label}
                </button>
              ) : (
                <div className={`w-full font-bold py-3.5 rounded-xl text-center ${action.color}`}>
                  {action.badge}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
