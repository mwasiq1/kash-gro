import React from "react";
import { Edit2, Trash2, ExternalLink } from "lucide-react";
import { fetchApi } from "@/lib/api";

interface BannerTableProps {
  data: any[];
  onUpdate: () => void;
  onEdit: (banner: any) => void;
}

export default function BannerTable({ data, onUpdate, onEdit }: BannerTableProps) {
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    const res = await fetchApi(`/admin/banners/${id}`, { method: "DELETE" });
    if (res.success) onUpdate();
  };

  const toggleStatus = async (banner: any) => {
    const res = await fetchApi(`/admin/banners/${banner.id}`, {
      method: "PATCH",
      body: JSON.stringify({ isActive: !banner.isActive }),
    });
    if (res.success) onUpdate();
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-widest">
              <th className="p-4 font-black">Banner</th>
              <th className="p-4 font-black">Title & Link</th>
              <th className="p-4 font-black text-center">Sort Order</th>
              <th className="p-4 font-black text-center">Status</th>
              <th className="p-4 font-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((banner) => (
              <tr key={banner.id} className="hover:bg-gray-50/30 transition-colors group">
                <td className="p-4">
                  <div className="w-40 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img 
                      src={banner.imageUrl} 
                      alt={banner.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{banner.title}</span>
                    {banner.linkUrl ? (
                      <span className="text-xs font-medium text-gray-400 mt-1 flex items-center gap-1">
                        <ExternalLink size={12} /> {banner.linkUrl}
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-gray-400 mt-1">No link</span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm font-bold">
                    {banner.sortOrder}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => toggleStatus(banner)}
                    className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest transition-colors ${
                      banner.isActive
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {banner.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(banner)}
                      className="p-2 text-gray-400 hover:text-[#1C1C1C] hover:bg-gray-100 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
