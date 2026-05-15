"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface RevenueChartProps {
  data: {
    label: string;
    revenue: number;
    orders: number;
  }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1C1C1C] text-white p-3 rounded-xl shadow-xl border border-gray-800">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-black">₹{payload[0].value.toLocaleString()}</p>
        <p className="text-[10px] text-gray-400 font-bold mt-1">{payload[1]?.value || 0} Orders</p>
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-black text-[#1C1C1C]">Revenue Trends</h3>
          <p className="text-xs text-gray-400 font-medium mt-1">Daily sales performance over the last 7 days</p>
        </div>
      </div>

      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#9CA3AF", fontSize: 10, fontWeight: 700 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#9CA3AF", fontSize: 10, fontWeight: 700 }}
              tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000).toFixed(0) + "k" : value}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F9FAFB" }} />
            <Bar 
              dataKey="revenue" 
              radius={[6, 6, 0, 0]} 
              barSize={32}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === data.length - 1 ? "#F8C200" : "#F8C200"} fillOpacity={index === data.length - 1 ? 1 : 0.6} />
              ))}
            </Bar>
            {/* Hidden bar for order count to show in tooltip */}
            <Bar dataKey="orders" hide />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
