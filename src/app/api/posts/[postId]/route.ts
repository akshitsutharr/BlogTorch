import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/server/db";
import { ensureDbUser } from "@/server/me";

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


