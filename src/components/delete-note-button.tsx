"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader } from "lucide-react";
import { toast } from "sonner";
import { deleteNoteAction } from "@/lib/actions/notes";

export function DeleteNoteButton({ noteId }: { noteId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this resource? This cannot be undone.");
    if (!confirm) return;

    setIsDeleting(true);
    try {
      await deleteNoteAction(noteId);
      toast.success("Note deleted successfully.");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete note.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded-xl h-10 w-10 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
    >
      {isDeleting ? <Loader size={18} className="animate-spin" /> : <Trash2 size={18} />}
    </Button>
  );
}
