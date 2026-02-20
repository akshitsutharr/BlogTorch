"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  Eye,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  Pencil,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

import { toggleBookmark } from "@/app/saved/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const DEFAULT_THUMBNAIL = "/image.png";

type BlogCardProps = {
  postId: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  author: {
    displayName: string | null;
    username: string | null;
    imageUrl: string | null;
  };
  authorId: string;
  tags: Array<{ tag: { name: string } }>;
  publishedAt: Date | null;
  viewCount: number;
  commentCount?: number;
  likeCount?: number;
  currentUserId?: string;
  initialBookmarked?: boolean;
  className?: string;
};

export function BlogCard({
  postId,
  slug,
  title,
  excerpt,
  coverImageUrl,
  author,
  authorId,
  tags,
  publishedAt,
  viewCount,
  commentCount = 0,
  likeCount = 0,
  currentUserId,
  initialBookmarked = false,
  className,
}: BlogCardProps) {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [pending, startTransition] = useTransition();

  const thumbnail = coverImageUrl ?? DEFAULT_THUMBNAIL;
  const authorName = author.displayName ?? author.username ?? "Author";
  const isAuthor = currentUserId === authorId;
  const formatCount = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUserId) {
      toast.error("Sign in to save posts");
      return;
    }
    setBookmarked((b) => !b);
    startTransition(async () => {
      try {
        await toggleBookmark(postId);
      } catch {
        setBookmarked((b) => !b);
        toast.error("Failed to save");
      }
    });
  };

  const handleShare = () => {
    const url = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied");
  };

  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-lg sm:flex-row",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col p-5">
        <Link href={`/p/${slug}`} className="block">
          <div className="mb-3 flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage src={author.imageUrl ?? ""} alt={authorName} />
              <AvatarFallback className="text-xs">
                {authorName[0]?.toUpperCase() ?? "A"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {authorName}
              </p>
              {tags.length > 0 && (
                <p className="truncate text-xs text-muted-foreground">
                  In {tags.slice(0, 2).map((t) => t.tag.name).join(", ")}
                </p>
              )}
            </div>
          </div>

          <h3 className="mb-1.5 line-clamp-2 font-bold leading-snug tracking-tight text-foreground group-hover:text-primary">
            {title}
          </h3>
          {excerpt ? (
            <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
              {excerpt}
            </p>
          ) : null}
        </Link>

        <div className="mt-auto flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {publishedAt && (
            <span>
              {new Date(publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Eye className="size-3.5" />
            {formatCount(viewCount)}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="size-3.5" />
            {formatCount(commentCount)}
          </span>
          <div
            className="ml-auto flex items-center gap-0.5"
            onClick={(e) => e.stopPropagation()}
          >
        <button
          type="button"
          onClick={handleBookmark}
          disabled={pending}
          className={cn(
            "rounded p-1.5 transition-opacity hover:opacity-100",
            bookmarked ? "fill-primary text-primary" : "opacity-60"
          )}
          aria-label="Save"
        >
          <Bookmark className="size-4" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="rounded p-1.5 opacity-60 transition-opacity hover:opacity-100"
              aria-label="More"
            >
              <MoreHorizontal className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isAuthor && (
              <DropdownMenuItem
                onClick={() => router.push(`/editor/${postId}`)}
              >
                <Pencil className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleShare}>
              <Share2 className="mr-2 size-4" />
              Share
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
          </div>
        </div>
      </div>

      <Link href={`/p/${slug}`} className="relative h-40 shrink-0 sm:h-auto sm:w-48">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnail}
          alt=""
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </Link>
    </div>
  );
}
