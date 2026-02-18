"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Flame, Plus, Search } from "lucide-react";
import { motion } from "framer-motion";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/60 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: -10, scale: 0.95 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="flex h-10 w-10 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500/90 to-pink-500/90 text-white shadow-lg"
          >
            <Flame className="size-5" />
          </motion.div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">Blog Torch</div>
            <div className="text-xs text-muted-foreground">
              Where Code Meets Storytelling
            </div>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost">
            <Link href="/explore">
              <Search /> Explore
            </Link>
          </Button>
          <SignedIn>
            <Button asChild variant="ghost">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/editor/new">
                <Plus /> New post
              </Link>
            </Button>
          </SignedIn>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="secondary">Sign in</Button>
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


