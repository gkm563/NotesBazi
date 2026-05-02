import Link from "next/link";
import { Search, BookOpen, GraduationCap, Clock, TrendingUp, Download, Eye, Star, ChevronRight, FileText, Sparkles, Trophy, ShieldCheck, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default async function Home() {
  let trendingNotes: any[] = [];
  let recentNotes: any[] = [];
  let topContributor: any = null;

  try {
    const supabase = await createClient();
    
    // Fetch notes first without the broken join
    const [trendingRes, recentRes, contributorRes] = await Promise.all([
      supabase.from("notes").select("id, title, subject, year, type, downloads, views, uploaded_by").order("views", { ascending: false }).limit(4),
      supabase.from("notes").select("id, title, subject, year, type, created_at, uploaded_by").order("created_at", { ascending: false }).limit(4),
      supabase.from("profiles").select("id, name, department, role").order("id", { ascending: true }).limit(1)
    ]);
    
    trendingNotes = trendingRes.data || [];
    recentNotes = recentRes.data || [];
    
    // Extract unique uploader IDs
    const uploaderIds = Array.from(new Set([
      ...trendingNotes.map(n => n.uploaded_by),
      ...recentNotes.map(n => n.uploaded_by)
    ].filter(Boolean)));

    if (uploaderIds.length > 0) {
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, name, role, avatar_url")
        .in("id", uploaderIds);
        
      if (profilesData) {
        const profileMap = new Map(profilesData.map(p => [p.id, p]));
        trendingNotes = trendingNotes.map(n => ({ ...n, profiles: profileMap.get(n.uploaded_by) || null }));
        recentNotes = recentNotes.map(n => ({ ...n, profiles: profileMap.get(n.uploaded_by) || null }));
      }
    }

    topContributor = contributorRes.data?.[0] || null;
    if (topContributor && topContributor.role === 'admin') {
      topContributor.name = 'System Admin - NotesBazi';
    }
  } catch (error) {
    console.error("Database fetch failed:", error);
  }

  return (
    <main className="min-h-screen bg-background transition-colors overflow-hidden">
      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-background border-b border-border">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs md:text-sm mb-6 md:mb-8 shadow-sm border border-indigo-100 dark:border-indigo-800/50">
            <Sparkles size={16} /> #1 Academic Platform for UIT
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-6 md:mb-8 tracking-tight px-2">
            Master your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 animate-gradient-x">Academics</span>
          </h1>
          
          <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed font-medium px-4">
            Discover, share, and collaborate on premium study materials. Smart AI summaries, verified notes, and PYQs at your fingertips.
          </p>

          <form action="/notes" className="w-full max-w-3xl relative group shadow-2xl shadow-indigo-500/10 dark:shadow-none rounded-2xl md:rounded-full px-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 md:pl-6 flex items-center pointer-events-none">
                <Search className="h-5 w-5 md:h-6 md:w-6 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              </div>
              <input
                type="text"
                name="q"
                placeholder="Search subjects, topics..."
                className="w-full pl-12 md:pl-16 pr-4 md:pr-32 py-5 md:py-6 rounded-2xl md:rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-indigo-500/20 text-base md:text-lg transition-all dark:text-white outline-none"
              />
              <button type="submit" className="mt-3 md:mt-0 w-full md:w-auto md:absolute md:right-3 md:top-3 md:bottom-3 px-8 py-4 md:py-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl md:rounded-full font-bold shadow-md transition-all hover:scale-105">
                Explore
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Year Categories */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-10">
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((year, idx) => (
            <StaggerItem key={idx}>
              <Link 
                href={`/notes?year=${idx + 1}st`}
                className="group block p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-200/60 dark:border-slate-800/80 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="h-16 w-16 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/30 dark:to-violet-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                  {year}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  Foundational concepts, assignments & PYQs.
                </p>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Contributor of the Month */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection direction="up">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-[2rem] p-1 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-white/20 blur-xl group-hover:bg-white/30 transition-all"></div>
            <div className="bg-white dark:bg-slate-900 rounded-[1.9rem] p-8 md:p-12 relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
              <div className="flex-1 text-center md:text-left">
                <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-none mb-4 px-4 py-1.5 font-bold rounded-full uppercase tracking-widest"><Trophy size={14} className="mr-2 inline" /> Contributor of the Month</Badge>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
                  {topContributor ? topContributor.name : "Community Star"}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg mb-6">
                  Recognizing outstanding contributions to the student community. Keep uploading notes to be featured here!
                </p>
                <Link href="/leaderboard" className="inline-flex items-center text-amber-600 dark:text-amber-400 font-bold hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
                  View full leaderboard <ChevronRight size={18} className="ml-1" />
                </Link>
              </div>
              <div className="flex-shrink-0 relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 p-1">
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center border-4 border-white dark:border-slate-800">
                    <User size={64} className="text-slate-300 dark:text-slate-600" />
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-amber-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-xl border-4 border-white dark:border-slate-900 shadow-lg">
                  #1
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Trending Section */}
      <section className="py-20 bg-white/50 dark:bg-slate-900/30 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <AnimatedSection direction="right">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center">
                <TrendingUp className="mr-3 h-8 w-8 text-amber-500" />
                Trending Resources
              </h2>
            </div>
            <div className="space-y-4">
              {trendingNotes.length > 0 ? trendingNotes.map((item) => (
                <Link key={item.id} href={`/notes/${item.id}`} className="group p-5 bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200/60 dark:border-slate-800 hover:shadow-xl transition-all flex gap-5 items-center">
                  <div className="h-14 w-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="text-indigo-500" size={24} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white truncate">{item.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {item.subject} • {item.year} Year
                    </p>
                    <p className="text-xs text-indigo-500 font-semibold mt-1">
                      By {item.profiles?.role === 'admin' ? 'System Admin - NotesBazi' : (item.profiles?.name || 'Student')}
                    </p>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 border-none font-bold">
                    <Eye size={12} className="mr-1" /> {item.views || 0}
                  </Badge>
                </Link>
              )) : (
                <div className="p-8 text-center text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                  No resources found yet.
                </div>
              )}
            </div>
          </AnimatedSection>

          <AnimatedSection direction="left">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center">
                <Clock className="mr-3 h-8 w-8 text-violet-500" />
                Fresh Uploads
              </h2>
            </div>
            <div className="space-y-4">
              {recentNotes.length > 0 ? recentNotes.map((item) => (
                <Link key={item.id} href={`/notes/${item.id}`} className="group p-5 bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200/60 dark:border-slate-800 hover:shadow-xl transition-all flex gap-5 items-center">
                  <div className="h-14 w-14 bg-violet-50 dark:bg-violet-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpen className="text-violet-500" size={24} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white truncate">{item.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {item.subject} • {item.type}
                    </p>
                    <p className="text-xs text-indigo-500 font-semibold mt-1">
                      By {item.profiles?.role === 'admin' ? 'System Admin - NotesBazi' : (item.profiles?.name || 'Student')}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg">New</div>
                </Link>
              )) : (
                <div className="p-8 text-center text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                  No recent uploads yet.
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Community Leaderboard Teaser */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection direction="up">
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-12 opacity-10">
               <Trophy size={160} className="text-white" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
               <div>
                  <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-400/20 mb-6 px-4 py-1.5 font-bold rounded-full">COMMUNITY DRIVEN</Badge>
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                    Celebrating Our Top <span className="text-indigo-400">Knowledge Curators</span>
                  </h2>
                  <p className="text-lg text-indigo-100/70 mb-10 font-medium leading-relaxed">
                    NotesBazi thrives on student collaboration. Join our top contributors in building the most comprehensive resource library for our campus.
                  </p>
                  <Link href="/leaderboard" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-950 font-black rounded-2xl hover:bg-indigo-50 transition-all hover:scale-105 group">
                    View Discovery Leaderboard <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "#1 Ranked", title: "Top Contributor", name: "Join the Elite", icon: Star, color: "text-amber-400" },
                    { label: "Elite", title: "Study Mentor", name: "Verified Curator", icon: ShieldCheck, color: "text-indigo-400" },
                  ].map((badge, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-colors">
                       <badge.icon className={cn("h-10 w-10 mb-4", badge.color)} />
                       <p className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-1">{badge.label}</p>
                       <h4 className="text-lg font-black text-white">{badge.title}</h4>
                       <p className="text-sm text-indigo-100/50 mt-1">{badge.name}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Footer CTA */}
      <section className="py-24 relative overflow-hidden bg-indigo-950 text-center">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-black text-white mb-6">Ready to share your knowledge?</h2>
          <p className="text-indigo-200 mb-10 text-lg">Help your batchmates by uploading your verified resources.</p>
          <Link href="/upload" className="inline-flex items-center px-8 py-4 bg-white text-indigo-950 font-black rounded-full hover:scale-105 transition-all text-lg">
            Start Uploading
          </Link>
        </div>
      </section>
    </main>
  );
}
