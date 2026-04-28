"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Star, 
  BookOpen, 
  FileText, 
  Layers, 
  ChevronRight,
  MoreVertical
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { toast } from "sonner";

export function NotesListing({ initialSearch = "" }: { initialSearch?: string }) {
  const supabase = createClient();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [yearFilter, setYearFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const fetchNotes = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,subject.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      if (yearFilter !== "All") {
        query = query.eq("year", yearFilter);
      }

      if (typeFilter !== "All") {
        query = query.eq("type", typeFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setNotes(data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [yearFilter, typeFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNotes();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-72 space-y-8 flex-shrink-0">
        <div className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/60 dark:border-slate-700/50 shadow-xl shadow-slate-200/20 dark:shadow-none">
          <h3 className="font-black text-slate-900 dark:text-white mb-6 flex items-center text-lg tracking-tight">
            <Filter size={20} className="mr-3 text-indigo-600" /> Filters
          </h3>
          
          <div className="space-y-6">
            <div className="space-y-3">
               <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Academic Year</label>
               <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="rounded-2xl border-slate-200 dark:border-slate-700 py-6 bg-slate-50 dark:bg-slate-800/50 focus:ring-indigo-500/20">
                     <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-200 dark:border-slate-700 shadow-2xl">
                     <SelectItem value="All" className="py-3">All Years</SelectItem>
                     <SelectItem value="1st" className="py-3">1st Year</SelectItem>
                     <SelectItem value="2nd" className="py-3">2nd Year</SelectItem>
                     <SelectItem value="3rd" className="py-3">3rd Year</SelectItem>
                     <SelectItem value="4th" className="py-3">4th Year</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            <div className="space-y-3">
               <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Resource Type</label>
               <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="rounded-2xl border-slate-200 dark:border-slate-700 py-6 bg-slate-50 dark:bg-slate-800/50 focus:ring-indigo-500/20">
                     <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-200 dark:border-slate-700 shadow-2xl">
                     <SelectItem value="All" className="py-3">All Types</SelectItem>
                     <SelectItem value="Notes" className="py-3">Study Notes</SelectItem>
                     <SelectItem value="Assignment" className="py-3">Assignments</SelectItem>
                     <SelectItem value="PYQ" className="py-3">Previous Year Qs</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
               <Button 
                  variant="ghost" 
                  onClick={() => {setYearFilter("All"); setTypeFilter("All"); setSearchTerm("");}}
                  className="w-full text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl py-6 transition-all"
               >
                  Reset All Filters
               </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow space-y-8">
        {/* Search Bar */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-2 rounded-3xl border border-slate-200/60 dark:border-slate-700/50 shadow-xl shadow-slate-200/20 dark:shadow-none">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <Search className="absolute left-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={24} />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, subject, or keywords..."
              className="pl-16 pr-32 py-8 text-lg rounded-2xl border-none shadow-none focus-visible:ring-0 bg-transparent dark:text-white"
            />
            <Button type="submit" className="absolute right-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-8 py-6 font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]">
              Search
            </Button>
          </form>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="h-[340px] bg-white/50 dark:bg-slate-800/50 rounded-[2rem] animate-pulse border border-slate-200/50 dark:border-slate-700/50" />
            ))}
          </div>
        ) : notes.length > 0 ? (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {notes.map((note) => (
              <StaggerItem key={note.id}>
                <Link href={`/notes/${note.id}`} className="group block h-full">
                  <Card className="h-full border border-slate-200/60 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-[2rem] hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-900/20 hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col">
                    <CardHeader className="relative p-6 pb-4">
                      <div className="absolute top-6 right-6 flex flex-col gap-2 items-end z-10">
                         <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 border-none rounded-xl px-3 py-1 backdrop-blur-md font-bold shadow-sm">
                           {note.year} Year
                         </Badge>
                         <Badge variant="outline" className="bg-white/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl px-3 py-1 backdrop-blur-md shadow-sm">
                           {note.type}
                         </Badge>
                      </div>
                      
                      <div className="h-32 w-full bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl flex items-center justify-center mb-6 group-hover:from-indigo-50 group-hover:to-violet-50 dark:group-hover:from-indigo-900/20 dark:group-hover:to-violet-900/20 transition-colors relative overflow-hidden">
                         <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-50" />
                         <FileText size={48} strokeWidth={1.5} className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-500 drop-shadow-sm relative z-10" />
                      </div>
                      
                      <p className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2 line-clamp-1">
                        {note.subject}
                      </p>
                      <CardTitle className="text-xl font-bold leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {note.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 flex-grow">
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {note.description || "Comprehensive resource uploaded for this subject. Click to view detailed AI summary and preview."}
                      </p>
                    </CardContent>
                    <CardFooter className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800/50 flex justify-between items-center mt-auto">
                      <div className="flex gap-4">
                        <div className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                          <Download size={14} className="mr-1.5 text-indigo-500" /> {note.downloads || 0}
                        </div>
                        <div className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                          <Star size={14} className="mr-1.5 text-amber-500 fill-amber-500" /> {note.average_rating || 0}
                        </div>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                        <ChevronRight size={16} className="text-indigo-600 group-hover:text-white transition-colors" />
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <div className="py-32 text-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
            <div className="h-24 w-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6">
               <Search size={40} className="text-indigo-300 dark:text-indigo-700" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3">No resources found</h3>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md">
              We couldn't find anything matching your filters. Try adjusting your search criteria or contribute by uploading!
            </p>
            <Button variant="outline" onClick={() => {setYearFilter("All"); setTypeFilter("All"); setSearchTerm("");}} className="mt-8 rounded-full px-8 py-6 border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
