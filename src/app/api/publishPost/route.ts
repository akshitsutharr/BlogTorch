import { NextResponse } from "next/server";

import { publishPost } from "@/app/editor/[postId]/actions";

type IncomingBlock = {
  type?: string;
  content?: string;
  language?: string;
  url?: string;
  alt?: string;
};

function normalizeBlocks(blocks: IncomingBlock[]) {
  return (blocks ?? []).map((b) => {
    const t = (b.type ?? "").toLowerCase();

    if (t === "markdown") {
      return {
        type: "MARKDOWN" as const,
        data: { markdown: b.content ?? "" },
      };
    }

    if (t === "code") {
      return {
        type: "CODE" as const,
        data: {
          language: b.language ?? "text",
          code: b.content ?? "",
        },
      };
    }

    if (t === "image") {
      return {
        type: "IMAGE" as const,
        data: {
          url: b.url ?? "",
          alt: b.alt ?? "",
        },
      };
    }

    if (t === "embed") {
      return {
        type: "EMBED" as const,
        data: {
          url: b.url ?? "",
        },
      };
    }

    if (t === "callout") {
      return {
        type: "CALLOUT" as const,
        data: {
          tone: "info",
          title: "Note",
          markdown: b.content ?? "",
        },
      };
    }

    return {
      type: "MARKDOWN" as const,
      data: { markdown: b.content ?? "" },
    };
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      postId?: string;
      blocks?: IncomingBlock[];
      metadata?: {
        title?: string;
        description?: string;
      };
    };

    const postId = body.postId ?? "";
    const title = (body.metadata?.title ?? "Untitled").toString();
    const excerpt =
      typeof body.metadata?.description === "string"
        ? body.metadata.description
        : null;

    const normalizedBlocks = normalizeBlocks(body.blocks ?? []);

    const result = await publishPost({
      postId,
      title,
      excerpt,
      blocks: normalizedBlocks,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500 },
    );
  }
}


