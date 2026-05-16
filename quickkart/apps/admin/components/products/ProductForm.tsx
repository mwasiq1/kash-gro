"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchApi } from "@/lib/api";
import ImageUpload from "./ImageUpload";
import MultiImageUpload from "./MultiImageUpload";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Loader2, Camera, Search, Sparkles } from "lucide-react";
import BarcodeScanner from "./BarcodeScanner";
import ScanResult from "./ScanResult";
import { lookupBarcode, ScannedProduct } from "@/lib/openfoodfacts";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  mrp: z.coerce.number().positive(),
  price: z.coerce.number().positive(),
  unit: z.string().min(1, "Unit is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  categoryId: z.string().min(1, "Category is required"),
  stock: z.coerce.number().int().min(0),
  lowStockAt: z.coerce.number().int().min(0),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  tags: z.string(), // We'll handle conversion to array on submit
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: any;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Barcode Scanner State
  const [showScanner, setShowScanner] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [scanResult, setScanResult] = useState<ScannedProduct | null>(null);
  const [showResult, setShowResult] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    // @ts-ignore: Zod coerce types mismatch with RHF
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      mrp: initialData?.mrp || 0,
      price: initialData?.price || 0,
      unit: initialData?.unit || "1 pc",
      images: initialData?.images || [],
      categoryId: initialData?.categoryId || "",
      stock: initialData?.stock || 10,
      lowStockAt: initialData?.lowStockAt || 5,
      isFeatured: initialData?.isFeatured ?? false,
      isActive: initialData?.isActive ?? true,
      tags: initialData?.tags ? initialData.tags.join(", ") : "",
    },
  });

  const handleBarcodeScanned = async (barcode: string) => {
    setShowScanner(false);
    setScannedBarcode(barcode);
    setLookingUp(true);
    
    const result = await lookupBarcode(barcode);
    setScanResult(result);
    setLookingUp(false);
    setShowResult(true);
  };

  const handleUseScanResult = () => {
    if (!scanResult) return;

    setValue("name", scanResult.name, { shouldValidate: true });
    setValue("unit", scanResult.unit || "1 unit", { shouldValidate: true });
    
    // Auto-generate slug if not present
    const slug = scanResult.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setValue("slug", slug);

    // Find category ID by name
    const category = categories.find(c => c.name === scanResult.categoryName);
    if (category) {
      setValue("categoryId", category.id, { shouldValidate: true });
    }

    // Handle image if present
    if (scanResult.imageUrl) {
      setValue("images", [scanResult.imageUrl], { shouldValidate: true });
    }

    // Add barcode to tags
    const currentTags = watch("tags");
    if (!currentTags.includes(scanResult.barcode)) {
      setValue("tags", currentTags ? `${currentTags}, ${scanResult.barcode}` : scanResult.barcode);
    }

    setShowResult(false);
    alert("Product details filled!");
  };

  const { getToken } = useAuth();
  const images = watch("images");

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      const token = await getToken();
      const res = await fetchApi("/categories", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.success) {
        setCategories(res.data);
      }
      setIsLoading(false);
    };
    fetchCategories();
  }, [getToken]);

  const onSubmit = async (data: ProductFormValues) => {
    const payload = {
      ...data,
      tags: data.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    const url = initialData ? `/admin/products/${initialData.id}` : "/admin/products";
    const method = initialData ? "PATCH" : "POST";

    const token = await getToken();
    const response = await fetchApi(url, {
      method,
      body: JSON.stringify(payload),
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.success) {
      router.push("/products");
      router.refresh();
    } else {
      alert(response.error || "Failed to save product");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
      {/* Scan Button at top */}
      <div className="pb-6 border-b border-gray-50">
        <button
          type="button"
          onClick={() => setShowScanner(true)}
          className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#F8C200] rounded-2xl bg-yellow-50/50 hover:bg-yellow-50 transition-all group"
        >
          <div className="bg-[#F8C200] p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform mb-3">
            <Camera className="w-6 h-6 text-black" />
          </div>
          <span className="text-lg font-bold text-black flex items-center gap-2">
            Scan Product Barcode
            <Sparkles className="w-4 h-4 text-[#F8C200]" />
          </span>
          <span className="text-sm text-gray-500 mt-1 font-medium">(auto-fills product details from database)</span>
        </button>
      </div>

      {/* Scanner Overlays */}
      {showScanner && (
        <BarcodeScanner 
          onScan={handleBarcodeScanned} 
          onCancel={() => setShowScanner(false)} 
        />
      )}

      {lookingUp && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl flex flex-col items-center gap-4 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin text-[#F8C200]" />
              <Search className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#F8C200]" />
            </div>
            <p className="font-bold text-gray-900">Looking up product details...</p>
            <p className="text-sm text-gray-400">Searching Open Food Facts...</p>
          </div>
        </div>
      )}

      {showResult && (
        <ScanResult 
          result={scanResult}
          barcode={scannedBarcode}
          onConfirm={handleUseScanResult}
          onRetry={() => {
            setShowResult(false);
            setShowScanner(true);
          }}
          onFillManually={() => setShowResult(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column - Image & Status */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            <MultiImageUpload
              value={images || []}
              onChange={(urls) => setValue("images" as any, urls, { shouldValidate: true })}
            />
            {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-medium text-gray-900">Visibility & Status</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Active</label>
                <p className="text-xs text-gray-500">Hide or show this product everywhere.</p>
              </div>
              <input
                type="checkbox"
                {...register("isActive")}
                className="w-5 h-5 text-[#F8C200] rounded focus:ring-[#F8C200]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Featured</label>
                <p className="text-xs text-gray-500">Highlight this product on the home page.</p>
              </div>
              <input
                type="checkbox"
                {...register("isFeatured")}
                className="w-5 h-5 text-[#F8C200] rounded focus:ring-[#F8C200]"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                {...register("name")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F8C200] focus:ring-[#F8C200] sm:text-sm p-2 border"
                placeholder="Fresh Apples"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Slug (optional)</label>
              <input
                type="text"
                {...register("slug")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F8C200] focus:ring-[#F8C200] sm:text-sm p-2 border"
                placeholder="fresh-apples"
              />
              {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register("description")}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F8C200] focus:ring-[#F8C200] sm:text-sm p-2 border"
              placeholder="Detailed description of the product..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                {...register("categoryId")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F8C200] focus:ring-[#F8C200] sm:text-sm p-2 border"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Unit</label>
              <input
                type="text"
                {...register("unit")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F8C200] focus:ring-[#F8C200] sm:text-sm p-2 border"
                placeholder="1 kg, 500g, 1 pack"
              />
              {errors.unit && <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">MRP (₹)</label>
              <input
                type="number"
                step="0.01"
                {...register("mrp")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F8C200] focus:ring-[#F8C200] sm:text-sm p-2 border"
              />
              {errors.mrp && <p className="mt-1 text-sm text-red-600">{errors.mrp.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Selling Price (₹)</label>
              <input
                type="number"
                step="0.01"
                {...register("price")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F8C200] focus:ring-[#F8C200] sm:text-sm p-2 border"
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                {...register("stock")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F8C200] focus:ring-[#F8C200] sm:text-sm p-2 border"
              />
              {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Low Stock Alert At</label>
              <input
                type="number"
                {...register("lowStockAt")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F8C200] focus:ring-[#F8C200] sm:text-sm p-2 border"
              />
              {errors.lowStockAt && <p className="mt-1 text-sm text-red-600">{errors.lowStockAt.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
            <input
              type="text"
              {...register("tags")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F8C200] focus:ring-[#F8C200] sm:text-sm p-2 border"
              placeholder="organic, fresh, imported"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={() => router.push("/products")}
          className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F8C200]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="flex items-center px-4 py-2 text-sm font-medium text-black bg-[#F8C200] border border-transparent rounded-md shadow-sm hover:bg-[#e5b300] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F8C200] disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {initialData ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
