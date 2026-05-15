"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { fetchApi } from "@/lib/api";

export function useAdminGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    
    // Don't run on public auth routes or unauthorized page
    if (pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up") || pathname === "/unauthorized") {
      setIsChecking(false);
      return;
    }

    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    async function checkRole() {
      try {
        const token = await getToken();
        const res = await fetchApi("/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.user?.role !== "ADMIN") {
          router.push("/unauthorized");
        }
      } catch (err) {
        console.error("Error checking role:", err);
        router.push("/unauthorized");
      } finally {
        setIsChecking(false);
      }
    }

    checkRole();
  }, [isLoaded, isSignedIn, pathname]);

  return { isChecking };
}
