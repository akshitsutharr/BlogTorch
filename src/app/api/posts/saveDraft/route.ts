import { POST as basePost } from "@/app/api/saveDraft/route";

export async function POST(req: Request) {
  // Reuse the same handler as /api/saveDraft so tests hitting
  // /api/posts/saveDraft receive identical behavior.
  return basePost(req);
}


