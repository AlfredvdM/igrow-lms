import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/sso-callback(.*)', // OAuth callback
  '/forgot-password(.*)',
  '/api/sync(.*)', // Sync API uses bearer token auth
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/sync (cron job endpoint - bypasses Clerk entirely)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/sync).*)',
  ],
};
