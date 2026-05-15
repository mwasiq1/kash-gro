"use client";

import React, { useState } from "react";
import { X, Upload, Download, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Papa from "papaparse";
import { fetchApi } from "../../lib/api";

interface BulkUpdateModalProps {
  onClose: () => void;
  onSuccess: () => void;
  data: any[]; // Current inventory data for template/export
}

export default function BulkUpdateModal({ onClose, onSuccess, data }: BulkUpdateModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{ success: number; failed: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const downloadTemplate = () => {
    const csvData = data.map((item) => ({
      id: item.id,
      name: item.name,
      stock: item.stock,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `inventory_template_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setResults(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as any[];
        let successCount = 0;
        let failedCount = 0;

        for (const row of rows) {
          if (!row.id || row.stock === undefined) {
            failedCount++;
            continue;
          }

          try {
            const res = await fetchApi(`/admin/inventory/${row.id}`, {
              method: "PATCH",
              body: JSON.stringify({ stock: Number(row.stock) }),
            });

            if (res.success) {
              successCount++;
            } else {
              failedCount++;
            }
          } catch (err) {
            failedCount++;
          }
        }

        setResults({ success: successCount, failed: failedCount });
        setIsProcessing(false);
        if (successCount > 0) {
          onSuccess();
        }
      },
      error: (err) => {
        setError("Failed to parse CSV file. Please check the format.");
        setIsProcessing(false);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Bulk Stock Update</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 rounded-xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-bold mb-1">How it works:</p>
              <ol className="list-decimal ml-4 space-y-1">
                <li>Download the current inventory CSV template.</li>
                <li>Update the <strong>stock</strong> column in Excel/Sheets.</li>
                <li>Upload the saved CSV file here to apply changes.</li>
              </ol>
            </div>
          </div>

          <button
            onClick={downloadTemplate}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-xl hover:border-[#F8C200] hover:bg-yellow-50 transition-all text-sm font-bold text-gray-600 hover:text-[#B88E00]"
          >
            <Download className="w-4 h-4" />
            Download CSV Template
          </button>

          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isProcessing}
              className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className={`flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-xl transition-all ${
              isProcessing ? "bg-gray-50 border-gray-100" : "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
            }`}>
              {isProcessing ? (
                <>
                  <Loader2 className="w-8 h-8 text-[#F8C200] animate-spin mb-2" />
                  <p className="text-sm font-bold text-gray-600">Processing updates...</p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm font-bold text-gray-600">Click or drag CSV to upload</p>
                  <p className="text-xs text-gray-400 mt-1">Updates will be applied instantly</p>
                </>
              )}
            </div>
          </div>

          {results && (
            <div className={`p-4 rounded-xl flex items-center gap-3 ${results.failed === 0 ? "bg-green-50 text-green-800" : "bg-orange-50 text-orange-800"}`}>
              {results.failed === 0 ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-orange-600" />
              )}
              <div className="text-sm">
                <p className="font-bold">Update Complete</p>
                <p>{results.success} products updated successfully. {results.failed} failed.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-800 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
