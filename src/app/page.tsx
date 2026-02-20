import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogCard } from "@/components/blog-card";
import { listPublishedPosts, getBookmarkedPostIds } from "@/server/posts";
import { getBannerForPost } from "@/server/banners";
import { ensureDbUser } from "@/server/me";
import { getAuthUser } from "@/server/auth";

export const revalidate = 60;

export default async function Home() {
  const [posts, authUser] = await Promise.all([
    listPublishedPosts(9),
    getAuthUser().catch(() => null),
  ]);

  let me: { id: string } | null = null;
  let bookmarkedIds = new Set<string>();
  if (authUser && posts.length > 0) {
    try {
      me = await ensureDbUser(authUser);
      bookmarkedIds = await getBookmarkedPostIds(me.id, posts.map((p) => p.id));
    } catch {
      /* ignore */
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <section
        id="hero"
        className="relative overflow-hidden rounded-[2.25rem] border border-border/60 bg-gradient-to-br from-orange-500/10 via-background to-pink-500/10 p-10 shadow-sm"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(249,115,22,0.12),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.10),transparent_40%)]" />
        <div className="relative flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Badge>
              <Sparkles className="mr-1 inline size-3.5" />
              Premium developer blogging
            </Badge>
          </div>
          <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Where <span className="text-primary">Code</span> Meets{" "}
            <span className="text-primary">Storytelling</span>
          </h1>
          <p className="max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
            Blog Torch combines a developer portfolio, technical blog, and
            notebook-style presentation into one polished platform—perfect for
            ML models, experiments, and project narratives.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/editor/new">
                Start writing <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/explore">Explore posts</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">For you</h2>
            <p className="text-sm text-muted-foreground">
              Curated developer stories with code, visuals, and outputs.
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link href="/explore">
              View all <ArrowRight />
            </Link>
          </Button>
        </div>

        {posts.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No posts yet</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Publish your first post from <span className="font-medium">New post</span>{" "}
              to see it here.
            </CardContent>
          </Card>
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
                currentUserId={me?.id}
                initialBookmarked={bookmarkedIds.has(p.id)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
