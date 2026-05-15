import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KashGro | Admin Dashboard",
  description: "Administrative control panel for KashGro quick commerce.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${jakarta.className} bg-[#F4F6FA] text-[#1C1C1C] antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
