"use client";

import { useState } from "react";
import { 
  FileText, 
  CheckCircle, 
  Trash2, 
  Download, 
  Star,
  User,
  Calendar,
  MoreVertical,
  X,
  CheckSquare,
  Square,
  ShieldCheck,
  Zap,
  Loader,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { AdminNoteActions } from "@/components/admin-note-actions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  bulkDeleteResourcesByAdmin, 
  bulkVerifyResourcesAction,
  bulkUpdateDetailsByAdmin 
} from "@/lib/actions/admin";

interface AdminNotesListProps {
  initialNotes: any[];
}

export function AdminNotesList({ initialNotes }: AdminNotesListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  const toggleSelectAll = () => {
    if (selectedIds.length === initialNotes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(initialNotes.map(n => n.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} resources?`)) return;
    setLoading('delete');
    try {
      const res = await bulkDeleteResourcesByAdmin(selectedIds);
      if (res.success) {
        toast.success(`${selectedIds.length} resources deleted.`);
        setSelectedIds([]);
      } else throw new Error(res.error);
    } catch (err: any) {
      toast.error(err.message || "Bulk delete failed");
    } finally {
      setLoading(null);
    }
  };

  const handleBulkVerify = async (status: boolean) => {
    setLoading('verify');
    try {
      const res = await bulkVerifyResourcesAction(selectedIds, status);
      if (res.success) {
        toast.success(`${selectedIds.length} resources updated.`);
        setSelectedIds([]);
      } else throw new Error(res.error);
    } catch (err: any) {
      toast.error(err.message || "Bulk verify failed");
    } finally {
      setLoading(null);
    }
  };

  const handleBulkUpdate = async (details: { year?: string; semester?: number }) => {
    setLoading('update');
    try {
      const res = await bulkUpdateDetailsByAdmin(selectedIds, details);
      if (res.success) {
        toast.success(`Updated ${selectedIds.length} resources.`);
        setSelectedIds([]);
      } else throw new Error(res.error);
    } catch (err: any) {
      toast.error(err.message || "Bulk update failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-slate-800 text-white px-8 py-4 rounded-[2.5rem] shadow-2xl flex items-center gap-8 border border-slate-700/50 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 border-r border-slate-700 pr-8">
               <div className="h-10 w-10 bg-indigo-500 rounded-full flex items-center justify-center font-black">
                  {selectedIds.length}
               </div>
               <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Selected</p>
            </div>

            <div className="flex items-center gap-4">
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" className="h-12 rounded-2xl font-bold hover:bg-slate-800 flex gap-2">
                        <Zap size={18} className="text-amber-400" /> Bulk Update Details
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-2xl p-2 w-56">
                     <DropdownMenuLabel>Change Year</DropdownMenuLabel>
                     {["1st", "2nd", "3rd", "4th"].map(y => (
                       <DropdownMenuItem key={y} onClick={() => handleBulkUpdate({ year: y })} className="rounded-xl font-bold">
                          Set to {y} Year
                       </DropdownMenuItem>
                     ))}
                     <DropdownMenuSeparator />
                     <DropdownMenuLabel>Change Semester</DropdownMenuLabel>
                     {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                       <DropdownMenuItem key={s} onClick={() => handleBulkUpdate({ semester: s })} className="rounded-xl font-bold">
                          Set to Semester {s}
                       </DropdownMenuItem>
                     ))}
                  </DropdownMenuContent>
               </DropdownMenu>

               <Button 
                variant="ghost" 
                onClick={() => handleBulkVerify(true)}
                className="h-12 rounded-2xl font-bold hover:bg-slate-800 text-emerald-400 flex gap-2"
               >
                  <ShieldCheck size={18} /> Verify All
               </Button>

               <Button 
                variant="ghost" 
                onClick={handleBulkDelete}
                className="h-12 rounded-2xl font-bold hover:bg-red-900/30 text-red-400 flex gap-2"
               >
                  <Trash2 size={18} /> Delete All
               </Button>

               <Button 
                variant="outline" 
                onClick={() => setSelectedIds([])}
                className="h-12 w-12 rounded-full border-slate-700 p-0 hover:bg-slate-800"
               >
                  <X size={20} />
               </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between px-4">
         <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={toggleSelectAll}
              className="font-bold flex gap-2 rounded-xl"
            >
               {selectedIds.length === initialNotes.length ? <CheckSquare className="text-indigo-500" /> : <Square />}
               {selectedIds.length === initialNotes.length ? "Deselect All" : "Select All Resources"}
            </Button>
         </div>
         <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{initialNotes.length} resources total</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {initialNotes?.map((note) => (
          <div 
            key={note.id} 
            onClick={() => toggleSelect(note.id)}
            className={cn(
              "group relative bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/40 dark:shadow-none rounded-[2rem] border transition-all p-6 flex flex-col lg:flex-row gap-8 items-center cursor-pointer",
              selectedIds.includes(note.id) ? "border-indigo-500 bg-indigo-50/10" : "border-slate-100 dark:border-slate-800 hover:border-indigo-200"
            )}
          >
            {/* Selection Checkbox */}
            <div className="absolute top-6 left-6 z-10">
               <Checkbox 
                 checked={selectedIds.includes(note.id)} 
                 onCheckedChange={() => toggleSelect(note.id)}
                 className="h-6 w-6 rounded-lg border-2 border-slate-200"
               />
            </div>
            
            {/* Note Preview Icon */}
            <div className="h-24 w-24 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors ml-4">
               <FileText size={40} className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors" />
            </div>

            {/* Info */}
            <div className="flex-grow space-y-3 text-center lg:text-left min-w-0">
               <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  <Badge className="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border-none font-black">{note.subject}</Badge>
                  <Badge variant="outline" className="rounded-lg font-bold">{note.type}</Badge>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 rounded-lg font-black">{note.year} Year • Sem {note.semester || "NA"}</Badge>
                  {note.is_verified && (
                    <Badge className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-none font-black flex gap-1">
                       <CheckCircle size={12} /> Verified
                    </Badge>
                  )}
               </div>
               <h3 className="text-xl font-black text-slate-900 dark:text-white truncate pr-4">{note.title}</h3>
               <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 text-sm font-bold text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <User size={14} className="text-indigo-500" /> 
                    {note.profiles?.username ? `@${note.profiles.username}` : "NotesBazi"}
                  </div>
                  <div className="flex items-center gap-1.5"><Calendar size={14} /> {note.created_at ? new Date(note.created_at).toISOString().split('T')[0] : "N/A"}</div>
                  <div className="flex items-center gap-1.5"><Download size={14} className="text-emerald-500" /> {note.downloads || 0} Downloads</div>
                  <div className="flex items-center gap-1.5"><Star size={14} className="text-amber-500 fill-amber-500" /> {note.average_rating || 0} Rating</div>
               </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 lg:border-l lg:border-slate-100 lg:dark:border-slate-800 lg:pl-8" onClick={(e) => e.stopPropagation()}>
               <AdminNoteActions note={note} />
               <Link href={`/notes/${note.id}`} className="inline-flex items-center justify-center rounded-2xl h-12 px-6 bg-slate-900 dark:bg-slate-800 text-white font-bold hover:bg-indigo-600 transition-all">
                  View
               </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
