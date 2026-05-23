"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Plus, FolderOpen } from "lucide-react";
import CategoryTable from "../../../components/categories/CategoryTable";
import CategoryModal from "../../../components/categories/CategoryModal";
import { fetchApi } from "@/lib/api";
import { useAuth } from "../../../hooks/useAuth";

interface Category {
  id: string;
  name: string;
  slug?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
  _count: { products: number };
}

export default function CategoriesPage() {
  const { getToken } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    const token = await getToken();
    const res = await fetchApi("/admin/categories", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.success) {
      setCategories(res.data);
    }
    setLoading(false);
  }, [getToken]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openCreate = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingCategory(null);
  };

  const handleSaved = () => {
    handleClose();
    loadCategories();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">
            Organise your product catalogue into browsable categories.
          </p>
        </div>
        <button
          id="add-category-btn"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-[#F8C200] rounded-lg shadow-sm hover:bg-[#e5b300] focus:outline-none focus:ring-2 focus:ring-[#F8C200] focus:ring-offset-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {loading ? "—" : categories.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Active</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {loading ? "—" : categories.filter((c) => c.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Products</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {loading
              ? "—"
              : categories.reduce((acc, c) => acc + c._count.products, 0)}
          </p>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
          <FolderOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading categories…</p>
        </div>
      ) : (
        <CategoryTable categories={categories} onEdit={openEdit} />
      )}

      {/* Modal */}
      {modalOpen && (
        <CategoryModal
          category={editingCategory}
          onClose={handleClose}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
