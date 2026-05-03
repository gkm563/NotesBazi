"use client";

import { useState } from "react";
import { 
  Maximize2, 
  Download, 
  RefreshCcw, 
  Printer, 
  FileText,
  ExternalLink,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NoteViewerProps {
  fileUrl: string;
  title: string;
}

export function NoteViewer({ fileUrl, title }: NoteViewerProps) {
  const [key, setKey] = useState(0);
  const isImage = fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$|^data:image\//i);
  const isPdf = fileUrl.toLowerCase().includes(".pdf");

  const refreshViewer = () => setKey(prev => prev + 1);
  
  const handleDownload = async () => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = title || "note";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback to opening in new tab if fetch fails (CORS)
      window.open(fileUrl, "_blank");
    }
  };

  const handlePrint = () => {
    if (isPdf) {
      const printWindow = window.open(fileUrl, '_blank');
      printWindow?.print();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      {/* Viewer Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm z-20">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden sm:flex rounded-lg font-bold bg-slate-100 dark:bg-slate-800 text-[10px] uppercase">
            {isImage ? "Image" : isPdf ? "PDF" : "Document"}
          </Badge>
          <p className="text-xs font-bold text-slate-500 truncate max-w-[150px] md:max-w-xs">{title}</p>
        </div>
        
        <div className="flex items-center gap-1 md:gap-2">
            <Button title="Reload Viewer" variant="ghost" size="icon" onClick={refreshViewer} className="h-9 w-9 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
              <RefreshCcw size={18} className="text-slate-500" />
            </Button>

            {isPdf && (
              <Button title="Print PDF" variant="ghost" size="icon" onClick={handlePrint} className="hidden sm:flex h-9 w-9 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                <Printer size={18} className="text-slate-500" />
              </Button>
            )}

            <Button title="Full Screen" variant="ghost" size="icon" asChild className="h-9 w-9 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                <Maximize2 size={18} className="text-slate-500" />
              </a>
            </Button>

            <Button 
              variant="default" 
              size="sm" 
              onClick={handleDownload}
              className="h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold px-4 ml-2 shadow-lg shadow-indigo-500/20"
            >
              <Download size={16} className="mr-2" /> <span className="hidden sm:inline">Download</span>
            </Button>
          </div>
      </div>

      {/* Actual Content Area */}
      <div className="flex-grow relative overflow-hidden bg-slate-100 dark:bg-[#0B1120]">
        {isImage ? (
          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8 overflow-auto">
            <img 
              src={fileUrl} 
              alt={title} 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform hover:scale-105 duration-500" 
            />
          </div>
        ) : isPdf ? (
          <iframe 
            key={key}
            src={`${fileUrl}#toolbar=0&navpanes=0`} 
            className="absolute inset-0 w-full h-full border-none"
            title={title}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col">
            <iframe 
              key={key}
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`} 
              className="flex-grow w-full border-none"
              title={title}
            />
            {/* Fallback link for Google Docs Viewer instability */}
            <div className="bg-amber-50 dark:bg-amber-900/10 p-2 text-center border-t border-amber-100 dark:border-amber-900/30">
              <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                Having trouble viewing? <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Click here to open directly</a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
