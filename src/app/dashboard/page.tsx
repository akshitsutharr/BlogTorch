import Link from "next/link";
import {
  BarChart3,
  Edit,
  Eye,
  FileText,
  Heart,
  Plus,
  Trash2,
} from "lucide-react";

import { deletePost } from "@/app/dashboard/actions";
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

export default async function DashboardPage() {
  const me = await ensureDbUser();

  const posts = await prisma.post.findMany({
    where: { authorId: me.id },
    orderBy: { updatedAt: "desc" },
    include: {
      tags: { include: { tag: true } },
    },
  });

  const totalPosts = posts.length;
  const totalViews = posts.reduce((acc, p) => acc + p.viewCount, 0);
  const totalLikes = posts.reduce((acc, p) => acc + p.likeCount, 0);

  const chartData = posts
    .filter((p) => p.published)
    .map((p) => ({
      title: p.title,
      views: p.viewCount,
    }))
    .slice(0, 10);

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
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
        </Card>
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

      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
          <CardDescription>Manage your content.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
                  <form action={deletePost}>
                    <input type="hidden" name="postId" value={post.id} />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
