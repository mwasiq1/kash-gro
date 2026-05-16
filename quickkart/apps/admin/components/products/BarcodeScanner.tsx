"use client";

import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, BarcodeFormat } from "@zxing/library";
import { X, Camera, AlertCircle, Loader2 } from "lucide-react";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onCancel: () => void;
}

export default function BarcodeScanner({ onScan, onCancel }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    const formats = [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
    ];

    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;

    const startScanner = async () => {
      try {
        const videoInputDevices = await reader.listVideoInputDevices();
        
        if (videoInputDevices.length === 0) {
          setError("No camera found on this device.");
          setIsInitializing(false);
          return;
        }

        // Prefer back camera
        const backCamera = videoInputDevices.find(device => 
          device.label.toLowerCase().includes("back") || 
          device.label.toLowerCase().includes("rear") ||
          device.label.toLowerCase().includes("environment")
        );

        const deviceId = backCamera ? backCamera.deviceId : videoInputDevices[0].deviceId;

        await reader.decodeFromVideoDevice(
          deviceId,
          videoRef.current,
          (result, err) => {
            if (result) {
              onScan(result.getText());
            }
          }
        );
        
        setIsInitializing(false);
      } catch (err: any) {
        console.error("Camera Error:", err);
        if (err.name === "NotAllowedError") {
          setError("Camera permission denied. Please allow camera access.");
        } else {
          setError("Could not initialize camera.");
        }
        setIsInitializing(false);
      }
    };

    startScanner();

    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black">
      <div className="relative w-full h-full max-w-lg mx-auto flex flex-col">
        {/* Header */}
        <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-10 text-white bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#F8C200]" />
            <span className="font-bold">Scan Barcode</span>
          </div>
          <button 
            onClick={onCancel}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Feed */}
        <div className="flex-1 relative overflow-hidden bg-gray-900 flex items-center justify-center">
          {isInitializing && (
            <div className="flex flex-col items-center gap-3 text-white">
              <Loader2 className="w-10 h-10 animate-spin text-[#F8C200]" />
              <p className="text-sm">Starting camera...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-4 text-white p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500" />
              <p className="font-medium">{error}</p>
              <button 
                onClick={onCancel}
                className="px-6 py-2 bg-white text-black font-bold rounded-lg"
              >
                Go Back
              </button>
            </div>
          )}

          <video 
            ref={videoRef} 
            className={`w-full h-full object-cover ${isInitializing || error ? "hidden" : "block"}`}
          />

          {!isInitializing && !error && (
            <>
              {/* Scan Area Guides */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="relative w-72 h-48 border-2 border-white/30 rounded-2xl">
                  {/* Corner Brackets */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#F8C200] rounded-tl-lg"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#F8C200] rounded-tr-lg"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#F8C200] rounded-bl-lg"></div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#F8C200] rounded-br-lg"></div>
                  
                  {/* Animated Scan Line */}
                  <div className="absolute inset-x-0 h-0.5 bg-[#F8C200] shadow-[0_0_15px_#F8C200] animate-scan opacity-70"></div>
                </div>
              </div>
              
              <div className="absolute bottom-12 inset-x-0 text-center px-6">
                <p className="text-white/80 text-sm font-medium bg-black/40 py-2 rounded-full backdrop-blur-sm inline-block px-6">
                  Center the barcode in the frame
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
