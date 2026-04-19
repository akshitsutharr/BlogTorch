import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/server/db";
import { ensureDbUser } from "@/server/me";
import { getPublishedPostBySlug } from "@/server/posts";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> },
) {
  try {
    const { postId } = await context.params;
    const slug = req.nextUrl.searchParams.get("slug");

    const post = slug
      ? await getPublishedPostBySlug(slug)
      : await prisma.post.findFirst({
          where: { id: postId, published: true },
          include: {
            author: true,
            tags: { include: { tag: true } },
          },
        });

    if (!post) {
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404 },
      );
    }

    return NextResponse.json(post, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ postId: string }> },
) {
  try {
    const me = await ensureDbUser();
    const { postId } = await context.params;

    const result = await prisma.post.deleteMany({
      where: { id: postId, authorId: me.id },
    });

    if (result.count === 0) {
      return NextResponse.json({ ok: false }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}


