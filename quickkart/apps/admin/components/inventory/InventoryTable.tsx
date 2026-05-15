"use client";

import React, { useState } from "react";
import { AlertTriangle, Package, Check, X, Loader2 } from "lucide-react";
import { fetchApi } from "../../lib/api";

interface InventoryItem {
  id: string;
  name: string;
  category: { name: string };
  stock: number;
  lowStockAt: number;
  isActive: boolean;
}

interface InventoryTableProps {
  data: InventoryItem[];
  onUpdate: () => void;
}

export default function InventoryTable({ data, onUpdate }: InventoryTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const startEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditValue(item.stock.toString());
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const saveEdit = async (id: string) => {
    const newVal = parseInt(editValue);
    if (isNaN(newVal) || newVal < 0) return;

    setIsSaving(true);
    try {
      const res = await fetchApi(`/admin/inventory/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ stock: newVal }),
      });
      if (res.success) {
        onUpdate();
        setEditingId(null);
      }
    } catch (err) {
      console.error("Failed to update stock", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") {
      saveEdit(id);
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  return (
    <div className="bg-white shadow-sm overflow-hidden rounded-2xl border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Product</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Stock Level</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item) => {
              const isOutOfStock = item.stock === 0;
              const isLowStock = item.stock > 0 && item.stock <= item.lowStockAt;
              const isEditing = editingId === item.id;

              return (
                <tr 
                  key={item.id} 
                  className={`transition-colors duration-200 ${
                    isOutOfStock ? "bg-red-50/50" : isLowStock ? "bg-yellow-50/50" : "hover:bg-gray-50/30"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isOutOfStock ? "bg-red-100 text-red-600" : isLowStock ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-400"
                      }`}>
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{item.name}</p>
                        <p className="text-[10px] font-mono text-gray-400">{item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-gray-100 rounded-md text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                      {item.category?.name || "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          autoFocus
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, item.id)}
                          onBlur={() => saveEdit(item.id)}
                          disabled={isSaving}
                          className="w-20 px-2 py-1 text-sm font-bold border-2 border-[#F8C200] rounded-lg outline-none"
                        />
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 text-[#F8C200] animate-spin" />
                        ) : (
                          <Check className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    ) : (
                      <div 
                        onClick={() => startEdit(item)}
                        className="flex items-center gap-2 group cursor-pointer"
                      >
                        <span className={`text-sm font-black ${
                          isOutOfStock ? "text-red-600" : isLowStock ? "text-[#B88E00]" : "text-gray-900"
                        }`}>
                          {item.stock}
                        </span>
                        {isLowStock && <AlertTriangle className="w-3.5 h-3.5 text-yellow-600" />}
                        <span className="text-[10px] font-bold text-[#F8C200] opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to Edit
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isOutOfStock ? (
                      <span className="text-[10px] font-black text-red-600 uppercase tracking-widest bg-red-100 px-2 py-0.5 rounded-full">
                        Out of Stock
                      </span>
                    ) : isLowStock ? (
                      <span className="text-[10px] font-black text-yellow-700 uppercase tracking-widest bg-yellow-100 px-2 py-0.5 rounded-full">
                        Low Stock
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-green-700 uppercase tracking-widest bg-green-100 px-2 py-0.5 rounded-full">
                        In Stock
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
