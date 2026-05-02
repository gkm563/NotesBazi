import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { 
  Upload, 
  FileText, 
  Trash2, 
  Edit, 
  Eye, 
  Download, 
  TrendingUp, 
  Users,
  Clock,
  ArrowRight,
  Star,
  Zap,
  Award,
  BookOpen,
  ChevronRight,
  Plus,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { DeleteNoteButton } from "@/components/delete-note-button";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch everything in parallel for maximum speed
  const [profileRes, notesRes, savedRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("notes").select("*").eq("uploaded_by", user.id).order("created_at", { ascending: false }),
    supabase.from("saved_notes").select(`
      id,
      notes (
        id,
        title,
        subject,
        year,
        type,
        downloads
      )
    `).eq("user_id", user.id).order("created_at", { ascending: false })
  ]);

  const profile = profileRes.data;
  const notes = notesRes.data;
  const savedNotesData = savedRes.data;

  if (profile?.role === 'admin') {
    redirect("/admin");
  }

  const totalDownloads = notes?.reduce((acc, note) => acc + (note.downloads || 0), 0) || 0;
  const contributionLevel = totalDownloads > 100 ? "Gold Contributor" : totalDownloads > 50 ? "Silver Contributor" : "Rising Star";

  return (
    <main className="min-h-screen bg-background transition-colors py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
        
        {/* Welcome Hero Section */}
        <AnimatedSection direction="up">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-indigo-600 p-8 md:p-12 text-white shadow-2xl shadow-indigo-500/20">
            <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
              <Award size={200} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-widest border border-white/20">
                  <Zap size={14} className="fill-white" /> {contributionLevel}
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                  Hi, {profile?.full_name?.split(' ')[0] || 'Student'}! 👋
                </h1>
                <p className="text-indigo-100 text-lg font-medium max-w-md">
                  Welcome back to your workspace. Your contributions have helped over <span className="font-black text-white">{totalDownloads} students</span> this month.
                </p>
              </div>
              <div className="flex gap-4">
                <Button asChild className="rounded-2xl bg-white text-indigo-600 hover:bg-indigo-50 h-16 px-8 font-black text-lg shadow-xl shadow-black/10 transition-all hover:scale-105">
                  <Link href="/upload" className="flex items-center gap-3">
                    <Plus size={24} /> Upload New Material
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-2xl border-2 border-white/20 bg-white/10 text-white hover:bg-white/20 h-16 px-6 font-black shadow-xl backdrop-blur-md transition-all hover:scale-105">
                  <Link href="/dashboard/settings">
                    <Settings size={24} />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Stats Grid */}
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: "My Uploads", value: notes?.length || 0, icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Downloads", value: totalDownloads, icon: Download, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Saved Notes", value: savedNotesData?.length || 0, icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
            { label: "Engagement", value: totalDownloads, icon: Users, color: "text-violet-600", bg: "bg-violet-50" },
          ].map((stat, i) => (
            <StaggerItem key={i}>
              <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all">
                <CardContent className="p-6 md:p-8 flex flex-col items-center text-center">
                  <div className={`h-14 w-14 ${stat.bg} dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <stat.icon className={stat.color} size={28} />
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Dashboard Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content: My Uploads */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <div className="h-2 w-8 bg-indigo-600 rounded-full" />
                My Publications
              </h2>
            </div>

            {notes && notes.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {notes.map((note) => (
                  <AnimatedSection key={note.id} direction="up">
                    <div className="group bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/30 dark:shadow-none hover:shadow-2xl hover:border-indigo-200 transition-all">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-5">
                          <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 transition-all duration-500">
                            <FileText className="text-slate-400 group-hover:text-white transition-colors" size={32} />
                          </div>
                          <div>
                            <h4 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-1">{note.title}</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <Badge variant="secondary" className="rounded-lg font-bold text-[10px] uppercase bg-slate-100 dark:bg-slate-800">{note.subject}</Badge>
                              <span className="text-xs font-bold text-slate-400">{note.year} Year • {note.type}</span>
                            </div>
                          </div>
                        </div>
                        <div className="hidden md:flex flex-col items-end gap-2">
                          <div className="flex gap-2">
                             <Button variant="ghost" size="icon" asChild className="rounded-xl h-10 w-10 hover:bg-indigo-50">
                               <Link href={`/notes/${note.id}`}><Eye size={20} className="text-slate-400 hover:text-indigo-600" /></Link>
                             </Button>
                             <Button variant="ghost" size="icon" asChild className="rounded-xl h-10 w-10 hover:bg-indigo-50">
                               <Link href={`/upload?edit=${note.id}`}><Edit size={20} className="text-slate-400 hover:text-indigo-600" /></Link>
                             </Button>
                             <DeleteNoteButton noteId={note.id} />
                          </div>
                          <div className="flex items-center gap-1 text-xs font-black text-slate-400">
                             <Download size={14} /> {note.downloads || 0} downloads
                          </div>
                        </div>
                      </div>
                      {/* Mobile Actions */}
                      <div className="md:hidden flex justify-between items-center mt-6 pt-6 border-t border-slate-50 dark:border-slate-800">
                         <div className="flex items-center gap-1 text-xs font-black text-slate-400 uppercase tracking-widest">
                             <Download size={14} /> {note.downloads || 0} downloads
                          </div>
                         <div className="flex gap-2">
                             <Link href={`/notes/${note.id}`} className="p-2 text-indigo-600 bg-indigo-50 rounded-lg"><Eye size={18}/></Link>
                             <Link href={`/upload?edit=${note.id}`} className="p-2 text-slate-600 bg-slate-100 rounded-lg"><Edit size={18}/></Link>
                             <DeleteNoteButton noteId={note.id} />
                         </div>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-slate-800">
                <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="text-slate-300" size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No uploads yet</h3>
                <p className="text-slate-500 font-medium mb-8">Share your first resource and start your journey as a contributor!</p>
                <Button asChild className="rounded-2xl bg-indigo-600 h-14 px-8 font-black shadow-lg shadow-indigo-500/20">
                  <Link href="/upload">Upload My First Note</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar: Saved Resources & Activity */}
          <div className="space-y-10">
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <Star className="text-amber-500" fill="currentColor" size={24} />
                Saved for Later
              </h2>
              <div className="space-y-4">
                {savedNotesData && savedNotesData.length > 0 ? savedNotesData.map((save: any) => (
                  <Link key={save.id} href={`/notes/${save.notes?.id}`} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all group">
                    <div className="h-12 w-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-all">
                      <BookOpen size={20} />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors">{save.notes?.title}</h4>
                      <p className="text-xs font-bold text-slate-400">{save.notes?.subject}</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )) : (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-400">
                    No saved items yet.
                  </div>
                )}
              </div>
            </div>

            <Card className="border-none shadow-2xl bg-slate-900 dark:bg-indigo-950 text-white rounded-[2.5rem] p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Zap size={80} />
               </div>
               <h3 className="text-xl font-black mb-4">Want more space?</h3>
               <p className="text-indigo-200 text-sm font-medium mb-6">Contribute 10+ high-quality notes to unlock the <span className="text-white font-black">Elite Contributor</span> badge!</p>
               <Button asChild variant="outline" className="w-full rounded-xl border-white/20 bg-white/10 hover:bg-white/20 text-white font-black border-none">
                 <Link href="/upload">Upload Now</Link>
               </Button>
            </Card>
          </div>

        </div>
      </div>
    </main>
  );
}
