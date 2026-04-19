"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Flame, Plus, Search, Bookmark } from "lucide-react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-4 z-40 w-full px-3 md:px-5">
      <div className="mx-auto flex h-16 w-full max-w-[1320px] items-center justify-between rounded-full border border-border/60 bg-background/78 px-3 shadow-[0_16px_50px_-30px_hsl(240_18%_10%/0.52)] backdrop-blur-2xl md:px-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="logo-float flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500/90 to-pink-500/90 text-white shadow-[0_16px_24px_-16px_hsl(24_95%_53%/0.9)]">
            <Flame className="size-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight md:text-[0.95rem]">Blog Torch</div>
            <div className="hidden text-xs text-muted-foreground sm:block">
              Where Code Meets Storytelling
            </div>
          </div>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <Button asChild variant="ghost">
            <Link href="/explore">
              <Search /> Explore
            </Link>
          </Button>
          <SignedIn>
            <Button asChild variant="ghost">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/saved">
                <Bookmark className="size-4" /> Saved
              </Link>
            </Button>
            <Button asChild>
              <Link href="/editor/new">
                <Plus /> New post
              </Link>
            </Button>
          </SignedIn>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="secondary" size="sm">Sign in</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "rounded-3xl",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}


