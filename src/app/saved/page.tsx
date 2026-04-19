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
    <main className="page-shell">
      <section className="section-shell mb-8">
        <div className="section-core px-6 py-6 sm:px-8 sm:py-7">
          <div className="mb-1 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Bookmark className="size-6 text-primary" />
            </div>
            <div>
              <p className="eyebrow-chip mb-2">Saved Collection</p>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Your saved posts</h1>
              <p className="text-sm text-muted-foreground">
                {posts.length} {posts.length === 1 ? "post" : "posts"} saved
              </p>
            </div>
          </div>
        </div>
      </section>

      {posts.length === 0 ? (
        <section className="section-shell">
          <div className="section-core px-8 py-16 text-center">
            <Bookmark className="mx-auto mb-4 size-12 text-muted-foreground/50" />
            <h2 className="mb-2 text-xl font-semibold tracking-tight">No saved posts yet</h2>
            <p className="mb-5 text-sm text-muted-foreground">
              Save posts you want to revisit later from explore or article pages.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center rounded-full border border-border/70 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent"
            >
              Explore posts
            </Link>
          </div>
        </section>
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
