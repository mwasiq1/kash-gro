"use client";

import { OrderStatus } from "@quickkart/shared";

const statusConfig: Record<OrderStatus, { label: string; classes: string }> = {
  PENDING: {
    label: "Pending",
    classes: "bg-[#F4F6FA] text-[#666666]",
  },
  CONFIRMED: {
    label: "Confirmed",
    classes: "bg-[#F8C200]/15 text-[#1C1C1C]",
  },
  PLACED: {
    label: "Placed",
    classes: "bg-[#F8C200]/15 text-[#1C1C1C]",
  },
  PROCESSING: {
    label: "Processing",
    classes: "bg-[#F8C200]/15 text-[#1C1C1C]",
  },
  PICKING: {
    label: "Picking",
    classes: "bg-[#F8C200]/15 text-[#1C1C1C]",
  },
  PACKED: {
    label: "Packed",
    classes: "bg-[#F8C200]/15 text-[#1C1C1C]",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    classes: "bg-[#F8C200]/15 text-[#1C1C1C]",
  },
  DELIVERED: {
    label: "Delivered",
    classes: "bg-[#0C831F]/10 text-[#0C831F]",
  },
  CANCELLED: {
    label: "Cancelled",
    classes: "bg-[#D0190A]/10 text-[#D0190A]",
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
