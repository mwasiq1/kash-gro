"use client";

import React, { useCallback, useState } from "react";
import { UploadCloud, X, Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { cn } from "../../lib/utils";
import { fetchApi } from "@/lib/api";

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
  maxFiles?: number;
}

export default function MultiImageUpload({
  value = [],
  onChange,
  disabled,
  maxFiles = 5,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      setIsUploading(true);

      const newUrls = [...value];
      
      for (let i = 0; i < files.length; i++) {
        if (newUrls.length >= maxFiles) break;
        
        const formData = new FormData();
        formData.append("image", files[i]);

        try {
          const response = await fetchApi("/upload/image", {
            method: "POST",
            body: formData,
            headers: {},
          });

          if (response.success && response.data?.url) {
            newUrls.push(response.data.url);
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }

      onChange(newUrls);
      setIsUploading(false);
    },
    [onChange, value, maxFiles]
  );

  const removeImage = (urlToRemove: string) => {
    onChange(value.filter((url) => url !== urlToRemove));
  };

  return (
    <div className="space-y-4 w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {value.map((url, index) => (
          <div key={url + index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group">
            <Image
              src={url}
              alt={`Image ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              disabled={disabled}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        
        {value.length < maxFiles && (
          <label
            className={cn(
              "flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-xl cursor-pointer transition-all",
              disabled ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200" : "hover:bg-gray-50 hover:border-[#F8C200] border-gray-200",
              isUploading && "pointer-events-none opacity-70"
            )}
          >
            <div className="flex flex-col items-center justify-center py-4">
              {isUploading ? (
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
              ) : (
                <>
                  <Plus className="w-6 h-6 text-gray-400 mb-1" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Add Image</p>
                </>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={disabled || isUploading}
            />
          </label>
        )}
      </div>
      {value.length === 0 && !isUploading && (
        <p className="text-xs text-gray-400 text-center italic">No images uploaded yet</p>
      )}
    </div>
  );
}
