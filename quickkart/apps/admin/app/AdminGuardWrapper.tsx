"use client";

import { useAdminGuard } from "../hooks/useAdminGuard";

export default function AdminGuardWrapper({ children }: { children: React.ReactNode }) {
  const { isChecking } = useAdminGuard();

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6FA]">
        <div className="w-8 h-8 border-4 border-[#0C831F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
