import Link from "next/link";
import { Bookmark } from "lucide-react";

import { BlogCard } from "@/components/blog-card";
import { getBannerForPost } from "@/server/banners";
import { prisma } from "@/server/db";
import { ensureDbUser } from "@/server/me";
import { getAuthUser } from "@/server/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const authUser = await getAuthUser();
  if (!authUser) redirect("/sign-in");

  const me = await ensureDbUser(authUser);

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: me.id },
    include: {
      post: {
        include: {
          author: true,
          tags: { include: { tag: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const posts = bookmarks
    .map((b) => b.post)
    .filter((p): p is NonNullable<typeof p> => p !== null && p.published);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
          <Bookmark className="size-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Saved</h1>
          <p className="text-sm text-muted-foreground">
            {posts.length} {posts.length === 1 ? "post" : "posts"} saved
          </p>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 bg-muted/30 px-8 py-16 text-center">
          <Bookmark className="mx-auto mb-4 size-12 text-muted-foreground/50" />
          <h2 className="mb-2 font-semibold">No saved posts yet</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Save posts you want to read later by clicking the bookmark icon.
          </p>
          <Link
            href="/explore"
            className="text-sm font-medium text-primary hover:underline"
          >
            Explore posts
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((p) => (
            <BlogCard
              key={p.id}
              postId={p.id}
              slug={p.slug}
              title={p.title}
              excerpt={p.excerpt}
              coverImageUrl={p.coverImageUrl ?? getBannerForPost(p.id)}
              author={p.author}
              authorId={p.authorId}
              tags={p.tags}
              publishedAt={p.publishedAt}
              viewCount={p.viewCount}
              commentCount={p.commentCount}
              likeCount={p.likeCount}
              currentUserId={me.id}
              initialBookmarked
            />
          ))}
        </div>
      )}
    </main>
  );
}
