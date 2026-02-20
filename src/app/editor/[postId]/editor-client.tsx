"use client";

import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Plus,
  Save,
  Upload,
  Rocket,
  Trash2,
  Eye,
  X,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

import { publishPost, saveDraft } from "@/app/editor/[postId]/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  OutputBlock,
  ImageBlock,
  EmbedBlock,
  CalloutBlock,
} from "@/components/blocks/client-blocks";
import { MarkdownBlock } from "@/components/blocks/markdown-block";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type BlockType =
  | "MARKDOWN"
  | "CODE"
  | "OUTPUT"
  | "IMAGE"
  | "EMBED"
  | "DIVIDER"
  | "CALLOUT";

type EditorBlock = {
  id: string;
  type: BlockType;
  data: Record<string, unknown>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(v: unknown, fallback = "") {
  return typeof v === "string" ? v : fallback;
}

function coerceData(v: unknown): Record<string, unknown> {
  return isRecord(v) ? v : {};
}

function blockLabel(type: BlockType) {
  switch (type) {
    case "MARKDOWN":
      return "Markdown";
    case "CODE":
      return "Code";
    case "OUTPUT":
      return "Output";
    case "IMAGE":
      return "Image";
    case "EMBED":
      return "Embed";
    case "DIVIDER":
      return "Divider";
    case "CALLOUT":
      return "Callout";
    default:
      return type;
  }
}

function ClientCodeBlock({
  language,
  code,
}: {
  language: string;
  code: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-zinc-950/95 text-zinc-50 shadow-sm">
      <pre className="overflow-x-auto p-5 text-sm font-mono">
        <code>{code}</code>
      </pre>
      <div className="border-t border-white/10 px-5 py-2 text-xs text-zinc-300">
        {language}
      </div>
    </div>
  );
}

export function EditorClient({
  post,
}: {
  post: {
    id: string;
    title: string;
    excerpt: string | null;
    coverImageUrl: string | null;
    published: boolean;
    tags: string[];
    blocks: Array<{ id: string; type: BlockType; data: unknown }>;
  };
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const [title, setTitle] = useState(post.title);
  const [excerpt, setExcerpt] = useState(post.excerpt ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(post.coverImageUrl ?? "");
  const [coverUploading, setCoverUploading] = useState(false);
  const [tags, setTags] = useState<string[]>(post.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const hasMountedRef = useRef(false);

  const [blocks, setBlocks] = useState<EditorBlock[]>(
    post.blocks.map((b) => ({
      id: b.id,
      type: b.type,
      data: coerceData(b.data),
    })),
  );

  const ids = useMemo(() => blocks.map((b) => b.id), [blocks]);

  const onSave = useCallback(
    async (silent = false) => {
      setSaving(true);
      try {
        await saveDraft({
          postId: post.id,
          title: title.trim() || "Untitled",
          excerpt: excerpt.trim() ? excerpt.trim() : null,
          coverImageUrl: coverImageUrl.trim() || null,
          blocks: blocks.map((b) => ({ type: b.type, data: b.data })),
          tags,
        });
        if (!silent) toast.success("Saved");
        setIsDirty(false);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Save failed");
      } finally {
        setSaving(false);
      }
    },
    [post.id, title, excerpt, coverImageUrl, blocks, tags],
  );

  // Mark dirty when content changes after initial mount
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    setIsDirty(true);
  }, [title, excerpt, coverImageUrl, blocks, tags]);

  // Debounced autosave while editing.
  useEffect(() => {
    if (!isDirty || saving) return;
    const timeout = setTimeout(() => {
      void onSave(true);
    }, 2500);
    return () => clearTimeout(timeout);
  }, [isDirty, saving, onSave]);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  function addBlock(type: BlockType) {
    setBlocks((prev) => [
      ...prev,
      {
        id: nanoid(),
        type,
        data:
          type === "MARKDOWN"
            ? { markdown: "## New section\n\n" }
            : type === "CODE"
              ? { language: "python", code: "" }
              : type === "OUTPUT"
                ? { mime: "text/plain", text: "" }
                : type === "IMAGE"
                  ? { url: "", caption: "" }
                  : type === "EMBED"
                    ? { url: "" }
                    : type === "CALLOUT"
                      ? { tone: "info", title: "Note", markdown: "" }
                      : {},
      },
    ]);
  }

  function removeBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }

  async function onPublish() {
    setSaving(true);
    try {
      const res = await publishPost({
        postId: post.id,
        title: title.trim() || "Untitled",
        excerpt: excerpt.trim() ? excerpt.trim() : null,
        coverImageUrl: coverImageUrl.trim() || null,
        blocks: blocks.map((b) => ({ type: b.type, data: b.data })),
        tags,
      });
      toast.success("Published");
      setIsDirty(false);
      router.push(`/p/${res.slug}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Publish failed");
    } finally {
      setSaving(false);
    }
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setBlocks((prev) => {
      const oldIndex = prev.findIndex((b) => b.id === active.id);
      const newIndex = prev.findIndex((b) => b.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  function addTag() {
    const t = tagInput.trim();
    if (!t) return;
    if (!tags.includes(t)) {
      setTags([...tags, t]);
    }
    setTagInput("");
  }

  function removeTag(t: string) {
    setTags(tags.filter((x) => x !== t));
  }

  async function uploadCover(file: File) {
    setCoverUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      setCoverImageUrl(json.url);
      toast.success("Cover image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setCoverUploading(false);
    }
  }

  async function uploadImageToBlock(blockId: string, file: File) {
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === blockId
            ? { ...b, data: { ...b.data, url: json.url } }
            : b
        )
      );
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    }
  }

  async function handleFileUpload(file: File) {
    const name = file.name.toLowerCase();

    // Jupyter Notebook
    if (name.endsWith(".ipynb")) {
      await importIpynb(file);
      return;
    }

    // Code files
    let lang = "text";
    if (name.endsWith(".py")) lang = "python";
    else if (name.endsWith(".js")) lang = "javascript";
    else if (name.endsWith(".ts") || name.endsWith(".tsx")) lang = "typescript";
    else if (name.endsWith(".java")) lang = "java";
    else if (name.endsWith(".cpp") || name.endsWith(".c") || name.endsWith(".h"))
      lang = "cpp";
    else if (name.endsWith(".sql")) lang = "sql";
    else if (name.endsWith(".html")) lang = "html";
    else if (name.endsWith(".css")) lang = "css";
    else if (name.endsWith(".json")) lang = "json";

    const text = await file.text();
    setBlocks((prev) => [
      ...prev,
      {
        id: nanoid(),
        type: "CODE",
        data: { language: lang, code: text },
      },
    ]);
    toast.success(`Imported ${name}`);
  }

  async function importIpynb(file: File) {
    const text = await file.text();
    let nb: unknown;
    try {
      nb = JSON.parse(text);
    } catch {
      toast.error("Invalid JSON");
      return;
    }
    const cells = isRecord(nb) && Array.isArray(nb.cells) ? nb.cells : null;
    if (!cells) {
      toast.error("Not a valid .ipynb (missing cells)");
      return;
    }

    const imported: EditorBlock[] = [];
    for (const cell of cells) {
      if (!isRecord(cell)) continue;
      const cellType = getString(cell.cell_type);
      const sourceRaw = cell.source;
      const source =
        typeof sourceRaw === "string"
          ? sourceRaw
          : Array.isArray(sourceRaw)
            ? sourceRaw.filter((x) => typeof x === "string").join("")
            : "";

      if (cellType === "markdown") {
        imported.push({
          id: nanoid(),
          type: "MARKDOWN",
          data: { markdown: source },
        });
      }

      if (cellType === "code") {
        imported.push({
          id: nanoid(),
          type: "CODE",
          data: { language: "python", code: source },
        });

        const outputs = Array.isArray(cell.outputs) ? cell.outputs : [];
        for (const out of outputs) {
          if (!isRecord(out)) continue;
          // Prefer Jupyter "data" payloads
          const data = isRecord(out.data) ? out.data : null;
          const textOut = out.text;

          const plain =
            data && typeof data["text/plain"] === "string"
              ? (data["text/plain"] as string)
              : Array.isArray(data?.["text/plain"])
                ? (data?.["text/plain"] as unknown[])
                    .filter((x) => typeof x === "string")
                    .join("")
                : typeof textOut === "string"
                  ? textOut
                  : Array.isArray(textOut)
                    ? textOut.filter((x) => typeof x === "string").join("")
                    : null;

          const png =
            data && typeof data["image/png"] === "string"
              ? (data["image/png"] as string)
              : null;

          if (png) {
            imported.push({
              id: nanoid(),
              type: "OUTPUT",
              data: { mime: "image/png", base64: png },
            });
          } else if (plain) {
            imported.push({
              id: nanoid(),
              type: "OUTPUT",
              data: { mime: "text/plain", text: plain },
            });
          }
        }
      }
    }

    if (imported.length === 0) {
      toast.error("No importable cells found");
      return;
    }

    setBlocks((prev) => [...prev, ...imported]);
    toast.success(`Imported ${imported.length} blocks`);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Compose</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
              className="text-lg font-semibold"
            />
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short excerpt (optional)"
              className="min-h-[84px]"
            />

            <div className="space-y-2">
              <p className="text-sm font-medium">Cover / Banner</p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadCover(f);
                    e.target.value = "";
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={coverUploading}
                  onClick={() => coverInputRef.current?.click()}
                >
                  {coverUploading ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <ImageIcon className="mr-2 size-4" />
                  )}
                  {coverUploading ? "Uploading…" : "Upload image"}
                </Button>
                <span className="text-xs text-muted-foreground">or</span>
                <Input
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="Paste image URL (or use /image.png as default)"
                  className="flex-1"
                />
              </div>
              {coverImageUrl ? (
                <div className="relative mt-2 aspect-video max-h-40 w-full overflow-hidden rounded-2xl border border-border/60">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImageUrl}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setCoverImageUrl("")}
                    className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
                    aria-label="Remove cover"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : null}
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20">
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add tags..."
                  className="max-w-[200px]"
                />
                <Button variant="outline" size="sm" onClick={addTag}>Add</Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Badge variant="outline">Notebook-style blocks</Badge>
              {post.published ? <Badge className="bg-green-500/10 text-green-600 dark:text-green-400">Published</Badge> : <Badge variant="secondary">Draft</Badge>}
              {isDirty && <span className="text-xs text-muted-foreground">Unsaved changes...</span>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Blocks</CardTitle>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                // accept=".ipynb,application/json,.py,.js,.ts,.tsx,.java,.cpp,.c,.h,.sql,.html,.css" // Browser handling of extensions is weird sometimes, removed validation to allow all text files effectively
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  await handleFileUpload(f);
                  e.target.value = "";
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 size-4" /> Import File
              </Button>
              <Button 
                variant="secondary"
                size="sm"
                onClick={() => setPreviewOpen(true)}
              >
                <Eye className="mr-2 size-4" /> Preview
              </Button>
              <Button variant="outline" size="sm" onClick={() => onSave()} disabled={saving}>
                <Save className="mr-2 size-4" /> Save
              </Button>
              <Button size="sm" onClick={onPublish} disabled={saving}>
                <Rocket className="mr-2 size-4" /> Publish
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {blocks.map((b, idx) => (
                    <SortableBlockRow
                      key={b.id}
                      block={b}
                      index={idx}
                      onChange={(next) =>
                        setBlocks((prev) =>
                          prev.map((x) => (x.id === b.id ? next : x)),
                        )
                      }
                      onRemove={() => removeBlock(b.id)}
                      onUploadImage={
                        b.type === "IMAGE"
                          ? (file) => uploadImageToBlock(b.id, file)
                          : undefined
                      }
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-4">
        {/* Helper buttons same as before */}
        <Card>
          <CardHeader>
            <CardTitle>Add blocks</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="outline" onClick={() => addBlock("MARKDOWN")}>
              <Plus className="mr-2 size-4" /> Markdown
            </Button>
            <Button variant="outline" onClick={() => addBlock("CODE")}>
              <Plus className="mr-2 size-4" /> Code
            </Button>
            <Button variant="outline" onClick={() => addBlock("OUTPUT")}>
              <Plus className="mr-2 size-4" /> Output
            </Button>
            <Button variant="outline" onClick={() => addBlock("IMAGE")}>
              <Plus className="mr-2 size-4" /> Image
            </Button>
            <Button variant="outline" onClick={() => addBlock("EMBED")}>
              <Plus className="mr-2 size-4" /> Embed
            </Button>
            <Button variant="outline" onClick={() => addBlock("CALLOUT")}>
              <Plus className="mr-2 size-4" /> Callout
            </Button>
            <Button variant="outline" onClick={() => addBlock("DIVIDER")}>
              <Plus className="mr-2 size-4" /> Divider
            </Button>
          </CardContent>
        </Card>
        
        {/* Tips same as before */}
        <Card>
          <CardHeader>
            <CardTitle>Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
             <p>All file types (.ipynb, .py, .js, .sql, etc.) are supported via Import.</p>
             <p>Use the Preview button to see how your post will look.</p>
          </CardContent>
        </Card>
      </aside>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogTitle>{title || "Untitled Preview"}</DialogTitle>
          <div className="space-y-6 py-4">
            {blocks.map((b) => {
               const d = b.data;
               switch (b.type) {
                 case "MARKDOWN":
                   return <MarkdownBlock key={b.id} markdown={getString(d.markdown)} />;
                 case "CODE":
                   return (
                     <ClientCodeBlock
                       key={b.id}
                       language={getString(d.language, "text")}
                       code={getString(d.code)}
                     />
                   );
                 case "OUTPUT":
                   // eslint-disable-next-line @typescript-eslint/no-explicit-any
                   return <OutputBlock key={b.id} data={d as any} />;
                 case "IMAGE":
                   // eslint-disable-next-line @typescript-eslint/no-explicit-any
                   return <ImageBlock key={b.id} data={d as any} />;
                 case "EMBED":
                   // eslint-disable-next-line @typescript-eslint/no-explicit-any
                   return <EmbedBlock key={b.id} data={d as any} />;
                 case "DIVIDER":
                   return <hr key={b.id} className="border-border/60" />;
                 case "CALLOUT":
                   // eslint-disable-next-line @typescript-eslint/no-explicit-any
                   return <CalloutBlock key={b.id} data={d as any} />;
                 default:
                   return null;
               }
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SortableBlockRow({
  block,
  index,
  onChange,
  onRemove,
  onUploadImage,
}: {
  block: EditorBlock;
  index: number;
  onChange: (b: EditorBlock) => void;
  onRemove: () => void;
  onUploadImage?: (file: File) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-3xl border border-border/60 bg-card/60 p-4 shadow-sm",
        isDragging && "opacity-75",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-2xl border border-border bg-background/40"
            {...attributes}
            {...listeners}
            aria-label="Drag"
          >
            <GripVertical className="size-4 text-muted-foreground" />
          </button>
          <Badge variant="secondary">
            {index + 1}. {blockLabel(block.type)}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-2xl"
          onClick={onRemove}
          aria-label="Remove block"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <BlockEditor block={block} onChange={onChange} onUploadImage={onUploadImage} />
    </div>
  );
}

function BlockEditor({
  block,
  onChange,
  onUploadImage,
}: {
  block: EditorBlock;
  onChange: (b: EditorBlock) => void;
  onUploadImage?: (file: File) => void;
}) {
  const d = block.data;
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  switch (block.type) {
    case "MARKDOWN":
      return (
        <Textarea
          value={getString(d.markdown)}
          onChange={(e) =>
            onChange({ ...block, data: { ...d, markdown: e.target.value } })
          }
          placeholder="Write markdown…"
          className="min-h-[120px]"
        />
      );
    case "CODE":
      return (
        <div className="space-y-2">
          <Input
            value={getString(d.language, "python")}
            onChange={(e) =>
              onChange({ ...block, data: { ...d, language: e.target.value } })
            }
            placeholder="Language (python, javascript, cpp, java, …)"
          />
          <Textarea
            value={getString(d.code)}
            onChange={(e) =>
              onChange({ ...block, data: { ...d, code: e.target.value } })
            }
            placeholder="Code…"
            className="font-mono min-h-[120px]"
          />
        </div>
      );
    case "OUTPUT":
      return (
        <div className="space-y-2">
          <Input
            value={getString(d.mime, "text/plain")}
            onChange={(e) =>
              onChange({ ...block, data: { ...d, mime: e.target.value } })
            }
            placeholder='MIME (e.g. "text/plain" or "image/png")'
          />
          <Textarea
            value={getString(d.text)}
            onChange={(e) =>
              onChange({ ...block, data: { ...d, text: e.target.value } })
            }
            placeholder="Output text…"
            className="font-mono"
          />
        </div>
      );
    case "IMAGE":
      return (
        <div className="space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f && onUploadImage) onUploadImage(f);
                e.target.value = "";
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => imageInputRef.current?.click()}
              disabled={!onUploadImage}
            >
              <Upload className="mr-2 size-4" />
              Upload image
            </Button>
            <span className="text-xs text-muted-foreground">or paste URL</span>
          </div>
          <Input
            value={getString(d.url)}
            onChange={(e) =>
              onChange({ ...block, data: { ...d, url: e.target.value } })
            }
            placeholder="Image URL"
          />
          <Input
            value={getString(d.caption)}
            onChange={(e) =>
              onChange({ ...block, data: { ...d, caption: e.target.value } })
            }
            placeholder="Caption (optional)"
          />
        </div>
      );
    case "EMBED":
      return (
        <Input
          value={getString(d.url)}
          onChange={(e) =>
            onChange({ ...block, data: { ...d, url: e.target.value } })
          }
          placeholder="Embed URL (YouTube, etc.)"
        />
      );
    case "DIVIDER":
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="w-full border-t border-border/60" />
          <span>Divider</span>
          <span className="w-full border-t border-border/60" />
        </div>
      );
    case "CALLOUT":
      return (
        <div className="space-y-2">
          <Input
            value={getString(d.tone, "info")}
            onChange={(e) =>
              onChange({ ...block, data: { ...d, tone: e.target.value } })
            }
            placeholder="Tone (info, warn, success, neutral)"
          />
          <Input
            value={getString(d.title, "Note")}
            onChange={(e) =>
              onChange({ ...block, data: { ...d, title: e.target.value } })
            }
            placeholder="Title"
          />
          <Textarea
            value={getString(d.markdown)}
            onChange={(e) =>
              onChange({ ...block, data: { ...d, markdown: e.target.value } })
            }
            placeholder="Callout markdown…"
          />
        </div>
      );
    default:
      return null;
  }
}


