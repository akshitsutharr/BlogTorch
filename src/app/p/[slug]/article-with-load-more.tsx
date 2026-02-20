"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ArticleWithLoadMore({
  children,
  hasMore,
}: {
  children: React.ReactNode;
  hasMore: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const parts = React.Children.toArray(children);
  const partialContent = parts[0];
  const fullContent = parts[1] ?? parts[0];

  return (
    <div className="space-y-6">
      {expanded ? fullContent : partialContent}
      {hasMore && !expanded && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setExpanded(true)}
            className="gap-2"
          >
            <ChevronDown className="size-4" />
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
