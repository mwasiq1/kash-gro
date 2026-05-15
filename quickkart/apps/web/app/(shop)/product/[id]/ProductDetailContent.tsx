"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import ProductGallery from "../../../../components/product/ProductGallery";
import AddToCartButton from "../../../../components/product/AddToCartButton";
import RelatedProducts from "../../../../components/product/RelatedProducts";
import { Product } from "@/types";

interface ProductDetailContentProps {
  product: Product;
}

export default function ProductDetailContent({ product }: ProductDetailContentProps) {
  const router = useRouter();
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="min-h-screen bg-white md:bg-[#F4F6FA] pb-24">
      {/* Header / Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center text-[10px] md:text-xs font-medium text-gray-500 overflow-hidden whitespace-nowrap">
          <span onClick={() => router.push("/")} className="cursor-pointer hover:text-[#1C1C1C] flex-shrink-0">Home</span>
          <ChevronRight className="w-3 h-3 mx-1 md:mx-2 flex-shrink-0" />
          <span className="truncate max-w-[100px] md:max-w-none">{product.category?.name || "Category"}</span>
          <ChevronRight className="w-3 h-3 mx-1 md:mx-2 flex-shrink-0" />
          <span className="text-[#1C1C1C] font-bold truncate max-w-[120px] md:max-w-none">{product.name}</span>
        </div>
      </div>

      {/* Mobile Header */}
      <header className="md:hidden bg-white sticky top-0 z-40 shadow-sm px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1 -ml-1 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft className="w-6 h-6 text-[#1C1C1C]" />
        </button>
        <span className="font-bold text-[#1C1C1C] truncate">{product.name}</span>
      </header>

      <main className="max-w-7xl mx-auto md:p-6">
        <div className="flex flex-col md:flex-row gap-8 bg-white md:rounded-3xl md:p-8 md:shadow-sm border border-gray-50">
          {/* Left: Gallery */}
          <div className="w-full md:w-[45%]">
            <ProductGallery images={product.images} />
          </div>

          {/* Right: Details */}
          <div className="flex-1 px-4 md:px-0 flex flex-col">
            <div className="mb-6">
              <h1 className="text-xl md:text-3xl font-extrabold text-[#1C1C1C] leading-tight mb-2">
                {product.name}
              </h1>
              <p className="text-sm md:text-base text-gray-500 font-medium">{product.unit}</p>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl font-black text-[#1C1C1C]">₹{product.price}</span>
                  {discount > 0 && (
                    <span className="text-sm md:text-base text-gray-400 line-through">₹{product.mrp}</span>
                  )}
                </div>
                <p className="text-[10px] md:text-xs text-gray-400 mt-1">(Inclusive of all taxes)</p>
              </div>
              
              {discount > 0 && (
                <div className="bg-[#F8C200] text-black text-[10px] md:text-xs font-black px-2 py-1 rounded-lg">
                  {discount}% OFF
                </div>
              )}
            </div>

            {/* Stock Alerts */}
            {product.stock === 0 ? (
              <div className="mb-6 bg-gray-50 text-gray-500 text-sm font-bold p-3 rounded-xl border border-gray-100">
                Out of Stock
              </div>
            ) : product.stock < 10 ? (
              <div className="mb-6 text-[#FF4D4D] text-sm font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#FF4D4D] rounded-full animate-pulse" />
                Only {product.stock} left in stock!
              </div>
            ) : null}

            {/* Action Area */}
            <div className="w-full md:max-w-xs mb-8">
              <AddToCartButton product={product} />
            </div>

            {/* Description */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-bold text-[#1C1C1C] mb-3 text-base md:text-lg">Product Details</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description || "No description available for this product."}
              </p>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-8 md:mt-12 bg-white md:bg-transparent md:rounded-none p-4 md:p-0">
          <RelatedProducts 
            categoryId={product.categoryId} 
            currentProductId={product.id} 
          />
        </div>
      </main>
    </div>
  );
}
