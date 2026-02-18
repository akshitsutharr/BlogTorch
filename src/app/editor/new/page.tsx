import { redirect } from "next/navigation";

import { ensureDbUser } from "@/server/me";
import { createDraftPostForAuthor } from "@/server/posts";
import { getAuthUser } from "@/server/auth";

export const dynamic = "force-dynamic";

export default async function Page() {
  const authUser = await getAuthUser();
  if (!authUser) {
    redirect("/sign-in");
  }

  try {
    const me = await ensureDbUser(authUser);
    const post = await createDraftPostForAuthor(me.id);
    redirect(`/editor/${post.id}`);
  } catch (error) {
    console.error("Failed to create new post:", error);
    redirect("/dashboard");
  }
}


