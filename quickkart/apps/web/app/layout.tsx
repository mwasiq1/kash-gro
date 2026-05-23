import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import CartDrawer from "../components/cart/CartDrawer";
import CartBottomSheet from "../components/cart/CartBottomSheet";
import Navbar from "../components/layout/Navbar";
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
          <Navbar />
          <div className="pt-[60px] pb-[140px] md:pb-0">
            {children}
          </div>
          {/* Global cart UI — persists across all pages, powered by Zustand */}
          <CartDrawer />
          <CartBottomSheet />
          <div className="md:hidden">
            <BottomNav />
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
