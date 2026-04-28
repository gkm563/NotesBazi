"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Download, 
  Star, 
  BookMarked, 
  Bookmark,
  Loader
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface NoteActionsProps {
  noteId: string;
  fileUrl: string;
}

export function NoteActions({ noteId, fileUrl }: NoteActionsProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkState = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        // Check bookmark (saved_notes)
        const { data: bookmark } = await supabase
          .from("saved_notes")
          .select("id")
          .eq("note_id", noteId)
          .eq("user_id", user.id)
          .single();
        setIsBookmarked(!!bookmark);

        // Check rating
        const { data: rating } = await supabase
          .from("ratings")
          .select("rating")
          .eq("note_id", noteId)
          .eq("user_id", user.id)
          .single();
        if (rating) setUserRating(rating.rating);
      }
    };
    checkState();
  }, [noteId]);

  const toggleBookmark = async () => {
    if (!user) return toast.error("Please login to save notes");
    setLoading(true);
    try {
      if (isBookmarked) {
        await supabase.from("saved_notes").delete().eq("note_id", noteId).eq("user_id", user.id);
        setIsBookmarked(false);
        toast.success("Removed from Saved Notes");
      } else {
        await supabase.from("saved_notes").insert({ note_id: noteId, user_id: user.id });
        setIsBookmarked(true);
        toast.success("Added to Saved Notes");
      }
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (rating: number) => {
    if (!user) return toast.error("Please login to rate");
    try {
      const { error } = await supabase.from("ratings").upsert({
        note_id: noteId,
        user_id: user.id,
        rating
      }, { onConflict: "note_id, user_id" });
      
      if (error) throw error;
      setUserRating(rating);
      toast.success(`Rated ${rating} stars!`);
    } catch (error) {
      toast.error("Rating failed");
    }
  };

  const handleDownload = async () => {
    // Increment download count
    await supabase.rpc('increment_downloads', { note_id: noteId });
    window.open(fileUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button 
          onClick={handleDownload}
          className="flex-grow py-7 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-bold shadow-lg shadow-indigo-500/20"
        >
          <Download size={20} className="mr-3" /> Download Note
        </Button>
        <Button 
          variant="outline" 
          onClick={toggleBookmark}
          disabled={loading}
          className={`px-6 rounded-2xl border-slate-200 dark:border-slate-800 ${isBookmarked ? "text-indigo-600 bg-indigo-50" : ""}`}
        >
          {isBookmarked ? <BookMarked size={20} /> : <Bookmark size={20} />}
        </Button>
      </div>

      <div className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Rate this resource</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button 
              key={star} 
              onClick={() => handleRate(star)}
              className="p-1 hover:scale-125 transition-transform"
            >
              <Star 
                size={28} 
                fill={star <= userRating ? "currentColor" : "none"} 
                className={star <= userRating ? "text-amber-500" : "text-slate-300 dark:text-slate-700"} 
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
