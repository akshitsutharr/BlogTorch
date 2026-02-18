import "server-only";

import { prisma } from "@/server/db";

type ClerkWebhookUser = {
  id: string;
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  image_url?: string | null;
  public_metadata?: Record<string, unknown> | null;
};

function roleFromMetadata(
  metadata: Record<string, unknown> | null | undefined,
): "ADMIN" | "USER" {
  const raw = typeof metadata?.role === "string" ? metadata.role.toLowerCase() : "";
  return raw === "admin" ? "ADMIN" : "USER";
}

export async function upsertUserFromClerkWebhook(user: ClerkWebhookUser) {
  const displayName =
    [user.first_name, user.last_name].filter(Boolean).join(" ") || null;

  return await prisma.user.upsert({
    where: { clerkId: user.id },
    update: {
      username: user.username ?? null,
      displayName,
      imageUrl: user.image_url ?? null,
      role: roleFromMetadata(user.public_metadata),
    },
    create: {
      clerkId: user.id,
      username: user.username ?? null,
      displayName,
      imageUrl: user.image_url ?? null,
      role: roleFromMetadata(user.public_metadata),
    },
  });
}

export async function deleteUserByClerkId(clerkId: string) {
  return await prisma.user.deleteMany({ where: { clerkId } });
}


