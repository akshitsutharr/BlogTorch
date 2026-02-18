import "server-only";

import { nanoid } from "nanoid";

import { prisma } from "@/server/db";

async function withDbFallback<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error("Database query failed", error);
    return fallback;
  }
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export async function listPublishedPosts(limit = 12, query?: string) {
  const where: import("@prisma/client").Prisma.PostWhereInput = {
    published: true,
  };

  if (query) {
    const search = query.trim();
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        {
          author: {
            OR: [
              { username: { contains: search, mode: "insensitive" } },
              { displayName: { contains: search, mode: "insensitive" } },
            ],
          },
        },
        // Also search in tags
        {
           tags: {
             some: {
               tag: {
                 name: { contains: search, mode: "insensitive" }
               }
             }
           }
        }
      ];
    }
  }

  return await withDbFallback(
    () =>
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        take: limit,
        include: {
          author: true,
          tags: { include: { tag: true } },
        },
      }),
    [],
  );
}

export async function getPublishedPostBySlug(slug: string) {
  return await withDbFallback(
    () =>
      prisma.post.findFirst({
        where: { slug, published: true },
        include: {
          author: true,
          tags: { include: { tag: true } },
          blocks: { orderBy: { order: "asc" } },
        },
      }),
    null,
  );
}

export async function createDraftPostForAuthor(authorId: string) {
  const slug = `draft-${nanoid(10)}`;
  return await prisma.post.create({
    data: {
      slug,
      title: "Untitled",
      excerpt: null,
      authorId,
      published: false,
      blocks: {
        create: [
          {
            order: 0,
            type: "MARKDOWN",
            data: { markdown: "## Start writing…\n\nTell the story behind the code." },
          },
        ],
      },
    },
  });
}

export async function reserveSlug(title: string) {
  const base = slugify(title) || "post";
  const exists = await prisma.post.findFirst({ where: { slug: base } });
  if (!exists) return base;
  return `${base}-${nanoid(6)}`;
}


