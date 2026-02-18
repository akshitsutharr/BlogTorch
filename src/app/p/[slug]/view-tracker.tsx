"use client";

import { useEffect, useRef } from "react";
import { incrementView } from "./actions";

export function ViewTracker({ postId }: { postId: string }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      incrementView(postId).catch((err: unknown) =>
        console.error("Failed to increment view", err)
      );
    }
  }, [postId]);

  return null;
}
