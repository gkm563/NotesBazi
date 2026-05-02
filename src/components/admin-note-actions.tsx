"use client";

import { useState } from "react";
import { Trash2, CheckCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteResourceByAdmin, verifyResourceAction } from "@/lib/actions/admin";
import { cn } from "@/lib/utils";

interface AdminNoteActionsProps {
  noteId: string;
  isVerified: boolean;
}

export function AdminNoteActions({ noteId, isVerified }: AdminNoteActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this resource?")) return;
    setLoading('delete');
    try {
      const res = await deleteResourceByAdmin(noteId);
      if (res.success) toast.success("Resource deleted successfully.");
      else throw new Error(res.error);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete resource");
    } finally {
      setLoading(null);
    }
  };

  const handleVerify = async () => {
    setLoading('verify');
    try {
      const res = await verifyResourceAction(noteId, isVerified);
      if (res.success) toast.success(isVerified ? "Verification removed." : "Resource verified!");
      else throw new Error(res.error);
    } catch (error: any) {
      toast.error(error.message || "Action failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-3">
      <Button 
        variant="outline" 
        onClick={handleVerify}
        disabled={!!loading}
        className={cn(
          "rounded-2xl h-12 w-12 p-0 transition-all border-slate-100 dark:border-slate-800",
          isVerified ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-200" : "hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600"
        )}
      >
        {loading === 'verify' ? <Loader className="animate-spin" size={18} /> : <CheckCircle size={20} />}
      </Button>
      
      <Button 
        variant="outline" 
        onClick={handleDelete}
        disabled={!!loading}
        className="rounded-2xl h-12 w-12 p-0 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 transition-all border-slate-100 dark:border-slate-800"
      >
        {loading === 'delete' ? <Loader className="animate-spin" size={18} /> : <Trash2 size={20} />}
      </Button>
    </div>
  );
}
