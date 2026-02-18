"use client";

import { useState, useTransition } from "react";
import { Heart, Share2, Check } from "lucide-react";
import { toast } from "sonner";

import { toggleLike } from "@/app/p/[slug]/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LikeButton({
  postId,
  initialLikes,
  initialHasLiked,
}: {
  postId: string;
  initialLikes: number;
  initialHasLiked: boolean;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    // Optimistic update
    const nextHasLiked = !hasLiked;
    setHasLiked(nextHasLiked);
    setLikes((prev) => (nextHasLiked ? prev + 1 : prev - 1));

    startTransition(async () => {
      try {
        await toggleLike(postId);
      } catch {
        // Revert
        setHasLiked(!nextHasLiked);
        setLikes((prev) => (!nextHasLiked ? prev + 1 : prev - 1));
        toast.error("Failed to like post");
      }
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "gap-2 rounded-full transition-colors",
        hasLiked && "bg-pink-500/10 text-pink-500 border-pink-500/20 hover:bg-pink-500/20"
      )}
      onClick={handleToggle}
      disabled={isPending}
    >
      <Heart className={cn("size-4", hasLiked && "fill-current")} />
      <span>{likes}</span>
    </Button>
  );
}

export function ShareButton({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" size="sm" className="gap-2 rounded-full" onClick={handleShare}>
      {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
      Share
    </Button>
  );
}
