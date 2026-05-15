import React from "react";
import ProductForm from "../../../../components/products/ProductForm";
import { fetchApi } from "../../../../lib/api";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Product | KashGro Admin",
};

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { getToken } = await auth();
  const token = await getToken();

  // We don't have a direct GET /admin/products/:id endpoint in our controller right now.
  // Wait, the public API has GET /products/:id. Let's use that!
  const res = await fetchApi(`/products/${params.id}`);

  if (!res.success || !res.data) {
    notFound();
  }

  const product = res.data;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update inventory, pricing, and details for {product.name}.
        </p>
      </div>

      <ProductForm initialData={product} />
    </div>
  );
}
