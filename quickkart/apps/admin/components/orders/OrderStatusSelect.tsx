"use client";

import React, { useState } from "react";
import { fetchApi } from "@/lib/api";
import { Loader2 } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "PLACED", label: "Placed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

// Color map for each status badge
export const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-700",
  PLACED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-yellow-100 text-yellow-800",
  OUT_FOR_DELIVERY: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-[#0C831F]",
  CANCELLED: "bg-red-100 text-red-700",
};

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: string;
  onStatusUpdated: (newStatus: string) => void;
}

export default function OrderStatusSelect({
  orderId,
  currentStatus,
  onStatusUpdated,
}: OrderStatusSelectProps) {
  const [saving, setSaving] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;

    setSaving(true);
    const res = await fetchApi(`/admin/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    });
    setSaving(false);

    if (res.success) {
      onStatusUpdated(newStatus);
    } else {
      alert(res.error || "Failed to update status");
    }
  };

  return (
    <div className="relative inline-flex items-center">
      {saving && (
        <Loader2 className="absolute left-2 w-3.5 h-3.5 animate-spin text-gray-500 pointer-events-none" />
      )}
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={saving || currentStatus === "DELIVERED" || currentStatus === "CANCELLED"}
        className={`pl-2 pr-7 py-1 text-xs font-semibold rounded-full border-0 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F8C200] focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed ${STATUS_COLORS[currentStatus] ?? "bg-gray-100 text-gray-700"}`}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
