import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Public Routes
  publicRoutes: ["/"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
