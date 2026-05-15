"use client";

import React, { useEffect, useState } from "react";
import { Plus, Ticket, RefreshCw } from "lucide-react";
import { fetchApi } from "@/lib/api";
import PromoTable from "../../../components/marketing/PromoTable";
import PromoModal from "../../../components/marketing/PromoModal";

export default function PromoCodesPage() {
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<any>(null);

  const loadPromos = async () => {
    setLoading(true);
    const res = await fetchApi("/admin/promos");
    if (res.success) {
      setPromos(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPromos();
  }, []);

  const handleEdit = (promo: any) => {
    setSelectedPromo(promo);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedPromo(null);
    setShowModal(true);
  };

  return (
    <div className="space-y-8 p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Promo Codes</h1>
          <p className="text-gray-500 mt-1 font-medium">Create and manage discount codes to drive sales and retention.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={loadPromos}
            disabled={loading}
            className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-500 disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
          
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 bg-[#1C1C1C] text-white rounded-xl text-sm font-black hover:bg-black transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            Create Promo Code
          </button>
        </div>
      </div>

      {/* Main Content */}
      {loading && promos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <RefreshCw className="w-10 h-10 text-[#F8C200] animate-spin mb-4" />
          <p className="text-gray-500 font-bold">Loading promo codes...</p>
        </div>
      ) : promos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Ticket className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 font-bold mb-2">No active promotions</p>
          <button 
            onClick={handleAdd}
            className="text-sm font-bold text-[#F8C200] hover:underline"
          >
            Generate a discount code
          </button>
        </div>
      ) : (
        <PromoTable 
          data={promos} 
          onUpdate={loadPromos} 
          onEdit={handleEdit} 
        />
      )}

      {showModal && (
        <PromoModal 
          onClose={() => setShowModal(false)} 
          onSuccess={loadPromos}
          promo={selectedPromo}
        />
      )}
    </div>
  );
}
