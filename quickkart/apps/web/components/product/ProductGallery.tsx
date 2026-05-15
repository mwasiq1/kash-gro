"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <Image
          src={selectedImage}
          alt="Product image"
          fill
          className="object-contain p-4"
          priority
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className={`relative w-20 h-20 flex-shrink-0 rounded-xl border-2 transition-all ${
              selectedImage === img
                ? "border-[#F8C200] shadow-md"
                : "border-gray-100 hover:border-gray-200"
            } bg-white overflow-hidden`}
          >
            <Image
              src={img}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-contain p-1"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
