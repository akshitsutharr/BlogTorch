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
    <div className="flex w-full max-w-md items-center gap-2">
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
      />
      <Button
        variant="outline"
        size="icon"
        aria-label="Search"
        onClick={() => handleSearch(value)}
        disabled={isPending}
      >
        <Search className="size-4" />
      </Button>
    </div>
  );
}
