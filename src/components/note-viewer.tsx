"use client";

import { useState, useEffect } from "react";
import { 
  Maximize2, 
  Download, 
  RefreshCcw, 
  Printer, 
  FileText,
  ExternalLink,
  Search,
  Eye
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
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      window.open(fileUrl, "_blank");
    }
  };

  const handlePrint = () => {
    if (isPdf) {
      const printWindow = window.open(fileUrl, '_blank');
      printWindow?.print();
    }
  };

  // Google Docs Viewer is much more reliable for mobile PDF viewing
  const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;

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

            {isPdf && !isMobile && (
              <Button title="Print PDF" variant="ghost" size="icon" onClick={handlePrint} className="hidden sm:flex h-9 w-9 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                <Printer size={18} className="text-slate-500" />
              </Button>
            )}

            <Button title="Open Direct" variant="ghost" size="icon" asChild className="h-9 w-9 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
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
        ) : (
          <div className="absolute inset-0 flex flex-col">
            <iframe 
              key={`${key}-${isMobile}`}
              src={isMobile || !isPdf ? googleDocsViewerUrl : `${fileUrl}#toolbar=0&navpanes=0`} 
              className="flex-grow w-full border-none"
              title={title}
            />
            {/* Fallback & Helper Bar */}
            <div className="bg-white dark:bg-slate-900 p-3 text-center border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-3">
              <p className="text-[11px] font-bold text-slate-500">
                Having trouble viewing?
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild className="h-7 text-[10px] rounded-lg font-black border-indigo-200 text-indigo-600 dark:border-indigo-900/50 dark:text-indigo-400">
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                    <Eye size={12} className="mr-1" /> OPEN DIRECTLY
                  </a>
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload} className="h-7 text-[10px] rounded-lg font-black border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400">
                  <Download size={12} className="mr-1" /> SAVE COPY
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
