"use client";

import { useClerk } from "@clerk/nextjs";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = () => {
    signOut(() => router.push("/sign-in"));
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
        <Lock className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-[#1C1C1C] mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-8">This area is for admins only.</p>
        
        <button
          onClick={handleSignOut}
          className="bg-[#0C831F] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#0a6b19] transition active:scale-95"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
