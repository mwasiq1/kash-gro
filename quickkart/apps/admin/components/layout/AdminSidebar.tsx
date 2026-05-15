"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingBag, 
  Database, 
  Image as ImageIcon, 
  TicketPercent, 
  BarChart3,
  ChevronLeft,
  Menu
} from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Package, label: "Products", href: "/products" },
  { icon: Layers, label: "Categories", href: "/categories" },
  { icon: ShoppingBag, label: "Orders", href: "/orders" },
  { icon: Database, label: "Inventory", href: "/inventory" },
  { icon: ImageIcon, label: "Banners", href: "/banners" },
  { icon: TicketPercent, label: "Promo Codes", href: "/promo-codes" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div 
      className={cn(
        "h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 relative",
        isCollapsed ? "w-20" : "w-60"
      )}
    >
      <div className="p-6 flex items-center justify-between mb-8">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#F8C200] rounded-lg flex items-center justify-center">
              <span className="font-black text-xs">KG</span>
            </div>
            <h1 className="text-xl font-black text-[#1C1C1C]">Admin</h1>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-[#F8C200] text-[#1C1C1C] shadow-lg shadow-yellow-100" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-[#1C1C1C]"
              )}
            >
              <item.icon size={22} className={cn(isActive ? "text-[#1C1C1C]" : "group-hover:text-[#1C1C1C]")} />
              {!isCollapsed && (
                <span className="font-bold text-sm">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gray-50">
        {!isCollapsed && (
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest text-center">
            KashGro v1.0.0
          </p>
        )}
      </div>
    </div>
  );
}
