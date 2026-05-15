import React from "react";
import ProductForm from "../../../../components/products/ProductForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Product | KashGro Admin",
};

export default function NewProductPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a new product listing in your catalog.
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
