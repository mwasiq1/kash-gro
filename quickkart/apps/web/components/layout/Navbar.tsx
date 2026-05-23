"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { SignInButton, UserButton, Show } from "@clerk/nextjs";
import SearchBar from "../product/SearchBar";

export default function Navbar() {
  const { itemCount, openCart } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-[60px] px-4 bg-white border-b border-[#E8E8E8] flex items-center justify-between">
      <Link href="/" className="font-extrabold text-xl text-[#F8C200] hover:opacity-90 transition-opacity">
        KashGro
      </Link>

      {/* Search Bar - hidden on mobile, visible on desktop */}
      <div className="hidden md:block w-full max-w-md mx-4">
        <SearchBar />
      </div>
      
      {/* Right side controls */}
      <div className="flex items-center gap-3">
        {/* Cart Icon & Badge */}
        <button
          onClick={openCart}
          className="relative p-2 text-[#1C1C1C] hover:text-[#F8C200] transition min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Cart"
        >
          <ShoppingCart className="w-6 h-6" />
          {itemCount > 0 && (
            <span className="absolute top-0.5 right-0.5 min-w-[20px] h-5 bg-[#F8C200] text-[#1C1C1C] text-[10px] font-extrabold rounded-full flex items-center justify-center px-1 border-2 border-white">
              {itemCount}
            </span>
          )}
        </button>

        {/* User Avatar */}
        <div className="flex items-center">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-xs font-bold px-4 py-2 bg-[#F8C200] text-black rounded-full hover:bg-[#E6B400] transition min-h-[44px]">
                Sign In
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}
