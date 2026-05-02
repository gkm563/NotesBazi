"use client";

import { 
  X, 
  Maximize2, 
  Download, 
  ExternalLink,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface NotePreviewModalProps {
  note: any;
  isOpen: boolean;
  onClose: () => void;
}

export function NotePreviewModal({ note, isOpen, onClose }: NotePreviewModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  if (!note) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl h-[85vh] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/20 dark:border-slate-800"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 relative z-20">
               <div className="flex flex-col">
                  <h3 className="font-black text-xl text-slate-900 dark:text-white truncate max-w-md">
                    {note.title}
                  </h3>
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{note.subject}</p>
               </div>
               <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-full" asChild>
                    <a href={`/notes/${note.id}`} target="_blank">
                       <ExternalLink size={18} />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 hover:text-red-500" onClick={onClose}>
                    <X size={20} />
                  </Button>
               </div>
            </div>

            {/* Viewer Content */}
            <div className="flex-grow bg-slate-100 dark:bg-slate-950 relative overflow-hidden">
               {isLoading && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                    <Loader2 size={40} className="animate-spin mb-4 text-indigo-600" />
                    <p className="font-bold text-sm">Preparing Quick Preview...</p>
                 </div>
               )}
               
               {note.file_url.toLowerCase().endsWith('.pdf') ? (
                 <iframe 
                    src={`${note.file_url}#toolbar=0&navpanes=0`} 
                    className="w-full h-full border-none"
                    onLoad={() => setIsLoading(false)}
                 />
               ) : (
                 <iframe 
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(note.file_url)}`} 
                    className="w-full h-full border-none"
                    onLoad={() => setIsLoading(false)}
                 />
               )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
               <p className="text-sm font-medium text-slate-500">
                  Tip: Use full view for AI summaries and keywords.
               </p>
               <Button className="rounded-full bg-indigo-600 hover:bg-indigo-700 px-8" asChild>
                  <a href={note.file_url} download target="_blank">
                    <Download size={18} className="mr-2" /> Download Now
                  </a>
               </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
