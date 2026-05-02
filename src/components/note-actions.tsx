"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Download, 
  Star, 
  BookMarked, 
  Bookmark,
  Loader,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

  const handleShare = async () => {
    try {
      const shareData = {
        title: "Check out this resource on NotesBazi!",
        text: "Hey, I found this helpful study material on NotesBazi. Check it out!",
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={handleDownload}
          className="flex-grow py-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-black shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-95"
        >
          <Download size={22} className="mr-3" /> Download Now
        </Button>
        <div className="flex gap-4 sm:flex-shrink-0">
          <Button 
            variant="outline" 
            onClick={toggleBookmark}
            disabled={loading}
            className={cn(
              "h-16 w-16 rounded-2xl border-2 transition-all",
              isBookmarked ? "text-indigo-600 bg-indigo-50 border-indigo-200" : "border-slate-200 dark:border-slate-800 hover:border-indigo-400"
            )}
          >
            {isBookmarked ? <BookMarked size={24} /> : <Bookmark size={24} />}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleShare}
            className="h-16 w-16 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition-all"
          >
            <Share2 size={24} />
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-slate-100 dark:border-slate-800 shadow-inner">
        <div className="flex items-center gap-2 mb-1">
           <Star size={14} className="text-amber-500 fill-amber-500" />
           <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Rate this Resource</p>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button 
              key={star} 
              onClick={() => handleRate(star)}
              className="p-1 hover:scale-125 transition-transform duration-200"
            >
              <Star 
                size={32} 
                fill={star <= userRating ? "currentColor" : "none"} 
                className={cn(
                  "transition-colors",
                  star <= userRating ? "text-amber-500" : "text-slate-200 dark:text-slate-700 hover:text-amber-200"
                )} 
              />
            </button>
          ))}
        </div>
        {userRating > 0 && <p className="text-xs font-bold text-indigo-600 mt-2">You rated this {userRating}/5</p>}
      </div>
    </div>
  );
}
