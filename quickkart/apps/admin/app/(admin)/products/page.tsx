import React from "react";
import ProductTable from "../../../components/products/ProductTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | KashGro Admin",
};

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your store&apos;s inventory, pricing, and visibility.
        </p>
      </div>

      <ProductTable />
    </div>
  );
}
