"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/server/db";
import { ensureDbUser } from "@/server/me";
import { reserveSlug } from "@/server/posts";

const BlockTypeSchema = z.enum([
  "MARKDOWN",
  "CODE",
  "OUTPUT",
  "IMAGE",
  "EMBED",
  "DIVIDER",
  "CALLOUT",
]);

const BlockInputSchema = z.object({
  type: BlockTypeSchema,
  data: z.record(z.string(), z.unknown()).optional(),
});

const SaveDraftSchema = z.object({
  postId: z.string().min(1),
  title: z.string().min(1).max(200),
  excerpt: z.string().max(500).nullable(),
  blocks: z.array(BlockInputSchema).max(500),
  tags: z.array(z.string()).optional(),
});

async function resolveTags(tagNames: string[]) {
  if (!tagNames || tagNames.length === 0) return [];
  const tagIds: string[] = [];

  for (const tagName of tagNames) {
    const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    // Upsert tag outside the transaction to avoid locking/long-running tx
    const tag = await prisma.tag.upsert({
      where: { slug },
      create: { name: tagName, slug },
      update: {},
    });
    tagIds.push(tag.id);
  }
  return tagIds;
}

export async function saveDraft(input: z.infer<typeof SaveDraftSchema>) {
  const parsed = SaveDraftSchema.parse(input);
  const me = await ensureDbUser();

  const post = await prisma.post.findUnique({ where: { id: parsed.postId } });
  if (!post || post.authorId !== me.id) throw new Error("Forbidden");

  // Resolve tags outside the transaction
  const tagIds = await resolveTags(parsed.tags || []);

  // Transaction to update post and tags
  await prisma.$transaction(async (tx) => {
    // 1. Update Post basics
    await tx.post.update({
      where: { id: parsed.postId },
      data: {
        title: parsed.title,
        excerpt: parsed.excerpt,
      },
    });

    // 2. Update Blocks
    /* 
       Note: We delete all blocks and recreate them. 
       For large posts, this might be heavy, but blocks are usually < 500.
    */
    await tx.block.deleteMany({ where: { postId: parsed.postId } });
    if (parsed.blocks.length > 0) {
      await tx.block.createMany({
        data: parsed.blocks.map((b, i) => ({
          postId: parsed.postId,
          order: i,
          type: b.type,
          data: (b.data ?? {}) as Prisma.InputJsonValue,
        })),
      });
    }

    // 3. Update Tags (using pre-resolved IDs)
    await tx.postTag.deleteMany({ where: { postId: parsed.postId } });
    if (tagIds.length > 0) {
      await tx.postTag.createMany({
        data: tagIds.map((tagId) => ({
          postId: parsed.postId,
          tagId,
        })),
      });
    }
  });

  revalidatePath(`/editor/${parsed.postId}`);
  return { ok: true as const };
}

const PublishSchema = SaveDraftSchema;

export async function publishPost(input: z.infer<typeof PublishSchema>) {
  const parsed = PublishSchema.parse(input);
  const me = await ensureDbUser();

  const post = await prisma.post.findUnique({ where: { id: parsed.postId } });
  if (!post || post.authorId !== me.id) throw new Error("Forbidden");

  const newSlug = await reserveSlug(parsed.title);
  
  // Resolve tags outside the transaction
  const tagIds = await resolveTags(parsed.tags || []);

  await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: { id: parsed.postId },
      data: {
        title: parsed.title,
        excerpt: parsed.excerpt,
        slug: newSlug,
        published: true,
        publishedAt: new Date(),
      },
    });

    await tx.block.deleteMany({ where: { postId: parsed.postId } });
    if (parsed.blocks.length > 0) {
      await tx.block.createMany({
        data: parsed.blocks.map((b, i) => ({
          postId: parsed.postId,
          order: i,
          type: b.type,
          data: (b.data ?? {}) as Prisma.InputJsonValue,
        })),
      });
    }

    // Update Tags for publish as well
    await tx.postTag.deleteMany({ where: { postId: parsed.postId } });
    if (tagIds.length > 0) {
      await tx.postTag.createMany({
        data: tagIds.map((tagId) => ({
          postId: parsed.postId,
          tagId,
        })),
      });
    }
  });

  revalidatePath(`/p/${newSlug}`);
  revalidatePath(`/explore`);
  revalidatePath(`/`);
  return { ok: true as const, slug: newSlug };
}


