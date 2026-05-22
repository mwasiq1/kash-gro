import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/products(.*)", "/categories(.*)", "/orders(.*)", "/inventory(.*)", "/banners(.*)", "/promo-codes(.*)", "/analytics(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (process.env.NODE_ENV === "development") {
    return;
  }
  
  if (isProtectedRoute(request)) {
    const authObj = await auth();
    const userId = authObj.userId;
    if (!userId) {
      const signInUrl = new URL("/sign-in", request.url);
      return NextResponse.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
