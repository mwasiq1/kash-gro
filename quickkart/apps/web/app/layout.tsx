import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import CartBottomSheet from "../components/cart/CartBottomSheet";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KashGro — Groceries in 10 Minutes",
  description: "Blinkit-style quick commerce app for groceries delivered in 10 minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.className} bg-[#F4F6FA] text-[#1C1C1C] antialiased`}>
        <ClerkProvider>
          <header className="fixed top-0 left-0 right-0 z-[100] px-4 py-2 bg-white shadow-sm flex items-center justify-between">
            <h1 className="font-extrabold text-[#0C831F]">KashGro</h1>
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
          <div className="pt-[50px]">
            {children}
          </div>
          {/* Global cart UI — persists across all pages, powered by Zustand */}
          <CartBottomSheet />
        </ClerkProvider>
      </body>
    </html>
  );
}
