import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/editor(.*)",
  "/dashboard(.*)",
  "/settings(.*)",
]);

const TEST_BASIC_USER = process.env.TEST_BASIC_USER ?? "akshit";
const TEST_BASIC_PASS = process.env.TEST_BASIC_PASS ?? "Carban@47";
const ENABLE_TEST_BASIC = process.env.NODE_ENV !== "production";

function isTestBasicAuthHeader(headerValue: string | null): boolean {
  if (!ENABLE_TEST_BASIC || !headerValue) return false;
  const [scheme, credentials] = headerValue.split(" ");
  if (!scheme || scheme.toLowerCase() !== "basic" || !credentials) return false;
  try {
    const decoded = Buffer.from(credentials, "base64").toString("utf8");
    const [username, password] = decoded.split(":");
    return username === TEST_BASIC_USER && password === TEST_BASIC_PASS;
  } catch {
    return false;
  }
}

export default clerkMiddleware(async (auth, req) => {
  const authHeader = req.headers.get("authorization");

  // In non-production environments, allow a special basic auth user to bypass Clerk
  // so black-box tests (like TestSprite) can exercise protected routes.
  if (isProtectedRoute(req) && isTestBasicAuthHeader(authHeader)) {
    return;
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Run middleware on all routes except static files and Next internals.
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};


