"use client";

import { Banknote } from "lucide-react";

interface CODConfirmProps {
  total: number;
}

export default function CODConfirm({ total }: CODConfirmProps) {
  return (
    <div className="bg-[#FFF9E6] border-2 border-[#F8C200] p-5 rounded-2xl flex items-center gap-4 shadow-sm">
      <div className="w-12 h-12 bg-[#F8C200] rounded-full flex items-center justify-center flex-shrink-0 shadow-inner">
        <Banknote className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-black text-[#1C1C1C]">Cash on Delivery</p>
        <p className="text-xs text-gray-600 font-medium">Pay ₹{total} to the rider when they arrive</p>
      </div>
    </div>
  );
}
