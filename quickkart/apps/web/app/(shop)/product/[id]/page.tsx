"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "../../../../../hooks/useCart";
import { fetchApi } from "../../../../../lib/api";
import ProductCard from "../../../../../components/product/ProductCard";
import { Minus, Plus, ArrowLeft, ChevronRight, Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  mrp: number;
  sellingPrice: number;
  unit: string;
  imageUrl: string;
  categoryId: string;
  stock: number;
  category?: { name: string };
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { items, addItem, updateQuantity } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mainImage, setMainImage] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Fetch product
        const { data: p } = await fetchApi(`/products/${id}`);
        setProduct(p);
        setMainImage(p.imageUrl);

        // Fetch related products (same category)
        const { data: allProducts } = await fetchApi(`/products`);
        const related = allProducts
          .filter((prod: Product) => prod.categoryId === p.categoryId && prod.id !== p.id)
          .slice(0, 6);
        setRelatedProducts(related);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6FA] flex flex-col p-4 animate-pulse">
        <div className="h-6 w-1/3 bg-gray-200 rounded mb-4" />
        <div className="w-full h-64 bg-gray-200 rounded-2xl mb-4" />
        <div className="h-8 w-2/3 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-1/4 bg-gray-200 rounded mb-6" />
        <div className="h-12 w-full bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F4F6FA] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-[#1C1C1C] mb-4">Product not found</h2>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-white text-[#1C1C1C] px-6 py-3 rounded-xl font-bold shadow-sm active:scale-95 transition border border-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </button>
      </div>
    );
  }

  const cartItem = items.find((i) => i.id === product.id);
  const quantity = cartItem?.quantity ?? 0;
  const discount = Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      sellingPrice: product.sellingPrice,
      unit: product.unit,
      imageUrl: product.imageUrl,
    });
  };

  // Mock multiple images for gallery since schema only has one imageUrl
  const galleryImages = [product.imageUrl, product.imageUrl, product.imageUrl];

  return (
    <div className="min-h-screen bg-[#F4F6FA] pb-24">
      {/* Header / Breadcrumb */}
      <header className="bg-white sticky top-0 z-40 shadow-sm px-4 py-3 flex items-center gap-2">
        <button onClick={() => router.back()} className="p-1 -ml-1 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft className="w-6 h-6 text-[#1C1C1C]" />
        </button>
        <div className="flex items-center text-xs font-medium text-gray-500 overflow-hidden whitespace-nowrap">
          <span onClick={() => router.push("/")} className="cursor-pointer hover:text-[#1C1C1C]">Home</span>
          <ChevronRight className="w-3 h-3 mx-1 flex-shrink-0" />
          <span className="truncate">{product.category?.name ?? "Category"}</span>
          <ChevronRight className="w-3 h-3 mx-1 flex-shrink-0" />
          <span className="text-[#1C1C1C] font-bold truncate max-w-[120px]">{product.name}</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto md:p-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Gallery */}
          <div className="md:w-1/2 flex flex-col bg-white p-4 md:rounded-2xl shadow-sm border border-gray-50">
            <div className="relative w-full aspect-square bg-[#F4F6FA] rounded-xl flex items-center justify-center mb-4 overflow-hidden">
              {discount > 0 && (
                <span className="absolute top-3 left-3 bg-[#0C831F] text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                  {discount}% OFF
                </span>
              )}
              <img src={mainImage} alt={product.name} className="w-full h-full object-contain p-4" />
            </div>
            {/* Thumbnail Row */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`w-16 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 bg-[#F4F6FA] transition ${
                    mainImage === img ? "border-[#0C831F]" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain p-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="md:w-1/2 px-4 md:px-0">
            <h1 className="text-xl md:text-2xl font-bold text-[#1C1C1C] leading-snug mb-1">
              {product.name}
            </h1>
            <p className="text-sm text-gray-500 font-medium mb-4">{product.unit}</p>

            <div className="flex items-end gap-2 mb-2">
              <span className="text-2xl font-extrabold text-[#1C1C1C]">₹{product.sellingPrice}</span>
              {discount > 0 && (
                <>
                  <span className="text-sm text-gray-400 line-through mb-1">₹{product.mrp}</span>
                  <span className="bg-[#F8C200] text-black text-xs font-bold px-1.5 py-0.5 rounded-md mb-1">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-[10px] text-gray-400 mb-6">(Inclusive of all taxes)</p>

            {product.stock < 10 && product.stock > 0 && (
              <p className="text-red-500 font-bold text-sm mb-4">
                Only {product.stock} left in stock!
              </p>
            )}
            {product.stock === 0 && (
              <p className="text-red-500 font-bold text-sm mb-4">
                Out of stock
              </p>
            )}

            {product.description && (
              <div className="mb-6">
                <h3 className="font-bold text-[#1C1C1C] mb-2 text-sm">Product Details</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Action Area */}
            <div className="mt-8">
              {quantity === 0 ? (
                <button
                  onClick={handleAdd}
                  disabled={product.stock === 0}
                  className="w-full bg-[#F8C200] text-black font-bold text-lg px-6 py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              ) : (
                <div className="flex items-center justify-between border-2 border-[#F8C200] rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="px-6 py-3.5 text-[#1C1C1C] hover:bg-gray-50 transition"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-[#1C1C1C] font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="px-6 py-3.5 text-[#1C1C1C] hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 px-4 md:px-0">
            <h2 className="text-lg font-bold text-[#1C1C1C] mb-4">
              More from {product.category?.name ?? "this category"}
            </h2>
            <div className="flex overflow-x-auto gap-3 pb-4 snap-x hide-scrollbar">
              {relatedProducts.map((p) => (
                <div key={p.id} className="w-[140px] md:w-[160px] flex-shrink-0 snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
