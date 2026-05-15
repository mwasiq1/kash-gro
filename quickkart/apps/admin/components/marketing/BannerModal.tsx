import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { fetchApi } from "@/lib/api";
import ImageUpload from "../products/ImageUpload";

interface BannerModalProps {
  onClose: () => void;
  onSuccess: () => void;
  banner?: any;
}

export default function BannerModal({ onClose, onSuccess, banner }: BannerModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    linkUrl: "",
    imageUrl: "",
    sortOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title,
        linkUrl: banner.linkUrl || "",
        imageUrl: banner.imageUrl,
        sortOrder: banner.sortOrder,
        isActive: banner.isActive,
      });
    }
  }, [banner]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.imageUrl) {
      setError("Please upload a banner image");
      return;
    }

    setLoading(true);

    try {
      const endpoint = banner ? `/admin/banners/${banner.id}` : "/admin/banners";
      const method = banner ? "PATCH" : "POST";

      const res = await fetchApi(endpoint, {
        method,
        body: JSON.stringify(formData),
      });

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || "Failed to save banner");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-black text-[#1C1C1C]">
            {banner ? "Edit Banner" : "Create New Banner"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold">
              {error}
            </div>
          )}

          <form id="banner-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Banner Image *
              </label>
              <ImageUpload
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F8C200] focus:border-transparent transition-all"
                  placeholder="e.g. Diwali Mega Sale"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Link URL (Optional)
                </label>
                <input
                  type="text"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F8C200] focus:border-transparent transition-all"
                  placeholder="e.g. /category/festive"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F8C200] focus:border-transparent transition-all"
                />
              </div>

              <div className="flex items-center gap-3 pt-8">
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="isActive"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
                <label htmlFor="isActive" className="text-sm font-bold text-gray-700">
                  Banner is Active
                </label>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-3xl">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="banner-form"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-[#1C1C1C] text-white font-bold rounded-xl hover:bg-black transition-all disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {banner ? "Save Changes" : "Create Banner"}
          </button>
        </div>
      </div>
    </div>
  );
}
