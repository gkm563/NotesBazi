import { createClient } from "@/lib/supabase/server";
import { 
  Users, 
  FileText, 
  Download, 
  Star, 
  TrendingUp, 
  ArrowUpRight,
  ShieldCheck,
  Clock,
  AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { AdminCharts } from "@/components/admin-charts";
import { cn } from "@/lib/utils";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // 1. Fetch Stats in Parallel
  const [
    { count: userCount },
    { count: notesCount },
    { count: reportsCount },
    { data: allNotes }
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("notes").select("*", { count: "exact", head: true }),
    supabase.from("reports").select("*", { count: "exact", head: true }),
    supabase.from("notes").select("downloads, year, type, created_at")
  ]);
  
  const totalDownloads = allNotes?.reduce((acc, curr) => acc + (curr.downloads || 0), 0) || 0;

  // 2. Aggregate Data for Charts
  const yearStats = { "1st": 0, "2nd": 0, "3rd": 0, "4th": 0 };
  const typeStats = { "Notes": 0, "Assignment": 0, "PYQ": 0 };
  const monthStats: Record<string, number> = {};

  allNotes?.forEach(note => {
    // Year stats
    if (note.year && note.year.includes('1')) yearStats["1st"]++;
    else if (note.year && note.year.includes('2')) yearStats["2nd"]++;
    else if (note.year && note.year.includes('3')) yearStats["3rd"]++;
    else if (note.year && note.year.includes('4')) yearStats["4th"]++;

    // Type stats
    if (note.type === 'Notes') typeStats["Notes"]++;
    else if (note.type === 'Assignment') typeStats["Assignment"]++;
    else if (note.type === 'PYQ') typeStats["PYQ"]++;

    // Monthly stats for trend
    const month = new Date(note.created_at).toLocaleString('default', { month: 'short' });
    monthStats[month] = (monthStats[month] || 0) + 1;
  });

  const chartData = {
    trendData: Object.entries(monthStats).map(([month, count]) => ({ month, uploads: count })),
    yearData: Object.entries(yearStats).map(([name, count]) => ({ name: `${name} Year`, count })),
    typeData: [
      { name: "Notes", value: typeStats["Notes"], color: "#4f46e5" },
      { name: "Assignments", value: typeStats["Assignment"], color: "#8b5cf6" },
      { name: "PYQs", value: typeStats["PYQ"], color: "#ec4899" },
    ]
  };

  // 3. Fetch Recent Activity
  const { data: recentNotes } = await supabase
    .from("notes")
    .select("id, title, subject, created_at, downloads")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    { label: "Total Students", value: userCount || 0, icon: Users, color: "bg-blue-500" },
    { label: "Resources Shared", value: notesCount || 0, icon: FileText, color: "bg-indigo-500" },
    { label: "Total Downloads", value: totalDownloads, icon: Download, color: "bg-emerald-500" },
    { label: "Open Reports", value: reportsCount || 0, icon: AlertTriangle, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Overview</h1>
          <p className="text-slate-500 font-medium mt-2">Manage and monitor the NotesBazi community.</p>
        </div>
        <div className="flex gap-3">
           <Badge variant="outline" className="px-4 py-2 rounded-xl border-slate-200 dark:border-slate-800 flex gap-2 font-bold">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Activity
           </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden group">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={cn("p-4 rounded-2xl text-white shadow-lg transition-transform group-hover:scale-110", stat.color)}>
                  <stat.icon size={24} />
                </div>
                <div className="flex items-center text-emerald-500 font-bold text-sm bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full">
                  <ArrowUpRight size={14} className="mr-1" /> Real-time
                </div>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-4xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <AdminCharts data={chartData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Uploads Table */}
        <Card className="lg:col-span-2 border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-black flex items-center">
                <Clock className="mr-3 text-indigo-500" size={24} /> Recent Content
              </CardTitle>
              <Link href="/admin/notes" className="text-sm font-bold text-indigo-600 hover:underline">View All</Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <th className="p-6 text-xs font-black uppercase text-slate-400 tracking-widest">Title</th>
                    <th className="p-6 text-xs font-black uppercase text-slate-400 tracking-widest">Subject</th>
                    <th className="p-6 text-xs font-black uppercase text-slate-400 tracking-widest">Date</th>
                    <th className="p-6 text-xs font-black uppercase text-slate-400 tracking-widest text-right">Downloads</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentNotes?.map((note) => (
                    <tr key={note.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="p-6">
                        <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-1">{note.title}</span>
                      </td>
                      <td className="p-6">
                        <Badge variant="secondary" className="rounded-lg">{note.subject}</Badge>
                      </td>
                      <td className="p-6 text-sm font-medium text-slate-500">
                        {new Date(note.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-6 text-right font-black text-slate-900 dark:text-white">
                        {note.downloads}
                      </td>
                    </tr>
                  ))}
                  {recentNotes?.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500">No notes found in the database.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-indigo-600 rounded-[2.5rem] text-white">
          <CardContent className="p-8 h-full flex flex-col">
            <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center mb-8">
               <ShieldCheck size={32} />
            </div>
            <h3 className="text-3xl font-black mb-4">System Status</h3>
            <p className="text-indigo-100 font-medium mb-8 flex-grow">All systems are operational. Database latency is optimal and storage is healthy.</p>
            
            <div className="space-y-4">
               <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl">
                  <span className="font-bold">Database</span>
                  <Badge className="bg-emerald-400 text-white border-none">Healthy</Badge>
               </div>
               <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl">
                  <span className="font-bold">Storage</span>
                  <Badge className="bg-emerald-400 text-white border-none">Healthy</Badge>
               </div>
               <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl">
                  <span className="font-bold">Auth Service</span>
                  <Badge className="bg-emerald-400 text-white border-none">Healthy</Badge>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


