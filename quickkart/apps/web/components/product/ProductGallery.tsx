"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

interface ProductGalleryProps {
  imageUrl?: string;
}

export default function ProductGallery({ imageUrl }: ProductGalleryProps) {
  const [imgError, setImgError] = useState(false);
  const src = imageUrl || "";

  if (!src) return (
    <div className="aspect-square w-full bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 border border-[#E8E8E8]">
      <ShoppingBag className="text-[#666666]" size={32} />
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden shadow-sm">
        {!imgError ? (
          <Image
            src={src}
            alt="Product image"
            fill
            className="object-contain p-4"
            priority
            onError={(e) => {
              e.currentTarget.src = "";
              e.currentTarget.onerror = null;
              setImgError(true);
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <ShoppingBag className="text-[#666666]" size={32} />
          </div>
        )}
      </div>
    </div>
  );
}
