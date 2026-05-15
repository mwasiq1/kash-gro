import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchApi } from "../../lib/api";

interface RoleGuardProps {
  children: React.ReactNode;
}

export default async function RoleGuard({ children }: RoleGuardProps) {
  const { userId, getToken } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  try {
    const token = await getToken();
    const response = await fetchApi("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.success || response.data.role !== "ADMIN") {
      return redirect("/unauthorized");
    }
  } catch (error) {
    console.error("Role Guard Error:", error);
    return redirect("/unauthorized");
  }

  return <>{children}</>;
}
