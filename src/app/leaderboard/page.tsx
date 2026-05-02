import { createClient } from "@/lib/supabase/server";
import { 
  Trophy, 
  Medal, 
  Star, 
  Users, 
  ArrowUpRight, 
  TrendingUp,
  FileText,
  User,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function LeaderboardPage() {
  const supabase = await createClient();

  // Fetch all notes to aggregate counts
  const { data: notesData, error: notesError } = await supabase
    .from("notes")
    .select("uploaded_by");

  const uploadCounts: Record<string, number> = {};
  if (notesData) {
    notesData.forEach(note => {
      if (note.uploaded_by) {
        uploadCounts[note.uploaded_by] = (uploadCounts[note.uploaded_by] || 0) + 1;
      }
    });
  }

  interface Contributor {
    id: string;
    name: string | null;
    department: string | null;
    role: string | null;
    username: string | null;
    uploadCount: number;
  }

  // Fetch all profiles so everyone is on the leaderboard
  const { data: profilesData } = await supabase
    .from("profiles")
    .select("id, name, department, role, username");

  let contributors: Contributor[] = [];
  if (profilesData) {
    contributors = (profilesData as any[])
      .filter(p => p.role !== 'admin') // Exclude admins for fair competition
      .map(p => ({
        ...p,
        uploadCount: uploadCounts[p.id] || 0,
      }))
      .sort((a, b) => b.uploadCount - a.uploadCount);
  }

  const topThree = contributors.slice(0, 3);
  const rest = contributors.slice(3);

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] pb-24 pt-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <AnimatedSection direction="down">
            <Badge className="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border-none px-6 py-2 rounded-full font-black text-xs uppercase tracking-[0.2em] mb-4">
               Community Excellence
            </Badge>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
              Discovery <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Leaderboard</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Celebrating the top curators of our campus memories. Every upload helps a fellow student succeed.
            </p>
          </AnimatedSection>
        </div>

        {/* Podium for Top 3 or Empty State */}
        {topThree.length > 0 ? (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-end">
            {topThree.map((user, index) => {
              const ranks = [
                { color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10", icon: Trophy, label: "Top Contributor", shadow: "shadow-amber-500/20" },
                { color: "text-slate-400", bg: "bg-slate-100 dark:bg-slate-400/10", icon: Medal, label: "Silver Curator", shadow: "shadow-slate-400/20" },
                { color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10", icon: Medal, label: "Rising Star", shadow: "shadow-orange-500/20" },
              ];
              const rank = index === 0 ? ranks[0] : index === 1 ? ranks[1] : ranks[2];
              const isFirst = index === 0;

              return (
                <StaggerItem key={user.id} className={isFirst ? "order-first md:order-none" : ""}>
                  <div className={`relative group ${isFirst ? "md:scale-110 md:-translate-y-4" : ""}`}>
                     <div className={`absolute inset-0 ${rank.bg} rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-40 transition-opacity`} />
                     
                     <Card className={cn(
                       "border-none shadow-2xl relative overflow-hidden rounded-[2.5rem] transition-all duration-500",
                       isFirst ? "bg-indigo-900 text-white" : "bg-white dark:bg-slate-900",
                       rank.shadow
                     )}>
                        <CardContent className="p-8 text-center">
                           <div className={cn(
                             "w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 relative z-10",
                             isFirst ? "bg-white/10 text-white" : rank.bg + " " + rank.color
                           )}>
                              <rank.icon size={40} />
                              <div className="absolute -top-2 -right-2 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-sm border-4 border-white dark:border-slate-900">
                                 #{index + 1}
                              </div>
                           </div>
                           
                           <Link href={`/profile/${user.username || user.id}`}>
                              <h3 className={cn("text-xl font-black mb-1 truncate px-2 hover:text-indigo-400 transition-colors", isFirst ? "text-white" : "text-slate-900 dark:text-white")}>
                                 {user.name}
                              </h3>
                           </Link>
                           <p className={cn("text-sm font-bold uppercase tracking-widest mb-4", isFirst ? "text-indigo-200" : "text-slate-400")}>
                              {user.department || "General"}
                           </p>
                           
                           <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black", isFirst ? "bg-white/10" : "bg-slate-50 dark:bg-slate-800")}>
                              <FileText size={16} /> {user.uploadCount} Uploads
                           </div>

                           <div className={cn("mt-6 pt-6 border-t", isFirst ? "border-white/10" : "border-slate-100 dark:border-slate-800")}>
                              <Badge className={cn("border-none px-3 py-1 font-bold", isFirst ? "bg-white/20 text-white" : rank.bg + " " + rank.color)}>
                                 {rank.label}
                              </Badge>
                           </div>
                        </CardContent>
                     </Card>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        ) : (
          <AnimatedSection direction="up" className="mb-16">
            <Card className="bg-white dark:bg-slate-900 border-none shadow-xl rounded-[3rem] p-12 text-center">
               <div className="h-24 w-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-8 text-indigo-600">
                  <Star size={48} className="animate-pulse" />
               </div>
               <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">No Champions Yet!</h2>
               <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-md mx-auto">
                 Be the first student to contribute notes and secure your spot at the top of the leaderboard.
               </p>
               <Link 
                href="/upload" 
                className="inline-flex items-center px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xl shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all"
               >
                 Start Contributing Now
               </Link>
            </Card>
          </AnimatedSection>
        )}

        {/* List for others */}
        {contributors.length > 3 && (
          <AnimatedSection direction="up" delay={0.5}>
            <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                      <TrendingUp className="text-indigo-600" /> Contributor List
                  </h2>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Global Ranking</p>
                </div>
                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                  {rest.map((user, index) => (
                      <div key={user.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <div className="flex items-center gap-6">
                            <span className="text-xl font-black text-slate-300 w-8">#{index + 4}</span>
                            <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 font-black">
                              {user.name?.[0]}
                            </div>
                            <div>
                              <h4 className="font-black text-slate-900 dark:text-white">{user.name}</h4>
                              <p className="text-xs font-bold text-slate-400 uppercase">{user.department} Dept.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="text-right hidden sm:block">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resources</p>
                              <p className="font-black text-slate-900 dark:text-white">{user.uploadCount}</p>
                            </div>
                            <Badge variant="outline" className="rounded-xl border-slate-200 dark:border-slate-700 px-4 py-1.5 font-bold text-slate-500">
                              Contributor
                            </Badge>
                        </div>
                      </div>
                  ))}
                </div>
            </Card>
          </AnimatedSection>
        )}
      </div>
    </main>
  );
}
