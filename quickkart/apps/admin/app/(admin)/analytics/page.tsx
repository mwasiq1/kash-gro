"use client";

import React, { useEffect, useState } from "react";
import { fetchApi } from "../../lib/api";
import StatCard from "../../components/charts/StatCard";
import RevenueChart from "../../components/charts/RevenueChart";
import OrdersChart from "../../components/charts/OrdersChart";
import TopProducts from "../../components/charts/TopProducts";
import { 
  ShoppingBag, 
  IndianRupee, 
  Users, 
  Target, 
  RefreshCw, 
  AlertTriangle,
  TrendingUp,
  Package
} from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    setLoading(true);
    const res = await fetchApi("/admin/analytics");
    if (res.success) {
      setData(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-10 h-10 text-[#F8C200] animate-spin mb-4" />
        <p className="text-gray-500 font-bold">Aggregating store metrics...</p>
      </div>
    );
  }

  const { today, last7Days, ordersByStatus, topProducts, lowStock } = data || {};

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#1C1C1C] tracking-tight">Store Analytics</h1>
          <p className="text-gray-500 font-medium mt-1">Real-time business performance and operational insights.</p>
        </div>
        <button 
          onClick={loadAnalytics}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {/* Top Row: Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Revenue"
          value={`₹${today?.revenue.toLocaleString() || 0}`}
          icon={<IndianRupee size={20} className="text-[#0C831F]" />}
          trend={{ value: 12, isPositive: true }}
          subtitle="Compared to yesterday"
        />
        <StatCard
          title="Today's Orders"
          value={today?.orders || 0}
          icon={<ShoppingBag size={20} className="text-blue-500" />}
          trend={{ value: 5, isPositive: true }}
          subtitle="Active orders today"
        />
        <StatCard
          title="Avg. Order Value"
          value={`₹${Math.round(today?.avgOrderValue || 0).toLocaleString()}`}
          icon={<Target size={20} className="text-purple-500" />}
          subtitle="Revenue per order"
        />
        <StatCard
          title="New Customers"
          value={today?.newCustomers || 0}
          icon={<Users size={20} className="text-orange-500" />}
          trend={{ value: 8, isPositive: true }}
          subtitle="Joined in last 24h"
        />
      </div>

      {/* Middle Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 min-h-[450px]">
          <RevenueChart data={last7Days || []} />
        </div>
        <div className="min-h-[450px]">
          <OrdersChart data={ordersByStatus || []} />
        </div>
      </div>

      {/* Bottom Row: Top Products & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProducts products={topProducts || []} />
        
        {/* Low Stock Panel */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-[#1C1C1C]">Critical Inventory</h3>
              <p className="text-xs text-gray-400 font-medium mt-1">Products requiring immediate restock</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>

          <div className="space-y-3">
            {lowStock?.length === 0 ? (
              <div className="py-10 text-center text-gray-400 text-sm font-medium">
                All inventory levels are healthy!
              </div>
            ) : (
              lowStock?.map((item: any) => (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between p-4 rounded-2xl border ${
                    item.stock === 0 ? "bg-red-50 border-red-100" : "bg-yellow-50 border-yellow-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.stock === 0 ? "bg-red-200 text-red-700" : "bg-yellow-200 text-yellow-700"}`}>
                      <Package size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{item.name}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Threshold: {item.lowStockAt} units
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-black ${item.stock === 0 ? "text-red-600" : "text-yellow-700"}`}>
                      {item.stock} in stock
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Restock Needed
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
