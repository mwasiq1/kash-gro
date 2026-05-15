"use client";

import React, { useCallback, useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "../../lib/utils";
import { fetchApi } from "../../lib/api";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  disabled,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploading(true);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetchApi("/upload/image", {
          method: "POST",
          body: formData,
          // Do not set Content-Type, let the browser set it with the boundary
          headers: {
            // we remove Content-Type so fetch sets multipart/form-data boundary
          },
        });

        if (response.success && response.data?.url) {
          onChange(response.data.url);
        } else {
          console.error("Upload failed:", response.error);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  return (
    <div className="w-full">
      {value ? (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
          <Image
            src={value}
            alt="Product image"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
            disabled={disabled}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label
          className={cn(
            "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
            disabled ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-300" : "hover:bg-gray-50 border-gray-300",
            isUploading && "pointer-events-none opacity-70"
          )}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 mb-3 text-gray-500 animate-spin" />
                <p className="mb-2 text-sm text-gray-500">Uploading...</p>
              </>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 mb-3 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG or WEBP (MAX. 5MB)</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={disabled || isUploading}
          />
        </label>
      )}
    </div>
  );
}
