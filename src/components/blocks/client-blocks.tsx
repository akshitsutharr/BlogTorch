
import { MarkdownBlock } from "@/components/blocks/markdown-block";
import { cn } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function OutputBlock({ data }: { data: Prisma.JsonValue }) {
  const d = isRecord(data) ? data : {};
  const mime = typeof d.mime === "string" ? d.mime : "text/plain";
  const text = typeof d.text === "string" ? d.text : null;
  const base64 = typeof d.base64 === "string" ? d.base64 : null;

  if (mime.startsWith("image/") && base64) {
    return (
      <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-3 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:${mime};base64,${base64}`}
          alt={typeof d.alt === "string" ? d.alt : "Output image"}
          className="h-auto w-full rounded-2xl"
        />
      </div>
    );
  }

  return (
    <pre className="overflow-x-auto rounded-3xl border border-border/60 bg-card/60 p-5 text-sm text-foreground shadow-sm">
      {text ?? ""}
    </pre>
  );
}

export function ImageBlock({ data }: { data: Prisma.JsonValue }) {
  const d = isRecord(data) ? data : {};
  const url = typeof d.url === "string" ? d.url : null;
  if (!url) return null;
  return (
    <figure className="overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-3 shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={typeof d.alt === "string" ? d.alt : "Image"}
        className="h-auto w-full rounded-2xl"
        loading="lazy"
      />
      {typeof d.caption === "string" && d.caption.trim() ? (
        <figcaption className="px-2 pt-3 text-center text-xs text-muted-foreground">
          {d.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function EmbedBlock({ data }: { data: Prisma.JsonValue }) {
  const d = isRecord(data) ? data : {};
  const url = typeof d.url === "string" ? d.url : null;
  if (!url) return null;

  const isYouTube =
    url.includes("youtube.com") || url.includes("youtu.be");

  return (
    <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/60 shadow-sm">
      {isYouTube ? (
        <div className="aspect-video w-full">
          <iframe
            className="h-full w-full"
            src={url}
            title="Embedded media"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="block p-5 text-sm text-primary underline-offset-4 hover:underline"
        >
          {url}
        </a>
      )}
    </div>
  );
}

export function CalloutBlock({ data }: { data: Prisma.JsonValue }) {
  const d = isRecord(data) ? data : {};
  const tone = typeof d.tone === "string" ? d.tone : "neutral";
  const title = typeof d.title === "string" ? d.title : null;
  const markdown = typeof d.markdown === "string" ? d.markdown : "";

  const toneClass =
    tone === "info"
      ? "border-sky-500/30 bg-sky-500/10"
      : tone === "warn"
        ? "border-amber-500/30 bg-amber-500/10"
        : tone === "success"
          ? "border-emerald-500/30 bg-emerald-500/10"
          : "border-border/60 bg-card/60";

  return (
    <div className={cn("rounded-3xl border p-5 shadow-sm", toneClass)}>
      {title ? (
        <div className="mb-2 text-sm font-semibold tracking-tight">{title}</div>
      ) : null}
      <MarkdownBlock markdown={markdown} />
    </div>
  );
}
