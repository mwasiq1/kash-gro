"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchApi } from "../../lib/api";
import ImageUpload from "./ImageUpload";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  mrp: z.coerce.number().positive(),
  sellingPrice: z.coerce.number().positive(),
  unit: z.string().min(1, "Unit is required"),
  imageUrl: z.string().url("Valid image URL is required").min(1, "Image is required"),
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
      sellingPrice: initialData?.sellingPrice || 0,
      unit: initialData?.unit || "1 pc",
      imageUrl: initialData?.imageUrl || "",
      categoryId: initialData?.categoryId || "",
      stock: initialData?.stock || 10,
      lowStockAt: initialData?.lowStockAt || 5,
      isFeatured: initialData?.isFeatured ?? false,
      isActive: initialData?.isActive ?? true,
      tags: initialData?.tags ? initialData.tags.join(", ") : "",
    },
  });

  const imageUrl = watch("imageUrl");

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      const res = await fetchApi("/categories");
      if (res.success) {
        setCategories(res.data);
      }
      setIsLoading(false);
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data: ProductFormValues) => {
    const payload = {
      ...data,
      tags: data.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    const url = initialData ? `/admin/products/${initialData.id}` : "/admin/products";
    const method = initialData ? "PATCH" : "POST";

    const response = await fetchApi(url, {
      method,
      body: JSON.stringify(payload),
    });

    if (response.success) {
      router.push("/products");
      router.refresh();
    } else {
      alert(response.error || "Failed to save product");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column - Image & Status */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            <ImageUpload
              value={imageUrl}
              onChange={(url) => setValue("imageUrl" as any, url, { shouldValidate: true })}
            />
            {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>}
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
              <label className="block text-sm font-medium text-gray-700">MRP ($)</label>
              <input
                type="number"
                step="0.01"
                {...register("mrp")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F8C200] focus:ring-[#F8C200] sm:text-sm p-2 border"
              />
              {errors.mrp && <p className="mt-1 text-sm text-red-600">{errors.mrp.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Selling Price ($)</label>
              <input
                type="number"
                step="0.01"
                {...register("sellingPrice")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F8C200] focus:ring-[#F8C200] sm:text-sm p-2 border"
              />
              {errors.sellingPrice && <p className="mt-1 text-sm text-red-600">{errors.sellingPrice.message}</p>}
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
