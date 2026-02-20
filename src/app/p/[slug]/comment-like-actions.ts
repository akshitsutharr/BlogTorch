"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db";
import { ensureDbUser } from "@/server/me";

export async function toggleCommentLike(commentId: string, slug: string) {
  const me = await ensureDbUser();

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { post: true },
  });
  if (!comment || !comment.post.published) throw new Error("Comment not found");

  const existing = await prisma.commentLike.findUnique({
    where: { commentId_userId: { commentId, userId: me.id } },
  });

  if (existing) {
    await prisma.commentLike.delete({ where: { id: existing.id } });
    await prisma.comment.update({
      where: { id: commentId },
      data: { likeCount: { decrement: 1 } },
    });
  } else {
    await prisma.commentLike.create({
      data: { commentId, userId: me.id },
    });
    await prisma.comment.update({
      where: { id: commentId },
      data: { likeCount: { increment: 1 } },
    });
  }

  revalidatePath(`/p/${slug}`);
}
