"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      type="button"
      size="icon"
      variant="outline"
      className="absolute right-3 top-3 h-9 w-9 rounded-2xl"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied");
        window.setTimeout(() => setCopied(false), 900);
      }}
      aria-label="Copy code"
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  );
}


