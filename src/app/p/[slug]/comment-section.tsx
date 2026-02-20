"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageCircle, Send, Loader2, Heart } from "lucide-react";
import { toast } from "sonner";

import { addComment } from "./comment-actions";
import { toggleCommentLike } from "./comment-like-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Comment = {
  id: string;
  body: string;
  createdAt: Date;
  likeCount?: number;
  author: {
    displayName: string | null;
    username: string | null;
    imageUrl: string | null;
  };
  replies?: Comment[];
  hasLiked?: boolean;
};

export function CommentSection({
  postId,
  slug,
  comments,
  isSignedIn,
  currentUserId,
}: {
  postId: string;
  slug: string;
  comments: Comment[];
  isSignedIn: boolean;
  currentUserId?: string;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    startTransition(async () => {
      try {
        await addComment({ postId, body: body.trim(), parentId: null });
        setBody("");
        toast.success("Comment added");
        router.refresh();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to comment");
      }
    });
  };

  return (
    <section className="mt-12 border-t border-border/60 pt-10">
      <div className="mb-6 flex items-center gap-2">
        <MessageCircle className="size-5 text-primary" />
        <h2 className="text-xl font-semibold">
          Comments
          {comments.length > 0 && (
            <span className="ml-2 text-muted-foreground">
              ({comments.length})
            </span>
          )}
        </h2>
      </div>

      {isSignedIn ? (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-2xl border border-border/60 bg-muted/30 p-4 transition-colors focus-within:border-primary/40 focus-within:bg-muted/50"
        >
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share your thoughts..."
            className="min-h-[100px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={pending}
          />
          <div className="mt-3 flex justify-end">
            <Button type="submit" size="sm" disabled={pending || !body.trim()}>
              {pending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Send className="mr-2 size-4" />
              )}
              Comment
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-8 rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-8 text-center">
          <MessageCircle className="mx-auto mb-3 size-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            Sign in to join the conversation
          </p>
          <Link
            href={`/sign-in?redirect_url=/p/${slug}`}
            className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </div>
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((c) => (
            <CommentItem key={c.id} comment={c} slug={slug} currentUserId={currentUserId} />
          ))
        )}
      </div>
    </section>
  );
}

function CommentItem({
  comment,
  slug,
  currentUserId,
}: {
  comment: Comment;
  slug: string;
  currentUserId?: string;
}) {
  const [likes, setLikes] = useState(comment.likeCount ?? 0);
  const [hasLiked, setHasLiked] = useState(comment.hasLiked ?? false);
  const [pending, startTransition] = useTransition();
  const authorName =
    comment.author.displayName ?? comment.author.username ?? "Anonymous";

  const handleLike = () => {
    if (!currentUserId) return;
    setHasLiked((b) => !b);
    setLikes((n) => (hasLiked ? n - 1 : n + 1));
    startTransition(async () => {
      try {
        await toggleCommentLike(comment.id, slug);
      } catch {
        setHasLiked((b) => !b);
        setLikes((n) => (hasLiked ? n + 1 : n - 1));
        toast.error("Failed to like");
      }
    });
  };

  return (
    <div className="flex gap-3">
      <Avatar className="mt-0.5 size-9 shrink-0">
        <AvatarImage src={comment.author.imageUrl ?? ""} />
        <AvatarFallback className="text-xs">
          {authorName[0]?.toUpperCase() ?? "?"}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{authorName}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/90">
          {comment.body}
        </p>
        <div className="mt-2 flex items-center gap-3">
          {currentUserId ? (
            <button
              type="button"
              onClick={handleLike}
              disabled={pending}
              className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-xs transition-colors ${
                hasLiked ? "text-pink-500" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Heart className={`size-3.5 ${hasLiked ? "fill-current" : ""}`} />
              {likes}
            </button>
          ) : (
            <span className="flex items-center gap-1 px-1.5 py-0.5 text-xs text-muted-foreground">
              <Heart className="size-3.5" />
              {likes}
            </span>
          )}
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4 pl-4 border-l border-border/40">
            {comment.replies.map((r) => (
              <CommentItem key={r.id} comment={r} slug={slug} currentUserId={currentUserId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
