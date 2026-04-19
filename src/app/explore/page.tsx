import { SearchInput } from "@/app/explore/search-input";
import { BlogCard } from "@/components/blog-card";
import { listPublishedPosts } from "@/server/posts";
import { getBannerForPost } from "@/server/banners";

export const revalidate = 30;

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === "string" ? resolvedParams.q : undefined;
  const posts = await listPublishedPosts(30, q);

  return (
    <main className="page-shell">
      <section className="section-shell mb-8">
        <div className="section-core px-6 py-6 sm:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="eyebrow-chip mb-3">Explore</div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Discover posts</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {q
                  ? `Searching for "${q}"`
                  : "Browse the latest stories from the community."}
              </p>
            </div>
            <SearchInput />
          </div>
        </div>
      </section>

      {posts.length === 0 ? (
        <div className="section-shell">
          <div className="section-core px-8 py-14 text-center">
            <h2 className="text-xl font-semibold tracking-tight">No posts found</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Try a different keyword or clear search filters to see more stories.
            </p>
          </div>
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
            />
          ))}
        </div>
      )}
    </main>
  );
}


