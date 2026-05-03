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
  MoreVertical,
  AlertCircle,
  ArrowUpDown
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
import { AdminNoteActions } from "@/components/admin-note-actions";
import { AdminNotesList } from "@/components/admin-notes-list";
import { AdminSearch } from "@/components/admin-search";
import { cn } from "@/lib/utils";

interface PageProps {
  searchParams: Promise<{
    sort?: string;
    order?: 'asc' | 'desc';
    q?: string;
    status?: 'all' | 'verified' | 'unverified';
    type?: string;
  }>
}

export default async function NotesManagement({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  
  const sort = params.sort || 'created_at';
  const order = params.order || 'desc';
  const query = params.q || '';
  const status = params.status || 'all';
  const typeFilter = params.type || 'all';

  // 1. Prepare Queries
  let dbQuery = supabase.from("notes").select("*");

  if (query) {
    dbQuery = dbQuery.or(`title.ilike.%${query}%,subject.ilike.%${query}%`);
  }

  if (status === 'verified') {
    dbQuery = dbQuery.eq('is_verified', true);
  } else if (status === 'unverified') {
    dbQuery = dbQuery.eq('is_verified', false);
  }

  if (typeFilter !== 'all') {
    dbQuery = dbQuery.eq('type', typeFilter);
  }

  if (['created_at', 'downloads', 'views', 'title'].includes(sort)) {
    dbQuery = dbQuery.order(sort, { ascending: order === 'asc' });
  } else {
    dbQuery = dbQuery.order('created_at', { ascending: false });
  }

  const { data: notesData, error: notesError } = await dbQuery;

  if (notesError) {
    console.error("Error fetching notes:", notesError);
  }

  // 2. Fetch profiles for these notes to manually join
  let notes = notesData || [];
  if (notes.length > 0) {
    const userIds = [...new Set(notes.map(n => n.uploaded_by).filter(Boolean))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, name, email")
      .in("id", userIds);

    // Map profiles for quick lookup
    const profileMap = Object.fromEntries(profiles?.map(p => [p.id, p]) || []);
    
    // Join manually
    notes = notes.map(note => ({
      ...note,
      profiles: note.uploaded_by ? profileMap[note.uploaded_by] : null
    }));
  }

  const error = notesError;

  // 3. Calculate Stats
  const totalNotes = notes.length;
  const totalDownloads = notes.reduce((acc, curr) => acc + (curr.downloads || 0), 0);
  const totalVerified = notes.filter(n => n.is_verified).length;

  const getFilterLink = (key: string, value: string) => {
    const newParams = new URLSearchParams();
    if (params.sort) newParams.set('sort', params.sort);
    if (params.order) newParams.set('order', params.order);
    if (params.q) newParams.set('q', params.q);
    if (params.status) newParams.set('status', params.status);
    if (params.type) newParams.set('type', params.type);
    
    if (value === 'all') newParams.delete(key);
    else newParams.set(key, value);
    
    return `/admin/notes?${newParams.toString()}`;
  };

  const getSortLink = (column: string) => {
    const newOrder = sort === column && order === 'asc' ? 'desc' : 'asc';
    const newParams = new URLSearchParams();
    newParams.set('sort', column);
    newParams.set('order', newOrder);
    if (params.q) newParams.set('q', params.q);
    if (params.status) newParams.set('status', params.status);
    if (params.type) newParams.set('type', params.type);
    
    return `/admin/notes?${newParams.toString()}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Resources Library</h1>
          <p className="text-slate-500 font-medium mt-2">Verify content, manage subjects, and moderate uploads.</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-2xl border-none bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/40 dark:shadow-none h-14 px-6 font-bold flex gap-2">
                <Filter size={18} /> {status === 'all' ? 'Status' : status.toUpperCase()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-2xl p-2 w-48 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <DropdownMenuItem asChild className="rounded-xl font-bold">
                <Link href={getFilterLink('status', 'all')}>All Status</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-xl font-bold text-emerald-600">
                <Link href={getFilterLink('status', 'verified')}>Verified Only</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-xl font-bold text-amber-600">
                <Link href={getFilterLink('status', 'unverified')}>Unverified Only</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-2xl border-none bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/40 dark:shadow-none h-14 px-6 font-bold flex gap-2">
                <ArrowUpDown size={18} /> Sort By
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-2xl p-2 w-48 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <DropdownMenuItem asChild className="rounded-xl font-bold">
                <Link href={getSortLink('created_at')}>Newest First</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-xl font-bold">
                <Link href={getSortLink('downloads')}>Most Downloads</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-xl font-bold">
                <Link href={getSortLink('views')}>Most Views</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-xl font-bold">
                <Link href={getSortLink('title')}>Alphabetical</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AdminSearch defaultValue={query} placeholder="Search resources..." />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Resources", value: totalNotes, color: "text-blue-600", bg: "bg-blue-50", icon: FileText },
          { label: "Total Downloads", value: totalDownloads, color: "text-emerald-600", bg: "bg-emerald-50", icon: Download },
          { label: "Verified Content", value: totalVerified, color: "text-amber-600", bg: "bg-amber-50", icon: CheckCircle },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-xl shadow-slate-200/20 dark:shadow-none bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
            <CardContent className="p-6 flex items-center justify-between">
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</p>
               </div>
               <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                  <stat.icon size={20} className={stat.color} />
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {error && (
        <div className="p-6 bg-red-50 text-red-600 rounded-3xl flex items-center gap-3 font-bold border border-red-100">
           <AlertCircle /> Error loading resources: {error.message}
        </div>
      )}

      <AdminNotesList initialNotes={notes} />
      
      {notes?.length === 0 && !error && (
        <div className="p-20 bg-white dark:bg-slate-900 rounded-[3rem] text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
           <FileText size={48} className="mx-auto text-slate-200 mb-4" />
           <p className="text-slate-500 font-bold">No resources found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}

