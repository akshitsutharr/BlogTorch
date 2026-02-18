import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { BlockRenderer } from "@/components/blocks/block-renderer";
import { getPublishedPostBySlug } from "@/server/posts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LikeButton, ShareButton } from "@/components/interactions";
import { ensureDbUser } from "@/server/me";
import { prisma } from "@/server/db";
import { ViewTracker } from "./view-tracker";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPublishedPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  // Check if current user liked
  const me = await ensureDbUser().catch(() => null); // Allow viewing without login
  const hasLiked = me
    ? (await prisma.like.findUnique({
        where: { postId_userId: { postId: post.id, userId: me.id } },
      })) !== null
    : false;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <header className="mb-8 space-y-6">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <Badge key={t.id} variant="secondary">
              {t.tag.name}
            </Badge>
          ))}
        </div>
        <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
          {post.title}
        </h1>
        {post.excerpt ? (
          <p className="text-pretty text-lg leading-8 text-muted-foreground">
            {post.excerpt}
          </p>
        ) : null}
        
        <div className="flex items-center justify-between border-y border-border/60 py-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={post.author.imageUrl ?? ""} />
                <AvatarFallback>{post.author.username?.[0]?.toUpperCase() ?? "A"}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium text-foreground">
                 {post.author.displayName ?? post.author.username ?? "Author"}
                </p>
                <p className="text-muted-foreground">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Draft"} · {post.viewCount} views
                </p>
              </div>
            </div>

            <div className="flex gap-2">
               <LikeButton 
                 postId={post.id} 
                 initialLikes={post.likeCount} 
                 initialHasLiked={hasLiked} 
               />
               <ShareButton title={post.title} slug={post.slug} />
            </div>
        </div>
      </header>

      <article className="space-y-8">
        <BlockRenderer blocks={post.blocks} />
      </article>
      <ViewTracker postId={post.id} />
    </main>
  );
}


