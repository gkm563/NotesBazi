import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { 
  Download, 
  Eye, 
  Calendar, 
  User, 
  BookMarked,
  Star,
  FileText,
  Share2,
  Flag,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { NoteActions } from "@/components/note-actions";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { ViewCounter } from "@/components/view-counter";
import { ReportButton } from "@/components/report-button";
import { cn } from "@/lib/utils";
export default async function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: note, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();

  if (note && note.uploaded_by) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, department, role")
      .eq("id", note.uploaded_by)
      .single();
    if (profile) {
      note.profiles = profile;
    }
  }

  if (error || !note) {
    return notFound();
  }

  let aiSummary = note.summary;
  let aiKeywords = note.keywords || [];

  // Fetch similar notes (same subject or year, excluding current)
  const { data: similarNotes } = await supabase
    .from("notes")
    .select("id, title, subject, year, downloads")
    .neq("id", id)
    .or(`subject.eq."${note.subject}",year.eq."${note.year}"`)
    .limit(4);

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] transition-colors pb-24">
      <ViewCounter noteId={id} />
      {/* Premium Header Background */}
      <div className="h-64 w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800 absolute top-0 left-0 z-0 opacity-10 dark:opacity-20" />
      <div className="h-64 w-full bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] absolute top-0 left-0 z-0 opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-6 md:pt-12">
        <Link href="/notes" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 md:mb-8 transition-colors bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800">
          <ArrowLeft size={16} className="mr-2" /> Back to Explore
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          {/* Left Column: Preview */}
          <AnimatedSection direction="right" delay={0.2} className="lg:col-span-2 space-y-8">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl shadow-indigo-500/5 dark:shadow-none border border-slate-200/60 dark:border-slate-700/50 h-[500px] md:h-[600px] lg:h-[800px] flex flex-col">
              <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                  <div className="h-8 w-8 md:h-10 md:w-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                     <FileText className="text-indigo-600 dark:text-indigo-400" size={18} />
                  </div>
                  <span className="font-black text-slate-900 dark:text-white truncate text-sm md:text-base">{note.title}</span>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" className="hidden sm:flex rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
                     <Share2 size={16} className="mr-2" /> Share
                  </Button>
                  <ReportButton noteId={id} noteTitle={note.title} />
                </div>
              </div>
              <div className="flex-grow bg-slate-100 dark:bg-[#0B1120] relative group overflow-hidden">
                  {/* Enhanced File Viewer with Native PDF and Image Support */}
                  {note.file_url.match(/\.(jpg|jpeg|png|gif|webp)$|^data:image\//i) ? (
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <img 
                        src={note.file_url} 
                        alt={note.title} 
                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                      />
                    </div>
                  ) : note.file_url.toLowerCase().includes(".pdf") ? (
                    <iframe 
                      src={`${note.file_url}#toolbar=0&navpanes=0`} 
                      className="absolute inset-0 w-full h-full border-none z-10"
                      title={note.title}
                    />
                  ) : (
                    <iframe 
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(note.file_url)}&embedded=true`} 
                      className="absolute inset-0 w-full h-full border-none z-10"
                      title={note.title}
                    />
                  )}
              </div>
            </div>
          </AnimatedSection>

          {/* Right Column: Metadata & Actions */}
          <AnimatedSection direction="left" delay={0.3} className="space-y-6">
            {/* Primary Details Card */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/60 dark:border-slate-700/50">
              <div className="flex gap-2 mb-6">
                 <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 border-none rounded-lg px-3 py-1 font-bold">
                    {note.type}
                 </Badge>
                 <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400 rounded-lg px-3 py-1 font-bold flex items-center gap-1">
                    <Star size={12} className="fill-amber-500" /> {note.average_rating || "Top Rated"}
                 </Badge>
              </div>
              
              <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight mb-3">{note.title}</h1>
              <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest text-sm mb-8">{note.subject}</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-6 border-y border-slate-100 dark:border-slate-800 mb-8">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest mb-1">Academic Year</p>
                  <p className="text-xl font-black text-slate-700 dark:text-slate-200">{note.year} Year</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest mb-1">Total Views</p>
                  <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{note.views || 0}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 col-span-2 md:col-span-1">
                  <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest mb-1">Downloads</p>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{note.downloads || 0}</p>
                </div>
              </div>

              <div className="space-y-5 mb-8">
                <Link href={`/profile/${note.profiles?.username || note.uploaded_by}`} className="flex items-center gap-4 group">
                  <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Uploaded by</p>
                    <p className="text-base font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                       {note.profiles?.role === 'admin' ? "System Admin - NotesBazi" : (note.profiles?.name || "Student")}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{note.profiles?.role === 'admin' ? "Platform" : (note.profiles?.department || "General")} Department</p>
                  </div>
                </Link>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-sm">
                    <Clock size={20} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Published On</p>
                    <p className="text-base font-bold text-slate-900 dark:text-white">
                      {new Date(note.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} • {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>

              <NoteActions noteId={note.id} fileUrl={note.file_url} />
            </div>

            {/* AI Insights Card */}
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-[2rem] p-8 shadow-xl border border-indigo-500/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Sparkles size={100} className="text-indigo-200" />
               </div>
               <h3 className="text-lg font-black text-white flex items-center mb-4 relative z-10">
                 <Sparkles size={20} className="mr-2 text-indigo-400" /> AI Smart Summary
               </h3>
               <div className="relative z-10 mb-6">
                 <p className="text-sm text-indigo-100/80 leading-relaxed font-medium">
                   {aiSummary || "An AI-powered summary for this resource is currently being processed and will be available shortly."}
                 </p>
               </div>
               <div className="flex flex-wrap gap-2 relative z-10">
                 {aiKeywords.map((kw: string, i: number) => (
                   <Badge key={i} className="bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30 border-indigo-400/30 rounded-xl px-3 py-1 font-semibold">
                     #{kw}
                   </Badge>
                 ))}
                 {aiKeywords.length === 0 && (
                    <Badge className="bg-indigo-500/20 text-indigo-200 border-indigo-400/30 rounded-xl px-3 py-1 font-semibold">#studymaterial</Badge>
                 )}
               </div>
            </div>

            {/* Description Card */}
            {note.description && (
               <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/60 dark:border-slate-700/50">
                  <h3 className="font-black text-slate-900 dark:text-white mb-4">Uploader Description</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {note.description}
                  </p>
               </div>
            )}
          </AnimatedSection>
        </div>

        {/* Recommendations Section */}
        <AnimatedSection direction="up" delay={0.4} className="mt-16 mb-8">
           <div className="flex items-center justify-between mb-8">
              <div>
                 <h2 className="text-3xl font-black text-slate-900 dark:text-white">Recommended For You</h2>
                 <p className="text-slate-500 mt-2 font-medium">Similar notes from {note.subject} and {note.year} Year</p>
              </div>
           </div>
           
           <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {similarNotes && similarNotes.length > 0 ? similarNotes.map((item) => (
                 <StaggerItem key={item.id}>
                   <Link href={`/notes/${item.id}`} className="bg-white/80 dark:bg-slate-900/80 rounded-[2rem] p-6 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between h-48 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all group cursor-pointer">
                      <div>
                         <Badge className="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 border-none mb-4 truncate max-w-full block">{item.subject}</Badge>
                         <h4 className="font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">{item.title}</h4>
                      </div>
                      <div className="flex justify-between items-center text-sm font-semibold text-slate-400 mt-4">
                         <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-xs">{item.year} Year</span>
                         <span className="flex items-center bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-md text-xs">
                           <Download size={12} className="mr-1"/> {item.downloads || 0}
                         </span>
                      </div>
                   </Link>
                 </StaggerItem>
              )) : (
                 <div className="col-span-full py-12 text-center bg-slate-50/50 dark:bg-slate-800/20 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800 text-slate-500">
                   No similar resources found yet.
                 </div>
              )}
           </StaggerContainer>
        </AnimatedSection>
      </div>
    </main>
  );
}
