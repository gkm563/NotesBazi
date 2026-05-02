"use client";

import { useState } from "react";
import { 
  X, 
  AlertTriangle, 
  Loader,
  CheckCircle2,
  Flag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { reportNoteAction } from "@/lib/actions/notes";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ReportModalProps {
  noteId: string;
  noteTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_REASONS = [
  "Inappropriate content",
  "Copyright violation",
  "Incorrect subject/year",
  "Broken file or poor quality",
  "Spam or misleading",
  "Other"
];

export function ReportModal({ noteId, noteTitle, isOpen, onClose }: ReportModalProps) {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return toast.error("Please select a reason");
    
    setLoading(true);
    try {
      const finalReason = reason === "Other" ? `Other: ${description}` : reason;
      await reportNoteAction({ noteId, reason: finalReason });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setReason("");
        setDescription("");
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
          >
            {submitted ? (
              <div className="p-12 text-center space-y-6">
                 <div className="h-20 w-20 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 size={48} />
                 </div>
                 <h2 className="text-2xl font-black text-slate-900 dark:text-white">Report Submitted</h2>
                 <p className="text-slate-500 font-medium leading-relaxed">
                   Thank you for helping us keep NotesBazi safe. Our team will review this resource shortly.
                 </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8">
                <div className="flex justify-between items-center mb-8">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center text-red-600">
                         <Flag size={20} />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">Report Resource</h3>
                   </div>
                   <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}>
                      <X size={20} />
                   </Button>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Reporting</p>
                     <p className="font-bold text-slate-900 dark:text-white truncate">{noteTitle}</p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Reason for reporting</Label>
                    <div className="grid grid-cols-1 gap-2">
                       {REPORT_REASONS.map((r) => (
                         <button
                           key={r}
                           type="button"
                           onClick={() => setReason(r)}
                           className={cn(
                             "w-full text-left px-5 py-4 rounded-xl text-sm font-bold transition-all border-2",
                             reason === r 
                               ? "bg-red-50 dark:bg-red-900/20 text-red-600 border-red-200 dark:border-red-900/50" 
                               : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700 hover:border-red-200"
                           )}
                         >
                           {r}
                         </button>
                       ))}
                    </div>
                  </div>

                  {reason === "Other" && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-2"
                    >
                      <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Additional Details</Label>
                      <Textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please describe the issue..."
                        className="rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 min-h-[100px]"
                        required
                      />
                    </motion.div>
                  )}
                </div>

                <div className="mt-10">
                   <Button 
                     type="submit" 
                     disabled={loading || !reason}
                     className={cn(
                       "w-full py-8 rounded-2xl text-lg font-black shadow-xl transition-all",
                       reason ? "bg-red-600 hover:bg-red-700 text-white shadow-red-500/20" : "bg-slate-100 text-slate-400"
                     )}
                   >
                     {loading ? <Loader className="animate-spin" /> : "Submit Report"}
                   </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Utility to merge classes
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
