import "server-only";

import { Prisma } from "@prisma/client";
import { headers } from "next/headers";

import { prisma } from "@/server/db";
import { requireAuthUser } from "@/server/auth";

const TEST_BASIC_USER = process.env.TEST_BASIC_USER ?? "akshit";
const TEST_BASIC_PASS = process.env.TEST_BASIC_PASS ?? "Carban@47";
const ENABLE_TEST_BASIC = process.env.NODE_ENV !== "production";

function parseBasicAuth(
  headerValue: string | null,
): { username: string; password: string } | null {
  if (!headerValue) return null;
  const [scheme, credentials] = headerValue.split(" ");
  if (!scheme || scheme.toLowerCase() !== "basic" || !credentials) return null;
  try {
    const decoded = Buffer.from(credentials, "base64").toString("utf8");
    const [username, password] = decoded.split(":");
    if (!username || !password) return null;
    return { username, password };
  } catch {
    return null;
  }
}

async function upsertUserSafely(opts: {
  clerkId: string;
  username: string | null;
  displayName: string | null;
  imageUrl?: string | null;
  isAdmin?: boolean;
}) {
  const baseUpdate: any = {
    displayName: opts.displayName,
    imageUrl: opts.imageUrl ?? null,
    role: opts.isAdmin ? "ADMIN" : "USER",
  };
  const baseCreate: any = {
    clerkId: opts.clerkId,
    displayName: opts.displayName,
    imageUrl: opts.imageUrl ?? null,
    role: opts.isAdmin ? "ADMIN" : "USER",
  };

  if (opts.username) {
    baseUpdate.username = opts.username;
    baseCreate.username = opts.username;
  }

  try {
    return await prisma.user.upsert({
      where: { clerkId: opts.clerkId },
      update: baseUpdate,
      create: baseCreate,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      opts.username
    ) {
      // Username is taken; generate a unique variant and try once more.
      const safeUsername = `${opts.username}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

      return await prisma.user.upsert({
        where: { clerkId: opts.clerkId },
        update: {
          ...baseUpdate,
          username: safeUsername,
        },
        create: {
          ...baseCreate,
          username: safeUsername,
        },
      });
    }
    throw error;
  }
}

export async function ensureDbUser() {
  const hdrs = await headers();

  // TestSprite / local automation path: allow basic auth to act as a synthetic user
  if (ENABLE_TEST_BASIC) {
    const basic = parseBasicAuth(hdrs.get("authorization"));
    if (basic && basic.username === TEST_BASIC_USER && basic.password === TEST_BASIC_PASS) {
      const clerkId = `basic:${basic.username}`;
      const displayName = basic.username;

      return await upsertUserSafely({
        clerkId,
        username: basic.username,
        displayName,
        isAdmin: true,
      });
    }
  }

  const clerk = await requireAuthUser();
  const displayName = clerk.displayName;

  return await upsertUserSafely({
    clerkId: clerk.clerkId,
    username: clerk.username,
    displayName,
    imageUrl: clerk.imageUrl,
    isAdmin: clerk.role === "admin",
  });
}
