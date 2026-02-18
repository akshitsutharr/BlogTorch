import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";

export type AppRole = "user" | "admin";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeRole(value: unknown): AppRole {
  const v = typeof value === "string" ? value.toLowerCase() : "";
  if (v === "admin") return "admin";
  return "user";
}

export async function getAuthUser() {
  const clerk = await currentUser();
  if (!clerk) return null;

  const publicMetadata = isRecord(clerk.publicMetadata)
    ? clerk.publicMetadata
    : undefined;

  return {
    clerkId: clerk.id,
    email:
      clerk.emailAddresses?.find((e) => e.id === clerk.primaryEmailAddressId)
        ?.emailAddress ??
      clerk.emailAddresses?.[0]?.emailAddress ??
      null,
    imageUrl: clerk.imageUrl ?? null,
    displayName:
      [clerk.firstName, clerk.lastName].filter(Boolean).join(" ") ||
      clerk.username ||
      null,
    username: clerk.username ?? null,
    role: normalizeRole(publicMetadata?.role),
  };
}

export type AuthUser = Awaited<ReturnType<typeof getAuthUser>>;

export async function requireAuthUser(): Promise<NonNullable<AuthUser>> {
  const u = await getAuthUser();
  if (!u) {
    // Clerk will generally redirect on protected routes; this is for server actions.
    throw new Error("Unauthorized");
  }
  return u;
}

export async function getAuthRole(): Promise<AppRole | null> {
  const u = await getAuthUser();
  if (u) return u.role;

  // Fallback: session claims (useful for API routes where currentUser may be absent)
  const a = await auth();
  const claimsUnknown = (a as { sessionClaims?: unknown }).sessionClaims;
  const claims = isRecord(claimsUnknown) ? claimsUnknown : null;
  const publicMetadata =
    claims && isRecord(claims.publicMetadata) ? claims.publicMetadata : null;
  const metadata = claims && isRecord(claims.metadata) ? claims.metadata : null;

  const fromClaims = publicMetadata?.role ?? metadata?.role ?? null;
  return fromClaims ? normalizeRole(fromClaims) : null;
}

export async function requireRole(required: AppRole) {
  const role = await getAuthRole();
  if (required === "admin" && role !== "admin") {
    throw new Error("Forbidden");
  }
}


