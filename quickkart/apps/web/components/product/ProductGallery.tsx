"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images && images.length > 0 ? images[0] : "");
  const [imgError, setImgError] = useState(false);

  if (!images || images.length === 0 || !selectedImage) return (
    <div className="aspect-square w-full bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 border border-[#E8E8E8]">
      No image available
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden shadow-sm">
        {!imgError ? (
          <Image
            src={selectedImage}
            alt="Product image"
            fill
            className="object-contain p-4"
            priority
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-xs text-gray-400 font-bold">Image failed to load</span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedImage(img);
                setImgError(false);
              }}
              className={`relative w-20 h-20 flex-shrink-0 rounded-xl border-2 transition-all ${
                selectedImage === img
                  ? "border-[#F8C200] shadow-md"
                  : "border-[#E8E8E8] hover:border-[#E8E8E8]"
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
      )}
    </div>
  );
}
