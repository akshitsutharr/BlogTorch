import Link from "next/link";
import { Edit, Eye, FileText, Heart, MessageCircle, Plus, Trash2 } from "lucide-react";

import { DeletePostDialog } from "@/app/dashboard/delete-post-dialog";
import { ViewsChart } from "@/app/dashboard/charts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/server/db";
import { ensureDbUser } from "@/server/me";
import { getAuthUser } from "@/server/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const authUser = await getAuthUser();
  if (!authUser) {
    redirect("/sign-in");
  }

  const me = await ensureDbUser(authUser);

  let totalPosts = 0;
  let totalViews = 0;
  let totalLikes = 0;
  let recentPosts: any[] = [];
  let chartData: { title: string; views: number }[] = [];
  let posts: any[] = [];
  let commentsOnMine: Awaited<ReturnType<typeof prisma.comment.findMany>> = [];
  let myComments: Awaited<ReturnType<typeof prisma.comment.findMany>> = [];

  try {
    // Optimize data fetching: use aggregations and limits to avoid fetching all posts
    const [
      totalPostsCount,
      viewsAggregation,
      likesAggregation,
      recentPostsData,
      chartPosts,
      allPosts,
      latestCommentsOnMyBlogs,
      myCommentsOnOthers,
    ] = await Promise.all([
    // 1. Total post count
    prisma.post.count({
      where: { authorId: me.id },
    }),
    // 2. Total views
    prisma.post.aggregate({
      _sum: { viewCount: true },
      where: { authorId: me.id },
    }),
    // 3. Total likes
    prisma.post.aggregate({
      _sum: { likeCount: true },
      where: { authorId: me.id },
    }),
    // 4. Recent activity (limit 5)
    prisma.post.findMany({
      where: { authorId: me.id },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        updatedAt: true,
        published: true,
        viewCount: true,
        slug: true,
      },
    }),
    // 5. Chart data (limit 30 most recent published)
    prisma.post.findMany({
      where: { authorId: me.id, published: true },
      orderBy: { publishedAt: "desc" },
      take: 30,
      select: {
        title: true,
        viewCount: true,
      },
    }),
    // 6. All posts list (limit 50 for now to prevent timeouts)
    prisma.post.findMany({
      where: { authorId: me.id },
      orderBy: { updatedAt: "desc" },
      take: 50,
      select: {
        id: true,
        title: true,
        updatedAt: true,
        published: true,
        viewCount: true,
        likeCount: true,
        slug: true,
      },
    }),
    // 7. Latest comments on user's blogs
    prisma.comment.findMany({
      where: { post: { authorId: me.id } },
      include: {
        post: { select: { title: true, slug: true } },
        author: { select: { displayName: true, username: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    // 8. User's comments on others' blogs
    prisma.comment.findMany({
      where: { authorId: me.id, post: { authorId: { not: me.id } } },
      include: {
        post: { select: { title: true, slug: true } },
        author: { select: { displayName: true, username: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  totalPosts = totalPostsCount;
  totalViews = viewsAggregation._sum.viewCount ?? 0;
  totalLikes = likesAggregation._sum.likeCount ?? 0;
  recentPosts = recentPostsData;

  // Reverse chart posts to show oldest -> newest
  chartData = chartPosts.reverse().map((p) => ({
    title: p.title,
    views: p.viewCount,
  }));
  
  // Use 'allPosts' for the posts list
  posts = allPosts;
  commentsOnMine = latestCommentsOnMyBlogs;
  myComments = myCommentsOnOthers;
  } catch (error) {
    console.error("Dashboard query failed:", error);
    // Continue with empty data - UI will show "No posts yet"
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link href="/editor/new">
            <Plus className="mr-2 size-4" /> New Post
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              {posts.filter((p) => p.published).length} published
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">
              Across all published posts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLikes}</div>
            <p className="text-xs text-muted-foreground">
              Community engagement
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <ViewsChart data={chartData} />
        </div>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest posts and their status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No posts yet, or the database is unavailable.
                </p>
              ) : null}
              {posts.slice(0, 5).map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium leading-none line-clamp-1">
                      {post.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {post.published ? "Published" : "Draft"} ·{" "}
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="font-medium">
                    {post.viewCount} <Eye className="ml-1 inline size-3" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="size-5" />
              Latest comments on your blogs
            </CardTitle>
            <CardDescription>
              Recent activity on your published posts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {commentsOnMine.length === 0 ? (
                <p className="text-sm text-muted-foreground">No comments yet.</p>
              ) : (
                commentsOnMine.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-lg border border-border/50 p-3"
                  >
                    <p className="line-clamp-2 text-sm">{c.body}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      by {c.author.displayName ?? c.author.username ?? "Anonymous"} on{" "}
                      <Link
                        href={`/p/${c.post.slug}`}
                        className="text-primary hover:underline"
                      >
                        {c.post.title}
                      </Link>
                      {" · "}
                      {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="size-5" />
              Your comments on others
            </CardTitle>
            <CardDescription>
              Comments you left on other authors&apos; posts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myComments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  You haven&apos;t commented on others&apos; posts yet.
                </p>
              ) : (
                myComments.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-lg border border-border/50 p-3"
                  >
                    <p className="line-clamp-2 text-sm">{c.body}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      on{" "}
                      <Link
                        href={`/p/${c.post.slug}`}
                        className="text-primary hover:underline"
                      >
                        {c.post.title}
                      </Link>
                      {" · "}
                      {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
          <CardDescription>Manage your content.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No posts yet, or the database is unavailable.
              </p>
            ) : null}
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex flex-col items-start justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:items-center"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/editor/${post.id}`}
                      className="font-semibold hover:underline"
                    >
                      {post.title}
                    </Link>
                    {post.published ? (
                      <Badge variant="default" className="bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/25">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span>
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </span>
                    <span>·</span>
                    <span>{post.viewCount} views</span>
                    <span>·</span>
                    <span>{post.likeCount} likes</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/editor/${post.id}`}>
                      <Edit className="mr-2 size-4" /> Edit
                    </Link>
                  </Button>
                  {post.published && (
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/p/${post.slug}`} target="_blank">
                        <Eye className="mr-2 size-4" /> View
                      </Link>
                    </Button>
                  )}
                  <DeletePostDialog postId={post.id} postTitle={post.title}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </DeletePostDialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
