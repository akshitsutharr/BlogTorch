import { notFound, redirect } from "next/navigation";

import { EditorClient } from "@/app/editor/[postId]/editor-client";
import { ensureDbUser } from "@/server/me";
import { prisma } from "@/server/db";
import { getAuthUser } from "@/server/auth";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  if (!postId) {
    notFound();
  }

  const authUser = await getAuthUser();
  if (!authUser) {
    redirect("/sign-in");
  }

  const me = await ensureDbUser(authUser);
  
  let post;
  try {
    post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        blocks: { orderBy: { order: "asc" } },
        tags: { include: { tag: true } },
      },
    });
  } catch (error) {
    console.error("Failed to fetch post:", error);
    redirect("/dashboard");
  }

  if (!post || post.authorId !== me.id) notFound();

  return (
    <main className="page-shell max-w-7xl">
      <EditorClient
        post={{
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          coverImageUrl: post.coverImageUrl,
          published: post.published,
          tags: post.tags.map((t) => t.tag.name),
          blocks: post.blocks.map((b) => ({
            id: b.id,
            type: b.type,
            data: b.data,
          })),
        }}
      />
    </main>
  );
}

