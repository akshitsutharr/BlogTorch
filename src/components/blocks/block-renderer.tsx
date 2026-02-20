import { MarkdownBlock } from "@/components/blocks/markdown-block";
import { CodeBlock } from "@/components/blocks/code-block";
import {
  OutputBlock,
  ImageBlock,
  EmbedBlock,
  CalloutBlock,
} from "@/components/blocks/client-blocks";
import type { Prisma } from "@prisma/client";

type Block = {
  id: string;
  type:
    | "MARKDOWN"
    | "CODE"
    | "OUTPUT"
    | "IMAGE"
    | "EMBED"
    | "DIVIDER"
    | "CALLOUT";
  order: number;
  data: Prisma.JsonValue;
};

// isRecord moved to client-blocks, but we might need it locally if used in BlockRenderer itself?
// BlockRenderer uses isRecord in the map function. So let's keep isRecord or import it.
// It's a small utility, keeping it (or re-implementing it) is fine.
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((b) => {
        switch (b.type) {
          case "MARKDOWN":
            return (
              <MarkdownBlock
                key={b.id}
                markdown={
                  isRecord(b.data) && typeof b.data.markdown === "string"
                    ? b.data.markdown
                    : ""
                }
              />
            );
          case "CODE":
            return (
              <CodeBlock
                key={b.id}
                language={
                  isRecord(b.data) && typeof b.data.language === "string"
                    ? b.data.language
                    : "text"
                }
                code={
                  isRecord(b.data) && typeof b.data.code === "string"
                    ? b.data.code
                    : ""
                }
              />
            );
          case "OUTPUT":
            return <OutputBlock key={b.id} data={b.data} />;
          case "IMAGE":
            return <ImageBlock key={b.id} data={b.data} />;
          case "EMBED":
            return <EmbedBlock key={b.id} data={b.data} />;
          case "DIVIDER":
            return <hr key={b.id} className="border-border/60" />;
          case "CALLOUT":
            return <CalloutBlock key={b.id} data={b.data} />;
          default:
            return null;
        }
      })}
    </div>
  );
}


