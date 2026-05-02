import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { 
  User, 
  FileText, 
  Download, 
  Star, 
  Award, 
  Building2, 
  Calendar,
  ChevronRight,
  TrendingUp,
  MapPin
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const supabase = await createClient();

  // 1. Fetch user by id (the route parameter is named username but contains the UUID)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", username)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  // 2. Fetch user's uploads
  const { data: notes } = await supabase
    .from("notes")
    .select("id, title, subject, type, downloads, average_rating, created_at, is_verified")
    .eq("uploaded_by", profile.id)
    .order("created_at", { ascending: false });

  const userNotes = notes || [];
  const totalDownloads = userNotes.reduce((acc, curr) => acc + (curr.downloads || 0), 0);
  const avgRating = userNotes.length > 0 
    ? (userNotes.reduce((acc, curr) => acc + (curr.average_rating || 0), 0) / userNotes.length).toFixed(1) 
    : "0.0";

  const subjectCounts: Record<string, number> = {};
  userNotes.forEach(note => {
    if (note.subject) {
      subjectCounts[note.subject] = (subjectCounts[note.subject] || 0) + 1;
    }
  });

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] pb-24">
      {/* Hero Header */}
      <div className="relative h-[300px] md:h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] dark:from-[#0B1120] to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-32 md:-mt-48 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Side: Profile Card */}
          <div className="w-full lg:w-80 shrink-0">
             <AnimatedSection direction="up">
                <Card className="border-none shadow-2xl shadow-indigo-500/10 dark:shadow-none bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden text-center p-8">
                   <div className="relative inline-block mb-6">
                      <div className="h-32 w-32 md:h-40 md:w-40 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-indigo-500/40">
                         {profile.name?.[0] || "S"}
                      </div>
                      {profile.role === 'admin' && (
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-2xl border-4 border-white dark:border-slate-900 shadow-xl">
                           <Award size={24} />
                        </div>
                      )}
                   </div>
                   
                   <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">
                     {profile.role === 'admin' ? "System Admin - NotesBazi" : profile.name}
                   </h1>
                   <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-6 flex items-center justify-center gap-1">
                      <AtSign size={14} />{profile.role === 'admin' ? "admin" : (profile.username || "community_member")}
                   </p>

                   <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-left">
                         <Building2 className="text-indigo-500 shrink-0" size={20} />
                         <div>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Department</p>
                            <p className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{profile.department || "General Sciences"}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-left">
                         <Calendar className="text-indigo-500 shrink-0" size={20} />
                         <div>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Member Since</p>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{profile.created_at ? new Date(profile.created_at).getFullYear() : "2024"}</p>
                         </div>
                      </div>
                   </div>

                   <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
                      <div className="text-center">
                         <p className="text-2xl font-black text-slate-900 dark:text-white">{userNotes.length}</p>
                         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Uploads</p>
                      </div>
                      <div className="text-center border-l border-slate-100 dark:border-slate-800">
                         <p className="text-2xl font-black text-slate-900 dark:text-white">{totalDownloads}</p>
                         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Impact</p>
                      </div>
                   </div>
                </Card>
             </AnimatedSection>
          </div>

          {/* Right Side: Stats & Activity */}
          <div className="flex-grow space-y-8 min-w-0">
             {/* Key Stats Row */}
             <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                  { label: "Trust Score", value: "98%", icon: Award, color: "text-emerald-500", bg: "bg-emerald-50" },
                  { label: "Avg Rating", value: avgRating, icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
                  { label: "Verified", value: userNotes.filter(n => n.is_verified).length, icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-50" },
                  { label: "Points", value: userNotes.length * 50 + totalDownloads, icon: Star, color: "text-violet-500", bg: "bg-violet-50" },
                ].map((stat, i) => (
                  <StaggerItem key={i}>
                    <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 rounded-3xl overflow-hidden p-6 text-center">
                       <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mx-auto mb-3", stat.bg)}>
                          <stat.icon size={20} className={stat.color} />
                       </div>
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{stat.label}</p>
                       <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                    </Card>
                  </StaggerItem>
                ))}
             </StaggerContainer>

             {/* Subject Expertise & Top Stats */}
             <AnimatedSection direction="up" delay={0.1}>
                <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 mb-8">
                   <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                     <Building2 className="text-indigo-500" /> Subject Contributions
                   </h3>
                   {Object.keys(subjectCounts).length > 0 ? (
                     <div className="flex flex-wrap gap-3">
                       {Object.entries(subjectCounts).sort((a, b) => b[1] - a[1]).map(([subject, count], idx) => (
                         <div key={subject} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-2 rounded-xl">
                           <span className="font-bold text-slate-700 dark:text-slate-200">{subject}</span>
                           <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-none ml-2">
                             {count} notes
                           </Badge>
                         </div>
                       ))}
                     </div>
                   ) : (
                     <p className="text-slate-500 text-sm italic font-medium">No subjects uploaded yet.</p>
                   )}
                </Card>
             </AnimatedSection>

             {/* Uploads List */}
             <AnimatedSection direction="up" delay={0.2}>
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                      <FileText className="text-indigo-600" /> Recent Contributions
                   </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {userNotes.length > 0 ? userNotes.map((note) => (
                     <Link key={note.id} href={`/notes/${note.id}`} className="group block">
                        <Card className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                           <CardContent className="p-0">
                              <div className="p-6">
                                 <div className="flex justify-between items-start mb-4">
                                    <div className="h-14 w-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 group-hover:text-indigo-500 transition-colors">
                                       <FileText size={28} />
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                       {note.is_verified && <Badge className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-none font-black text-[10px]">VERIFIED</Badge>}
                                       <Badge variant="secondary" className="rounded-lg font-bold">{note.type}</Badge>
                                    </div>
                                 </div>
                                 <h3 className="text-lg font-black text-slate-900 dark:text-white line-clamp-1 mb-1 group-hover:text-indigo-600 transition-colors">{note.title}</h3>
                                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{note.subject}</p>
                                 
                                 <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                       <span className="flex items-center gap-1"><Download size={14} className="text-emerald-500" /> {note.downloads || 0}</span>
                                       <span className="flex items-center gap-1"><Star size={14} className="text-amber-500 fill-amber-500" /> {note.average_rating || 0}</span>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                 </div>
                              </div>
                           </CardContent>
                        </Card>
                     </Link>
                   )) : (
                     <div className="col-span-full py-20 text-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No resources shared yet</h3>
                        <p className="text-slate-500">This member's digital library is currently empty.</p>
                     </div>
                   )}
                </div>
             </AnimatedSection>
          </div>

        </div>
      </div>
    </main>
  );
}

function AtSign({ size }: { size: number }) {
  return <span className="font-sans">@</span>;
}

// Utility to merge classes
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
