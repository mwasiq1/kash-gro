import React from "react";
import { Edit2, ExternalLink } from "lucide-react";
import { fetchApi } from "@/lib/api";

interface PromoTableProps {
  data: any[];
  onUpdate: () => void;
  onEdit: (promo: any) => void;
}

export default function PromoTable({ data, onUpdate, onEdit }: PromoTableProps) {
  const toggleStatus = async (promo: any) => {
    const res = await fetchApi(`/admin/promos/${promo.id}`, {
      method: "PATCH",
      body: JSON.stringify({ isActive: !promo.isActive }),
    });
    if (res.success) onUpdate();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No Limit";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-widest">
              <th className="p-4 font-black">Code</th>
              <th className="p-4 font-black">Discount</th>
              <th className="p-4 font-black text-center">Usage</th>
              <th className="p-4 font-black">Validity</th>
              <th className="p-4 font-black text-center">Status</th>
              <th className="p-4 font-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((promo) => {
              const isExpired = promo.endDate && new Date(promo.endDate) < new Date();
              return (
                <tr key={promo.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="p-4">
                    <span className="font-mono font-black text-[#1C1C1C] text-lg bg-gray-50 px-3 py-1 rounded-lg border border-dashed border-gray-300">
                      {promo.code}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#F8C200]">
                        {promo.discountType === "PERCENTAGE" ? `${promo.discountValue}% OFF` : `₹${promo.discountValue} OFF`}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gray-400 mt-1">
                        Min Order: ₹{promo.minOrderAmount}
                        {promo.discountType === "PERCENTAGE" && promo.maxDiscountAmount && ` • Max: ₹${promo.maxDiscountAmount}`}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-gray-900">{promo.usedCount}</span>
                      <span className="text-[10px] text-gray-400 uppercase font-bold">
                        / {promo.usageLimit || "∞"} used
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col text-xs font-medium">
                      <span className="text-gray-900">Starts: {formatDate(promo.startDate)}</span>
                      <span className={isExpired ? "text-red-500 font-bold" : "text-gray-500"}>
                        Ends: {formatDate(promo.endDate)}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => toggleStatus(promo)}
                      className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest transition-colors ${
                        promo.isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {promo.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(promo)}
                        className="p-2 text-gray-400 hover:text-[#1C1C1C] hover:bg-gray-100 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {data.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">
                  No promo codes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
