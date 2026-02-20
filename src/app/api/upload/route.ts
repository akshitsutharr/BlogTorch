import { put } from "@vercel/blob";
import { getAuthUser } from "@/server/auth";
import { ensureDbUser } from "@/server/me";
import { NextResponse } from "next/server";

const MAX_SIZE = 4 * 1024 * 1024; // 4MB
const BASE64_MAX = 500 * 1024; // 500KB for fallback (avoids huge DB payloads)
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

async function fileToBase64DataUrl(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  const mime = file.type || "image/png";
  return `data:${mime};base64,${base64}`;
}

export async function POST(request: Request) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await ensureDbUser(authUser);

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Max 4MB." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid type. Use JPEG, PNG, WebP, or GIF." },
        { status: 400 }
      );
    }

    // Try Vercel Blob first (when BLOB_READ_WRITE_TOKEN is set)
    try {
      const blob = await put(file.name, file, {
        access: "public",
        addRandomSuffix: true,
      });
      return NextResponse.json({ url: blob.url });
    } catch {
      // Fallback: use base64 data URL (works without Vercel Blob)
      if (file.size > BASE64_MAX) {
        return NextResponse.json(
          {
            error:
              "Upload requires BLOB_READ_WRITE_TOKEN. Add it in Vercel → Storage, or use images under 500KB for local fallback.",
          },
          { status: 500 }
        );
      }
      const dataUrl = await fileToBase64DataUrl(file);
      return NextResponse.json({ url: dataUrl });
    }
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Upload failed. Try a smaller image or add BLOB_READ_WRITE_TOKEN on Vercel." },
      { status: 500 }
    );
  }
}
