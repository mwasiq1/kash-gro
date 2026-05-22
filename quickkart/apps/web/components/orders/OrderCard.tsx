"use client";

import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { OrderStatus } from "@quickkart/shared";

interface OrderCardProps {
  order: {
    id: string;
    orderNumber: string;
    createdAt: string | Date;
    totalAmount: number;
    status: OrderStatus;
    items: any[];
  };
}

export default function OrderCard({ order }: OrderCardProps) {
  const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);
  const dateObj = order.createdAt ? new Date(order.createdAt) : new Date((order as any).placedAt);
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(dateObj);

  const displayTotal = order.totalAmount ?? (order as any).total;

  return (
    <Link 
      href={`/orders/${order.id}`}
      className="block bg-white rounded-2xl border border-[#E8E8E8] shadow-sm p-5 hover:shadow-md transition-all group active:scale-[0.99]"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#666666] group-hover:bg-yellow-50 group-hover:text-[#F8C200] transition-colors">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="font-mono text-sm text-[#666666] mb-0.5">Order #{order.orderNumber}</p>
            <p className="text-sm font-bold text-[#1C1C1C]">{formattedDate}</p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#E8E8E8]">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] font-black text-[#999999] uppercase tracking-widest">Items</p>
            <p className="text-sm font-bold text-[#1C1C1C]">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-[#999999] uppercase tracking-widest">Total</p>
            <p className="text-sm font-black text-[#1C1C1C]">₹{displayTotal}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[#1C1C1C] group-hover:text-[#F8C200] text-sm font-black transition-colors">
          View Details
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
