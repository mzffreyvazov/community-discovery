// app/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/discover"]);
const isAuthRoute = createRouteMatcher(["/sign-up", "/sign-in"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // If the user isn't signed in and the route is private, redirect to sign in
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn({ returnBackUrl: "/discover" });
  }

  // If the user is logged in and tries to access auth routes (signup/signin),
  // redirect them to discover page
  if (userId && isAuthRoute(req)) {
    return NextResponse.redirect(new URL("/discover", req.url));
  }

  // Let the request continue without trying to sync with Supabase here
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};