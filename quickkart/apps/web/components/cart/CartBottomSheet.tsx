"use client";

import { ShoppingBag, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../../hooks/useCart";

export default function CartBottomSheet() {
  const { isMounted, items, cartTotal, itemCount } = useCart();
  const pathname = usePathname();

  // Hide bottom checkout bar on checkout, order-confirmed, product detail, and order tracking pages
  if (
    pathname === "/checkout" ||
    pathname === "/order-confirmed" ||
    pathname?.startsWith("/product/") ||
    (pathname?.startsWith("/orders/") && pathname !== "/orders")
  ) {
    return null;
  }

  if (!isMounted || items.length === 0) return null;

  return (
    <div className="fixed bottom-[64px] left-0 right-0 z-40 px-3 pb-3 pointer-events-none">
      <div className="pointer-events-auto max-w-lg mx-auto bg-[#F8C200] rounded-2xl shadow-xl overflow-hidden">
        <Link
          href="/checkout"
          className="w-full flex items-center justify-between px-5 py-4 active:opacity-90 transition"
        >
          {/* Left side: "{count} items · ₹{total}" */}
          <div className="flex items-center gap-2 text-[#1C1C1C] font-extrabold text-sm">
            <ShoppingBag className="w-4 h-4" />
            <span>
              {itemCount} {itemCount === 1 ? "item" : "items"} · ₹{cartTotal.toFixed(0)}
            </span>
          </div>

          {/* Right side: "Proceed to Checkout →" */}
          <div className="flex items-center gap-0.5 text-[#1C1C1C] font-extrabold text-sm">
            <span>Proceed to Checkout</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </div>
        </Link>
      </div>
    </div>
  );
}
