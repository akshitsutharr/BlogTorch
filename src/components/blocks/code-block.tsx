import "server-only";

import { codeToHtml } from "shiki";

import { CopyButton } from "@/components/blocks/copy-button";
import { cn } from "@/lib/utils";

export async function CodeBlock({
  language,
  code,
  className,
}: {
  language?: string | null;
  code: string;
  className?: string;
}) {
  const html = await codeToHtml(code, {
    lang: language ?? "text",
    theme: "github-dark",
  });

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/60 bg-zinc-950/95 text-zinc-50 shadow-sm",
        className,
      )}
    >
      <CopyButton text={code} />
      <div
        className="[&_.shiki]:bg-transparent [&_pre]:overflow-x-auto [&_pre]:p-5 [&_pre]:text-sm [&_code]:font-mono"
        // Shiki returns trusted HTML; source is user content, but this is code (not HTML).
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <div className="border-t border-white/10 px-5 py-2 text-xs text-zinc-300">
        {language ?? "text"}
      </div>
    </div>
  );
}


