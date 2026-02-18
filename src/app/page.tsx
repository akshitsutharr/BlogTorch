import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listPublishedPosts } from "@/server/posts";

export default async function Home() {
  const posts = await listPublishedPosts(9);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
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

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Latest posts</h2>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Card key={p.id} className="group transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{p.title}</CardTitle>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {p.tags.slice(0, 3).map((t) => (
                      <Badge key={t.id} variant="secondary">
                        {t.tag.name}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {p.excerpt ?? "A notebook-style technical story."}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{p.author.displayName ?? p.author.username ?? "Author"}</span>
                    <span>
                      {p.likeCount} likes · {p.viewCount} views
                    </span>
                  </div>
                  <Button asChild className="w-full" variant="outline">
                    <Link href={`/p/${p.slug}`}>Read</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
      </main>
  );
}
