"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, ShoppingBag, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Categories", href: "/categories", icon: Grid },
    { name: "Orders", href: "/orders", icon: ShoppingBag },
    { name: "Account", href: "/profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E8E8E8] pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center w-full h-full space-y-1"
            >
              <Icon 
                className={`w-6 h-6 ${isActive ? "text-[#F8C200]" : "text-[#999999]"}`} 
              />
              <span 
                className={`text-[10px] font-semibold ${isActive ? "text-[#F8C200]" : "text-[#999999]"}`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
