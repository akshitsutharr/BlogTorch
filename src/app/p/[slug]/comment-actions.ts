"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/server/db";
import { ensureDbUser } from "@/server/me";

const AddCommentSchema = z.object({
  postId: z.string().min(1),
  body: z.string().min(1).max(2000),
  parentId: z.string().nullable(),
});

export async function addComment(input: z.infer<typeof AddCommentSchema>) {
  const parsed = AddCommentSchema.parse(input);
  const me = await ensureDbUser();

  const post = await prisma.post.findUnique({
    where: { id: parsed.postId, published: true },
  });
  if (!post) throw new Error("Post not found");

  await prisma.comment.create({
    data: {
      postId: parsed.postId,
      authorId: me.id,
      parentId: parsed.parentId,
      body: parsed.body.trim(),
    },
  });

  await prisma.post.update({
    where: { id: parsed.postId },
    data: { commentCount: { increment: 1 } },
  });

  revalidatePath(`/p/${post.slug}`);
}
