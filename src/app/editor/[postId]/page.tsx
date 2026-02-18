import { notFound } from "next/navigation";

import { EditorClient } from "@/app/editor/[postId]/editor-client";
import { ensureDbUser } from "@/server/me";
import { prisma } from "@/server/db";

export default async function Page({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  if (!postId) {
    notFound();
  }

  const me = await ensureDbUser();
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      blocks: { orderBy: { order: "asc" } },
      tags: { include: { tag: true } },
    },
  });

  if (!post || post.authorId !== me.id) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <p className="mb-3 text-xs text-muted-foreground">
        updatedAt: {post.updatedAt.toISOString()}
      </p>
      <EditorClient
        post={{
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
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

