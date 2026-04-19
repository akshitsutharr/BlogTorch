"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  // Sync with URL if it changes externally
  useEffect(() => {
    setValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    startTransition(() => {
      router.replace(`?${params.toString()}`);
    });
  }

  return (
    <div className="flex w-full max-w-md items-center gap-2 rounded-2xl border border-border/65 bg-background/70 p-1.5 shadow-[inset_0_1px_0_hsl(0_0%_100%/0.25)] backdrop-blur">
      <Input
        placeholder="Search posts (title, author, tags)..."
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          // Simple debounce could be added here, but for now we'll search on enter or button click
          // Actually, let's debounce strictly for better UX or allow immediate typing
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(value);
          }
        }}
        className="h-10 border-0 bg-transparent shadow-none"
      />
      <Button
        variant="outline"
        size="icon"
        aria-label="Search"
        onClick={() => handleSearch(value)}
        disabled={isPending}
        className="h-10 w-10"
      >
        <Search className="size-4" />
      </Button>
    </div>
  );
}
