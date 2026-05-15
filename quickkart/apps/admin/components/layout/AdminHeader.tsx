"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";

export default function AdminHeader() {
  const pathname = usePathname();
  const { user } = useUser();

  const getPageTitle = (path: string) => {
    const segment = path.split("/").pop();
    if (!segment || segment === "dashboard") return "Overview";
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ");
  };

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
      <div>
        <h2 className="text-2xl font-black text-[#1C1C1C] tracking-tight">
          {getPageTitle(pathname)}
        </h2>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
          Welcome back, {user?.firstName || "Admin"}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 group focus-within:border-[#F8C200] transition-all">
          <Search size={18} className="text-gray-400 group-focus-within:text-[#1C1C1C]" />
          <input 
            type="text" 
            placeholder="Search dashboard..." 
            className="bg-transparent border-none outline-none text-sm ml-2 font-medium w-48"
          />
        </div>

        <button className="relative p-2.5 hover:bg-gray-50 rounded-xl transition-colors">
          <Bell size={20} className="text-gray-500" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-[#1C1C1C] leading-none">
              {user?.fullName || "Administrator"}
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
              Store Manager
            </p>
          </div>
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: "w-10 h-10 border-2 border-white shadow-sm"
              }
            }}
          />
        </div>
      </div>
    </header>
  );
}
