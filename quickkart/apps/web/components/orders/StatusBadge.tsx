"use client";

import { OrderStatus } from "@prisma/client";

const statusConfig: Record<OrderStatus, { label: string; classes: string }> = {
  PENDING: {
    label: "Pending",
    classes: "bg-gray-100 text-[#666666]",
  },
  CONFIRMED: {
    label: "Confirmed",
    classes: "bg-cyan-50 text-cyan-600",
  },
  PLACED: {
    label: "Placed",
    classes: "bg-blue-50 text-blue-600",
  },
  PROCESSING: {
    label: "Processing",
    classes: "bg-[#FFF9E6] text-[#F8C200]",
  },
  PICKING: {
    label: "Picking",
    classes: "bg-orange-50 text-orange-600",
  },
  PACKED: {
    label: "Packed",
    classes: "bg-indigo-50 text-indigo-600",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    classes: "bg-purple-50 text-purple-600",
  },
  DELIVERED: {
    label: "Delivered",
    classes: "bg-[#EBF9EE] text-[#0C831F]",
  },
  CANCELLED: {
    label: "Cancelled",
    classes: "bg-[#FEF0EF] text-[#D0190A]",
  },
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${config.classes}`}>
      {config.label}
    </span>
  );
}
