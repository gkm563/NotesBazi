"use client";

import { useState } from "react";
import { Trash2, CheckCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteResourceByAdmin, resolveReport } from "@/lib/actions/admin";

interface AdminReportActionsProps {
  reportId: string;
  noteId: string;
}

export function AdminReportActions({ reportId, noteId }: AdminReportActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this resource?")) return;
    setLoading('delete');
    try {
      const res = await deleteResourceByAdmin(noteId, reportId);
      if (res.success) toast.success("Resource deleted and report resolved.");
      else throw new Error(res.error);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete resource");
    } finally {
      setLoading(null);
    }
  };

  const handleDismiss = async () => {
    setLoading('dismiss');
    try {
      const res = await resolveReport(reportId, 'ignored');
      if (res.success) toast.success("Report dismissed.");
      else throw new Error(res.error);
    } catch (error: any) {
      toast.error(error.message || "Failed to dismiss report");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full lg:w-64">
      <Button 
        onClick={handleDelete}
        disabled={!!loading}
        className="w-full h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black shadow-lg shadow-red-500/20 flex gap-2"
      >
        {loading === 'delete' ? <Loader className="animate-spin" /> : <Trash2 size={20} />}
        Delete Resource
      </Button>
      <Button 
        variant="outline" 
        onClick={handleDismiss}
        disabled={!!loading}
        className="w-full h-14 rounded-2xl font-black border-slate-200 dark:border-slate-800 flex gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-600"
      >
        {loading === 'dismiss' ? <Loader className="animate-spin" /> : <CheckCircle size={20} />}
        Dismiss Report
      </Button>
    </div>
  );
}
