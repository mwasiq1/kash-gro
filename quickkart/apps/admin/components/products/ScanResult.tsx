"use client";

import React from "react";
import Image from "next/image";
import { Check, X, Search, RefreshCcw, ArrowRight, AlertTriangle } from "lucide-react";
import { ScannedProduct } from "@/lib/openfoodfacts";

interface ScanResultProps {
  result: ScannedProduct | null;
  barcode: string;
  onConfirm: () => void;
  onRetry: () => void;
  onFillManually: () => void;
}

export default function ScanResult({ 
  result, 
  barcode, 
  onConfirm, 
  onRetry, 
  onFillManually 
}: ScanResultProps) {
  if (!result) {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col items-center p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6">
            We couldn't find any product details for barcode: <span className="font-mono font-bold text-gray-900">{barcode}</span> in the Open Food Facts database.
          </p>
          
          <div className="flex flex-col w-full gap-3">
            <button
              onClick={onRetry}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#F8C200] text-black font-bold rounded-xl hover:bg-[#e5b300] transition-colors"
            >
              <RefreshCcw className="w-5 h-5" />
              Scan Again
            </button>
            <button
              onClick={onFillManually}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Fill Manually
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        <div className="p-6 bg-gradient-to-br from-[#F8C200] to-[#FFD700] flex flex-col items-center text-center">
          <div className="relative w-32 h-32 bg-white rounded-xl shadow-lg mb-4 overflow-hidden p-2 flex items-center justify-center">
            {result.imageUrl ? (
              <Image 
                src={result.imageUrl} 
                alt={result.name} 
                width={128} 
                height={128} 
                className="object-contain"
              />
            ) : (
              <Search className="w-12 h-12 text-gray-300" />
            )}
          </div>
          <h2 className="text-xl font-bold text-black">{result.name}</h2>
          <p className="text-black/60 text-sm font-medium">{result.brand || "Generic Brand"}</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fields to be filled</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Name", value: result.name },
                { label: "Unit", value: result.unit },
                { label: "Category", value: result.categoryName },
                { label: "Barcode", value: result.barcode },
              ].map((field) => (
                <div key={field.label} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{field.label}</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
            <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700 leading-relaxed">
              Price, MRP and Stock details are not available from scan and must be entered manually.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              className="flex items-center justify-center gap-2 w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-900 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Check className="w-5 h-5 text-[#F8C200]" />
              Use These Details
            </button>
            <button
              onClick={onRetry}
              className="flex items-center justify-center gap-2 w-full py-3.5 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Scan Different Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
