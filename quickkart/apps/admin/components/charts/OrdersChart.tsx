"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

interface OrdersChartProps {
  data: {
    status: string;
    count: number;
  }[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#9CA3AF",      // Gray
  PLACED: "#3B82F6",       // Blue
  PROCESSING: "#F8C200",   // Yellow (Brand)
  OUT_FOR_DELIVERY: "#8B5CF6", // Purple
  DELIVERED: "#10B981",    // Green
  CANCELLED: "#EF4444",    // Red
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1C1C1C] text-white p-3 rounded-xl shadow-xl border border-gray-800">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{payload[0].name}</p>
        <p className="text-sm font-black">{payload[0].value} Orders</p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  return (
    <ul className="flex flex-col gap-2 mt-4">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{entry.value}</span>
          <span className="text-[10px] font-black text-gray-900 ml-auto">{entry.payload.count}</span>
        </li>
      ))}
    </ul>
  );
};

export default function OrdersChart({ data }: OrdersChartProps) {
  // Sort data to keep consistent order
  const sortedData = [...data].sort((a, b) => b.count - a.count);
  const total = sortedData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-black text-[#1C1C1C] mb-1">Order Status</h3>
      <p className="text-xs text-gray-400 font-medium mb-8">Distribution by current status</p>

      <div className="flex-1 relative min-h-[250px]">
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</p>
          <p className="text-2xl font-black text-[#1C1C1C]">{total}</p>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sortedData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="count"
              nameKey="status"
            >
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || "#E5E7EB"} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <CustomLegend payload={sortedData.map(item => ({ 
        value: item.status.replace(/_/g, " "), 
        color: STATUS_COLORS[item.status] || "#E5E7EB",
        payload: item
      }))} />
    </div>
  );
}
