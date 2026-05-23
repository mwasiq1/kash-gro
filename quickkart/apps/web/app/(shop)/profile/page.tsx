"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser as useClerkUser, useClerk } from "@clerk/nextjs";
import { User, Mail, ShoppingBag, LogOut, ChevronRight, Phone, MapPin, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user: clerkUser, isLoaded: clerkLoaded, isSignedIn: clerkSignedIn } = useClerkUser();

  const [isMock, setIsMock] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mock = localStorage.getItem("mock_auth") === "true" || localStorage.getItem("mock_auth") !== "false";
    setIsMock(mock);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#F8C200] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Determine user details based on auth mode
  const isLoaded = isMock ? true : clerkLoaded;
  const isSignedIn = isMock ? true : clerkSignedIn;

  const user = isMock
    ? {
        fullName: "Wasiq Customer",
        email: "wasiq@kashgro.com",
        imageUrl: "",
      }
    : {
        fullName: clerkUser?.fullName || clerkUser?.username || "KashGro User",
        email: clerkUser?.primaryEmailAddress?.emailAddress || "",
        imageUrl: clerkUser?.imageUrl || "",
      };

  const handleSignOut = async () => {
    if (isMock) {
      localStorage.setItem("mock_auth", "false");
      window.location.reload();
    } else {
      await signOut();
      router.push("/");
    }
  };

  if (!isLoaded) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#F8C200] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#E8E8E8]">
          <User className="w-10 h-10 text-gray-300" />
        </div>
        <h1 className="text-2xl font-black text-[#1C1C1C] mb-2">My Account</h1>
        <p className="text-[#666666] mb-8 text-sm">Please sign in to view your profile and manage orders.</p>
        <Link
          href="/sign-in"
          className="block w-full bg-[#F8C200] text-[#1C1C1C] font-black py-4 rounded-2xl hover:bg-[#E6B400] transition-all text-center shadow-md shadow-yellow-100"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 pb-24">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-[#F8C200] to-[#E6B400] rounded-3xl p-6 text-[#1C1C1C] shadow-lg mb-6 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-4 translate-y-4">
          <User className="w-40 h-40" />
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative w-16 h-16 rounded-full border-2 border-white/80 overflow-hidden bg-white/20 flex items-center justify-center flex-shrink-0">
            {user.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.fullName}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <User className="w-8 h-8 text-[#1C1C1C]" />
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-black truncate leading-tight">{user.fullName}</h2>
            <p className="text-xs opacity-90 truncate mt-1 flex items-center gap-1 font-medium">
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              {user.email}
            </p>
          </div>
        </div>

        {isMock && (
          <div className="mt-4 bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase inline-block">
            Mock Auth Active
          </div>
        )}
      </div>

      {/* Menu Options */}
      <div className="bg-white rounded-3xl border border-[#E8E8E8] shadow-sm overflow-hidden mb-6">
        <Link
          href="/orders"
          className="flex items-center justify-between p-4 border-b border-[#E8E8E8] hover:bg-gray-50/50 transition active:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-[#F8C200]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1C1C1C]">My Orders</p>
              <p className="text-xs text-[#999999]">View your order history & status</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#999999]" />
        </Link>

        <div
          className="flex items-center justify-between p-4 border-b border-[#E8E8E8] opacity-60 cursor-not-allowed"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#999999]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1C1C1C]">Saved Addresses</p>
              <p className="text-xs text-[#999999]">Manage delivery locations</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#999999]" />
        </div>

        <div
          className="flex items-center justify-between p-4 opacity-60 cursor-not-allowed"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#999999]">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1C1C1C]">Favorites</p>
              <p className="text-xs text-[#999999]">Your most frequently ordered items</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#999999]" />
        </div>
      </div>

      {/* Support Details */}
      <div className="bg-white rounded-3xl border border-[#E8E8E8] shadow-sm p-5 mb-6">
        <h3 className="text-xs font-bold text-[#999999] uppercase tracking-wider mb-3">Support & Help</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-[#1C1C1C]">
            <Phone className="w-4 h-4 text-[#666666]" />
            <span className="font-semibold">+91 98765 43210</span>
          </div>
          <p className="text-xs text-[#999999] pl-7">Available 24/7 for order and delivery assistance.</p>
        </div>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="w-full bg-[#D0190A]/10 text-[#D0190A] hover:bg-[#D0190A]/20 font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition active:scale-[0.98]"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
}
