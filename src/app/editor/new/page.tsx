import { redirect } from "next/navigation";

import { ensureDbUser } from "@/server/me";
import { createDraftPostForAuthor } from "@/server/posts";

export default async function Page() {
  const me = await ensureDbUser();
  const post = await createDraftPostForAuthor(me.id);
  redirect(`/editor/${post.id}`);
}


