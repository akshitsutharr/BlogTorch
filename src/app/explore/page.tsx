import { SearchInput } from "@/app/explore/search-input";
import { BlogCard } from "@/components/blog-card";
import { listPublishedPosts, getBookmarkedPostIds } from "@/server/posts";
import { getBannerForPost } from "@/server/banners";
import { ensureDbUser } from "@/server/me";
import { getAuthUser } from "@/server/auth";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === "string" ? resolvedParams.q : undefined;
  const posts = await listPublishedPosts(30, q);

  let me: { id: string } | null = null;
  let bookmarkedIds = new Set<string>();
  const authUser = await getAuthUser().catch(() => null);
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
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Explore</h1>
          <p className="text-sm text-muted-foreground">
            {q ? `Searching for "${q}"` : "Discover the latest stories from the community."}
          </p>
        </div>
        <SearchInput />
      </div>

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
    </main>
  );
}


