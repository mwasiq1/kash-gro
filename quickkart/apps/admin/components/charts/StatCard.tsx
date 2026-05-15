"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  subtitle?: string;
}

export default function StatCard({ title, value, trend, icon, subtitle }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-black px-2 py-1 rounded-full ${
            trend.isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          }`}>
            {trend.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend.value}%
          </div>
        )}
      </div>
      
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-black text-[#1C1C1C] tracking-tight">{value}</h3>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1 font-medium">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
