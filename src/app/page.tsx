import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogCard } from "@/components/blog-card";
import { listPublishedPosts } from "@/server/posts";
import { getBannerForPost } from "@/server/banners";

export const revalidate = 60;

export default async function Home() {
  const posts = await listPublishedPosts(9);

  return (
    <main className="page-shell">
      <section id="hero" className="section-shell">
        <div className="section-core relative overflow-hidden px-6 py-10 sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-orange-500/12 blur-[90px]" />
          <div className="pointer-events-none absolute -right-20 top-16 h-64 w-64 rounded-full bg-pink-500/12 blur-[100px]" />

          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="eyebrow-chip">
                <Sparkles className="size-3" />
                developer publishing platform
              </div>

              <h1 className="headline-display max-w-4xl font-semibold">
                Shape technical stories with a design-forward writing experience.
              </h1>

              <p className="max-w-[65ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
                Blog Torch blends notebooks, long-form writing, and rich visual blocks
                into one modern editor and reader flow for developers, researchers,
                and teams.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/editor/new">
                    Start writing
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/explore">Explore posts</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Card className="border-primary/20 bg-linear-to-br from-primary/8 via-background to-background">
                <CardContent className="p-5">
                  <p className="text-xs tracking-[0.15em] text-muted-foreground">BUILT FOR</p>
                  <p className="mt-3 text-lg font-semibold tracking-tight">ML experiments</p>
                  <p className="mt-2 text-sm text-muted-foreground">Publish outputs, plots, and code with context.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <p className="text-xs tracking-[0.15em] text-muted-foreground">READER EXPERIENCE</p>
                  <p className="mt-3 text-lg font-semibold tracking-tight">Fast and focused</p>
                  <p className="mt-2 text-sm text-muted-foreground">Optimized loading, clean typography, and adaptive media.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="outline" className="mb-3">Latest collection</Badge>
            <h2 className="text-2xl font-semibold tracking-tight">Curated for you</h2>
            <p className="text-sm text-muted-foreground">
              Fresh developer stories with code, visuals, and notebook-style outputs.
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link href="/explore">
              View all
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {posts.length === 0 ? (
          <Card className="rounded-[1.9rem]">
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
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
