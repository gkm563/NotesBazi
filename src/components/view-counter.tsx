"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function ViewCounter({ noteId }: { noteId: string }) {
  const supabase = createClient();

  useEffect(() => {
    const incrementViews = async () => {
      // Small delay to avoid double counts and ensure it's a "real" view
      const timer = setTimeout(async () => {
        await supabase.rpc('increment_views', { note_id: noteId });
      }, 2000);
      
      return () => clearTimeout(timer);
    };

    incrementViews();
  }, [noteId]);

  return null;
}
