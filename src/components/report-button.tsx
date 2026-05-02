"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportModal } from "./report-modal";

interface ReportButtonProps {
  noteId: string;
  noteTitle: string;
}

export function ReportButton({ noteId, noteTitle }: ReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsOpen(true)}
        className="rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 h-9 w-9"
      >
        <Flag size={16} />
      </Button>
      <ReportModal 
        noteId={noteId} 
        noteTitle={noteTitle} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}
