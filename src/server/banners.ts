import { readdirSync, existsSync } from "node:fs";
import path from "node:path";

const BANNER_DIR = "public/Banner";

function getBannerFiles(): string[] {
  try {
    const fullPath = path.join(process.cwd(), BANNER_DIR);
    if (!existsSync(fullPath)) return [];
    return readdirSync(fullPath).filter(
      (f) =>
        f.endsWith(".png") ||
        f.endsWith(".jpg") ||
        f.endsWith(".jpeg") ||
        f.endsWith(".webp")
    );
  } catch {
    return [];
  }
}

/** Deterministic banner for post ID when no cover. Same post = same banner */
export function getBannerForPost(postId: string): string {
  const files = getBannerFiles();
  if (files.length === 0) return "/image.png";
  let hash = 0;
  for (let i = 0; i < postId.length; i++)
    hash = (hash << 5) - hash + postId.charCodeAt(i);
  const idx = Math.abs(hash) % files.length;
  return `/Banner/${files[idx]}`;
}

/** Random banner URL from public/Banner */
export function getRandomBannerUrl(): string {
  const files = getBannerFiles();
  if (files.length === 0) return "/image.png";
  const random = files[Math.floor(Math.random() * files.length)];
  return `/Banner/${random}`;
}
