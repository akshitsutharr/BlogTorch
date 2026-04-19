import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { BlockRenderer } from "@/components/blocks/block-renderer";
import { getPublishedPostBySlug } from "@/server/posts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LikeButton, ShareButton } from "@/components/interactions";
import { prisma } from "@/server/db";
import { ViewTracker } from "./view-tracker";
import { CommentSection } from "./comment-section";
import { ArticleWithLoadMore } from "./article-with-load-more";
import { getRandomBannerUrl } from "@/server/banners";

export const revalidate = 60;

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

  const commentsData = await prisma.comment.findMany({
    where: { postId: post.id, parentId: null },
    include: {
      author: true,
      replies: {
        include: { author: true },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const comments = commentsData.map((c) => ({
    ...c,
    likeCount: c.likeCount ?? 0,
    hasLiked: false,
    replies: (c.replies ?? []).map((r) => ({
      ...r,
      likeCount: r.likeCount ?? 0,
      hasLiked: false,
      replies: [] as typeof r[],
    })),
  }));

  const bannerUrl = post.coverImageUrl ?? getRandomBannerUrl();

  return (
    <main className="page-shell max-w-5xl">
      {/* Notion-style banner */}
      <div className="section-shell mb-8">
        <div className="section-core relative aspect-21/9 w-full overflow-hidden">
          <Image
            src={bannerUrl}
            alt="Article banner"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />
        </div>
      </div>

      <header className="section-shell mb-8">
        <div className="section-core space-y-6 px-6 py-8 sm:px-8">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <Badge key={t.id} variant="secondary">
              {t.tag.name}
            </Badge>
          ))}
        </div>
        <h1 className="headline-display font-semibold">
          {post.title}
        </h1>
        {post.excerpt ? (
          <p className="max-w-[70ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {post.excerpt}
          </p>
        ) : null}
        
        <div className="flex flex-col gap-4 border-y border-border/60 py-4 sm:flex-row sm:items-center sm:justify-between">
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

            <div className="flex flex-wrap items-center gap-2">
               <LikeButton 
                 postId={post.id} 
                 initialLikes={post.likeCount} 
                 initialHasLiked={false}
               />
               <ShareButton title={post.title} slug={post.slug} />
            </div>
        </div>
        </div>
      </header>

      <article className="section-shell">
        <div className="section-core px-6 py-8 sm:px-8">
        <ArticleWithLoadMore
          hasMore={
            post.blocks.length > Math.max(2, Math.ceil(post.blocks.length * 0.4))
          }
        >
          <BlockRenderer
            blocks={post.blocks.slice(
              0,
              Math.max(2, Math.ceil(post.blocks.length * 0.4))
            )}
          />
          <BlockRenderer blocks={post.blocks} />
        </ArticleWithLoadMore>
        </div>
      </article>

      <CommentSection
        postId={post.id}
        slug={post.slug}
        comments={comments}
      />

      <ViewTracker postId={post.id} />
    </main>
  );
}


