import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import CartDrawer from "../components/cart/CartDrawer";

import BottomNav from "../components/layout/BottomNav";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Kash Gro",
    default: "Kash Gro | Delivered in minutes",
  },
  description: "India's fastest 10-minute grocery and essentials delivery platform.",
};

export const viewport = {
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} ${plusJakartaSans.className} bg-[#F4F6FA] text-[#1C1C1C] antialiased`}>
        <ClerkProvider>
          <header className="fixed top-0 left-0 right-0 z-[100] px-4 py-2 bg-white border-b border-[#E8E8E8] flex items-center justify-between">
            <h1 className="font-extrabold text-[#F8C200]">KashGro</h1>
            <div className="flex items-center gap-3">
              <Show when="signed-out">
                <SignInButton />
                <SignUpButton />
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </header>
          <div className="pt-[50px] pb-[64px] md:pb-0">
            {children}
          </div>
          {/* Global cart UI — persists across all pages, powered by Zustand */}
          <CartDrawer />
          <div className="md:hidden">
            <BottomNav />
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
// Triggering Next.js re-compilation after manual file edits.

