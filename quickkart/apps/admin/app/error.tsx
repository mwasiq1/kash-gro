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
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#F4F6FA]">
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
