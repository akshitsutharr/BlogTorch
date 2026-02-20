"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db";
import { ensureDbUser } from "@/server/me";

export async function toggleBookmark(postId: string) {
  const me = await ensureDbUser();

  const post = await prisma.post.findUnique({
    where: { id: postId, published: true },
  });
  if (!post) throw new Error("Post not found");

  const existing = await prisma.bookmark.findUnique({
    where: { postId_userId: { postId, userId: me.id } },
  });

  if (existing) {
    await prisma.bookmark.delete({
      where: { id: existing.id },
    });
    revalidatePath("/saved");
    revalidatePath("/");
    revalidatePath("/explore");
    return { bookmarked: false };
  } else {
    await prisma.bookmark.create({
      data: { postId, userId: me.id },
    });
    revalidatePath("/saved");
    revalidatePath("/");
    revalidatePath("/explore");
    return { bookmarked: true };
  }
}
