"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, ShoppingBag, User, ShoppingCart } from "lucide-react";
import { useCart } from "../../hooks/useCart";

export default function BottomNav() {
  const pathname = usePathname();
  const { openCart, itemCount } = useCart();

  // Hide bottom nav on checkout, order-confirmed, product detail, and order tracking detail pages
  if (
    pathname === "/checkout" ||
    pathname === "/order-confirmed" ||
    pathname?.startsWith("/product/") ||
    (pathname?.startsWith("/orders/") && pathname !== "/orders")
  ) {
    return null;
  }

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Categories", href: "/categories", icon: Grid },
    { name: "Cart", href: "#", icon: ShoppingCart, isCart: true },
    { name: "Orders", href: "/orders", icon: ShoppingBag },
    { name: "Account", href: "/profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E8E8E8] pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = !item.isCart && (pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href)));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => {
                if (item.isCart) {
                  e.preventDefault();
                  openCart();
                }
              }}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
            >
              <div className="relative">
                <Icon 
                  className={`w-6 h-6 ${isActive ? "text-[#F8C200]" : "text-[#666666]"}`} 
                />
                {item.isCart && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#F8C200] text-[#1C1C1C] text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 border border-white">
                    {itemCount}
                  </span>
                )}
              </div>
              <span 
                className={`text-[10px] font-semibold ${isActive ? "text-[#F8C200]" : "text-[#666666]"}`}
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
