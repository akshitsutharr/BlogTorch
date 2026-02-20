import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { BlockRenderer } from "@/components/blocks/block-renderer";
import { getPublishedPostBySlug } from "@/server/posts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { LikeButton, ShareButton } from "@/components/interactions";
import { Button } from "@/components/ui/button";
import { ensureDbUser } from "@/server/me";
import { prisma } from "@/server/db";
import { ViewTracker } from "./view-tracker";
import { CommentSection } from "./comment-section";
import { ArticleWithLoadMore } from "./article-with-load-more";
import { getRandomBannerUrl } from "@/server/banners";
import { getAuthUser } from "@/server/auth";

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

  const [me, authUser, commentsData] = await Promise.all([
    ensureDbUser().catch(() => null),
    getAuthUser().catch(() => null),
    prisma.comment.findMany({
      where: { postId: post.id, parentId: null },
      include: {
        author: true,
        replies: {
          include: { author: true },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  // Fetch hasLiked for each comment (and reply) if user logged in
  let commentLikeIds = new Set<string>();
  if (me) {
    const allCommentIds = [
      ...commentsData.map((c) => c.id),
      ...commentsData.flatMap((c) => (c.replies ?? []).map((r) => r.id)),
    ];
    const liked = await prisma.commentLike.findMany({
      where: { userId: me.id, commentId: { in: allCommentIds } },
      select: { commentId: true },
    });
    commentLikeIds = new Set(liked.map((l) => l.commentId));
  }

  const comments = commentsData.map((c) => ({
    ...c,
    likeCount: c.likeCount ?? 0,
    hasLiked: commentLikeIds.has(c.id),
    replies: (c.replies ?? []).map((r) => ({
      ...r,
      likeCount: r.likeCount ?? 0,
      hasLiked: commentLikeIds.has(r.id),
      replies: [] as typeof r[],
    })),
  }));

  const hasLiked = me
    ? (await prisma.like.findUnique({
        where: { postId_userId: { postId: post.id, userId: me.id } },
      })) !== null
    : false;

  const bannerUrl = post.coverImageUrl ?? getRandomBannerUrl();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      {/* Notion-style banner */}
      <div className="-mx-4 mb-8 overflow-hidden rounded-2xl md:mx-0 md:rounded-3xl">
        <div className="relative aspect-[21/9] w-full bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bannerUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>

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

            <div className="flex flex-wrap items-center gap-2">
               {me && post.authorId === me.id && (
                 <Button asChild variant="outline" size="sm">
                   <Link href={`/editor/${post.id}`}>Edit</Link>
                 </Button>
               )}
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
      </article>

      <CommentSection
        postId={post.id}
        slug={post.slug}
        comments={comments}
        isSignedIn={!!authUser}
        currentUserId={me?.id}
      />

      <ViewTracker postId={post.id} />
    </main>
  );
}


