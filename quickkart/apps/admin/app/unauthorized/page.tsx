import { SignOutButton } from "@clerk/nextjs";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F4F6FA] p-6 text-center">
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-8 shadow-sm">
        <ShieldAlert className="w-12 h-12 text-red-600" />
      </div>
      <h1 className="text-4xl font-black text-[#1C1C1C] mb-4">Access Denied</h1>
      <p className="text-gray-500 mb-12 max-w-md text-lg font-medium leading-relaxed">
        You do not have the required administrative permissions to access this dashboard. 
        If you believe this is an error, please contact the system administrator.
      </p>
      <div className="flex gap-4">
        <SignOutButton>
          <button className="bg-[#1C1C1C] text-white font-black px-10 py-4 rounded-2xl hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200">
            Sign Out
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
