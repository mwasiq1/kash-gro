"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-white">
      <h2 className="text-xl font-bold text-[#1C1C1C] mb-4">Something went wrong!</h2>
      <p className="text-red-500 bg-red-50 p-4 rounded-xl border border-red-100 max-w-lg mb-6 break-words text-sm font-medium">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-[#F8C200] text-black font-bold rounded-xl hover:bg-[#e6b400] transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
