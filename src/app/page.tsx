import Link from "next/link";
import { Search, BookOpen, GraduationCap, Clock, TrendingUp, Download, Eye, Star, ChevronRight, FileText, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AnimatedSection, StaggerContainer, StaggerItem, FloatingElement } from "@/components/ui/animated-section";
import { Badge } from "@/components/ui/badge";

export default async function Home() {
  const supabase = await createClient();
  
  // Fetch Trending (Most Downloaded)
  const { data: trendingNotes } = await supabase
    .from("notes")
    .select("id, title, subject, year, type, downloads")
    .order("downloads", { ascending: false })
    .limit(4);

  // Fetch Recent Uploads
  const { data: recentNotes } = await supabase
    .from("notes")
    .select("id, title, subject, year, type, created_at")
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] transition-colors overflow-hidden">
      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="absolute inset-0 z-0">
          <FloatingElement delay={0} className="absolute top-0 right-0">
            <div className="w-[500px] h-[500px] bg-indigo-600/10 dark:bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70" />
          </FloatingElement>
          <FloatingElement delay={2} className="absolute top-40 left-0">
            <div className="w-[500px] h-[500px] bg-violet-600/10 dark:bg-violet-500/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70" />
          </FloatingElement>
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          <AnimatedSection direction="up" delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs md:text-sm mb-6 md:mb-8 shadow-sm border border-indigo-100 dark:border-indigo-800/50">
              <Sparkles size={16} /> #1 Academic Platform for UIT
            </div>
          </AnimatedSection>
          
          <AnimatedSection direction="up" delay={0.2}>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-6 md:mb-8 tracking-tight px-2">
              Master your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 animate-gradient-x">Academics</span>
            </h1>
          </AnimatedSection>
          
          <AnimatedSection direction="up" delay={0.3}>
            <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed font-medium px-4">
              Discover, share, and collaborate on premium study materials. Smart AI summaries, verified notes, and PYQs at your fingertips.
            </p>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={0.4} className="w-full max-w-3xl px-4">
            <form action="/notes" className="relative group shadow-2xl shadow-indigo-500/10 dark:shadow-none rounded-2xl md:rounded-full">
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
            </form>
          </AnimatedSection>
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

      {/* Trending & Recent Section */}
      <section className="py-20 bg-white/50 dark:bg-slate-900/30 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Trending Notes */}
          <AnimatedSection direction="right" delay={0.1}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center">
                <TrendingUp className="mr-3 h-8 w-8 text-amber-500" />
                Trending Resources
              </h2>
              <Link href="/notes" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-bold flex items-center">View All <ChevronRight size={16}/></Link>
            </div>
            <StaggerContainer className="space-y-4">
              {trendingNotes && trendingNotes.length > 0 ? trendingNotes.map((item) => (
                <StaggerItem key={item.id}>
                  <Link href={`/notes/${item.id}`} className="group p-5 bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200/60 dark:border-slate-800 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex gap-5 items-center">
                    <div className="h-14 w-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                       <FileText className="text-indigo-500" size={24} />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                      <p className="text-sm font-semibold text-slate-400 truncate">{item.subject} • {item.year} Year</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <Badge className="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-none font-bold">
                         <Download size={12} className="mr-1" /> {item.downloads || 0}
                      </Badge>
                    </div>
                  </Link>
                </StaggerItem>
              )) : (
                 <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-[1.5rem] border border-dashed border-slate-200 dark:border-slate-700 text-slate-500">No trending notes yet.</div>
              )}
            </StaggerContainer>
          </AnimatedSection>

          {/* Recent Uploads */}
          <AnimatedSection direction="left" delay={0.2}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center">
                <Clock className="mr-3 h-8 w-8 text-violet-500" />
                Fresh Uploads
              </h2>
              <Link href="/notes" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-bold flex items-center">View All <ChevronRight size={16}/></Link>
            </div>
            <StaggerContainer className="space-y-4">
              {recentNotes && recentNotes.length > 0 ? recentNotes.map((item) => (
                <StaggerItem key={item.id}>
                  <Link href={`/notes/${item.id}`} className="group p-5 bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200/60 dark:border-slate-800 hover:shadow-xl hover:border-violet-300 dark:hover:border-violet-700 transition-all flex gap-5 items-center">
                    <div className="h-14 w-14 bg-violet-50 dark:bg-violet-900/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-violet-100 transition-colors">
                       <BookOpen className="text-violet-500" size={24} />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-violet-600 transition-colors">{item.title}</h4>
                      <p className="text-sm font-semibold text-slate-400 truncate">{item.subject} • {item.type}</p>
                    </div>
                    <div className="flex-shrink-0 text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg">
                       New
                    </div>
                  </Link>
                </StaggerItem>
              )) : (
                 <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-[1.5rem] border border-dashed border-slate-200 dark:border-slate-700 text-slate-500">No recent uploads yet.</div>
              )}
            </StaggerContainer>
          </AnimatedSection>

        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 relative overflow-hidden bg-indigo-950">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/30 rounded-full mix-blend-screen filter blur-[100px] opacity-70" />
        
        <AnimatedSection direction="up" className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-5xl font-black text-white mb-6 tracking-tight">Got Notes to Share?</h2>
          <p className="text-indigo-200 mb-12 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Help your juniors and fellow batchmates by uploading your notes, past papers, or assignments. Build your profile and contribute to the community!
          </p>
          <Link 
            href="/upload" 
            className="inline-flex items-center px-10 py-5 bg-white text-indigo-950 font-black rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all hover:-translate-y-1 text-lg"
          >
            Start Uploading
            <TrendingUp size={24} className="ml-3 text-indigo-600" />
          </Link>
        </AnimatedSection>
      </section>
    </main>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  )
}
