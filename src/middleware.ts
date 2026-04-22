import { authMiddleware } from "@clerk/nextjs";

/**
 * Next.js only loads `middleware.ts` at the project root or `src/` root
 * (same level as `app/`). A file under `src/app/` is ignored.
 *
 * Public routes: marketing + CMS detail pages + auth flows + APIs (handlers enforce auth).
 * Everything else (e.g. /settings, /profile, /create) stays auth-gated when Clerk is used.
 */
export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/articles(.*)",
    "/stream(.*)",
    "/providers(.*)",
    "/videos(.*)",
    "/trending(.*)",
    "/search(.*)",
    "/about(.*)",
    "/spotlight(.*)",
    "/countries(.*)",
    "/curated-experiences(.*)",
    "/join-us(.*)",
    "/assistant(.*)",
    "/login(.*)",
    "/signin(.*)",
    "/register(.*)",
    "/api(.*)",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
