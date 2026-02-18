"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/server/db";
import { ensureDbUser } from "@/server/me";

export async function deletePost(formData: FormData) {
  const postId = formData.get("postId");
  if (typeof postId !== "string") throw new Error("Invalid ID");

  const me = await ensureDbUser();

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post || post.authorId !== me.id) {
    throw new Error("Forbidden");
  }

  await prisma.post.delete({
    where: { id: postId },
  });

  revalidatePath("/dashboard");
  revalidatePath("/");
}
