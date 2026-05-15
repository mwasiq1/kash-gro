"use client";

import React, { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import InventoryTable from "../../../components/inventory/InventoryTable";
import BulkUpdateModal from "../../../components/inventory/BulkUpdateModal";
import { Download, Upload, PackageSearch, RefreshCw } from "lucide-react";
import Papa from "papaparse";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBulkModal, setShowBulkModal] = useState(false);

  const loadInventory = async () => {
    setLoading(true);
    const res = await fetchApi("/admin/inventory");
    if (res.success) {
      setInventory(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleExport = () => {
    const csvData = inventory.map((item) => ({
      ID: item.id,
      Name: item.name,
      Category: item.category?.name || "N/A",
      Stock: item.stock,
      "Low Stock Threshold": item.lowStockAt,
      Status: item.isActive ? "Active" : "Inactive",
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `kashgro_inventory_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Inventory Management</h1>
          <p className="text-gray-500 mt-1 font-medium">Monitor and manage product stock levels across your store.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={loadInventory}
            disabled={loading}
            className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-500 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
          
          <button
            onClick={handleExport}
            disabled={inventory.length === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          
          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#1C1C1C] text-white rounded-xl text-sm font-bold hover:bg-black transition-all shadow-lg shadow-gray-200 active:scale-95"
          >
            <Upload className="w-4 h-4" />
            Bulk Update
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total SKU Count</p>
          <p className="text-3xl font-black text-gray-900">{inventory.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Low Stock Items</p>
          <p className="text-3xl font-black text-yellow-600">
            {inventory.filter(i => i.stock > 0 && i.stock <= i.lowStockAt).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Out of Stock</p>
          <p className="text-3xl font-black text-red-600">
            {inventory.filter(i => i.stock === 0).length}
          </p>
        </div>
      </div>

      {/* Main Table */}
      {loading && inventory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
          <RefreshCw className="w-10 h-10 text-[#F8C200] animate-spin mb-4" />
          <p className="text-gray-500 font-bold">Loading inventory data...</p>
        </div>
      ) : inventory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
          <PackageSearch className="w-12 h-12 text-gray-200 mb-4" />
          <p className="text-gray-500 font-bold">No products found in inventory.</p>
        </div>
      ) : (
        <InventoryTable data={inventory} onUpdate={loadInventory} />
      )}

      {showBulkModal && (
        <BulkUpdateModal 
          onClose={() => setShowBulkModal(false)} 
          onSuccess={loadInventory}
          data={inventory}
        />
      )}
    </div>
  );
}
