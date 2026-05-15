"use client";

import React, { useEffect, useState } from "react";
import { Plus, Image as ImageIcon, RefreshCw } from "lucide-react";
import { fetchApi } from "@/lib/api";
import BannerTable from "../../../components/marketing/BannerTable";
import BannerModal from "../../../components/marketing/BannerModal";

export default function BannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<any>(null);

  const loadBanners = async () => {
    setLoading(true);
    const res = await fetchApi("/admin/banners");
    if (res.success) {
      setBanners(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleEdit = (banner: any) => {
    setSelectedBanner(banner);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedBanner(null);
    setShowModal(true);
  };

  return (
    <div className="space-y-8 p-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Storefront Banners</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage promotional banners displayed on the customer app.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={loadBanners}
            disabled={loading}
            className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-500 disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
          
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 bg-[#F8C200] text-black rounded-xl text-sm font-black hover:bg-[#e6b400] transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            Add Banner
          </button>
        </div>
      </div>

      {/* Main Content */}
      {loading && banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <RefreshCw className="w-10 h-10 text-[#F8C200] animate-spin mb-4" />
          <p className="text-gray-500 font-bold">Loading banners...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 font-bold mb-2">No banners found</p>
          <button 
            onClick={handleAdd}
            className="text-sm font-bold text-[#F8C200] hover:underline"
          >
            Create your first banner
          </button>
        </div>
      ) : (
        <BannerTable 
          data={banners} 
          onUpdate={loadBanners} 
          onEdit={handleEdit} 
        />
      )}

      {showModal && (
        <BannerModal 
          onClose={() => setShowModal(false)} 
          onSuccess={loadBanners}
          banner={selectedBanner}
        />
      )}
    </div>
  );
}
