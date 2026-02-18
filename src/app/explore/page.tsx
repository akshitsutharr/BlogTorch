import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchInput } from "@/app/explore/search-input";
import { listPublishedPosts } from "@/server/posts";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === "string" ? resolvedParams.q : undefined;
  const posts = await listPublishedPosts(30, q);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Explore</h1>
          <p className="text-sm text-muted-foreground">
            {q ? `Searching for "${q}"` : "Discover the latest stories from the community."}
          </p>
        </div>
        <SearchInput />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Card key={p.id} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="line-clamp-2">{p.title}</CardTitle>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.tags.slice(0, 4).map((t) => (
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
    </main>
  );
}


