import { createClient } from "@/lib/supabase/server";
import { 
  FileText, 
  Search, 
  Filter, 
  CheckCircle, 
  Trash2, 
  Eye, 
  Download, 
  Star,
  User,
  Clock,
  Calendar,
  MoreVertical
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default async function NotesManagement() {
  const supabase = await createClient();

  // Fetch all notes with associated profiles
  const { data: notes, error } = await supabase
    .from("notes")
    .select(`
      *,
      profiles(name)
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Resources Library</h1>
          <p className="text-slate-500 font-medium mt-2">Verify content, manage subjects, and moderate uploads.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="rounded-2xl border-none bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/40 dark:shadow-none h-14 px-6 font-bold flex gap-2">
            <Filter size={18} /> Filter
          </Button>
          <div className="relative flex-grow md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <Input 
              placeholder="Search resources..." 
              className="pl-12 h-14 rounded-2xl border-none bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/40 dark:shadow-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {notes?.map((note) => (
          <div key={note.id} className="group relative bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/40 dark:shadow-none rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all p-6 flex flex-col lg:flex-row gap-8 items-center">
            
            {/* Note Preview Icon */}
            <div className="h-24 w-24 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
               <FileText size={40} className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors" />
            </div>

            {/* Info */}
            <div className="flex-grow space-y-3 text-center lg:text-left min-w-0">
               <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  <Badge className="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border-none font-black">{note.subject}</Badge>
                  <Badge variant="outline" className="rounded-lg font-bold">{note.type}</Badge>
                  {note.is_verified && (
                    <Badge className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-none font-black flex gap-1">
                       <CheckCircle size={12} /> Verified
                    </Badge>
                  )}
               </div>
               <h3 className="text-xl font-black text-slate-900 dark:text-white truncate pr-4">{note.title}</h3>
               <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 text-sm font-bold text-slate-400">
                  <div className="flex items-center gap-1.5"><User size={14} className="text-indigo-500" /> {note.profiles?.name || "Community Member"}</div>
                  <div className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(note.created_at).toLocaleDateString()}</div>
                  <div className="flex items-center gap-1.5"><Download size={14} className="text-emerald-500" /> {note.downloads || 0} Downloads</div>
                  <div className="flex items-center gap-1.5"><Star size={14} className="text-amber-500 fill-amber-500" /> {note.average_rating || 0} Rating</div>
               </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 lg:border-l lg:border-slate-100 lg:dark:border-slate-800 lg:pl-8">
               <Button variant="outline" className="rounded-2xl h-12 w-12 p-0 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-all border-slate-100 dark:border-slate-800">
                  <CheckCircle size={20} />
               </Button>
               <Link href={`/notes/${note.id}`} className="inline-flex items-center justify-center rounded-2xl h-12 px-6 bg-slate-900 dark:bg-slate-800 text-white font-bold hover:bg-indigo-600 transition-all">
                  View Resource
               </Link>
               <Button variant="outline" className="rounded-2xl h-12 w-12 p-0 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 transition-all border-slate-100 dark:border-slate-800">
                  <Trash2 size={20} />
               </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
