import { createClient } from "@/lib/supabase/server";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Download, 
  FileText, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminCharts } from "@/components/admin-charts";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  // 1. Fetch Real Data
  const { data: allNotes } = await supabase.from("notes").select("downloads, year, type, created_at");
  const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
  
  // 2. Aggregate Data
  const totalDownloads = allNotes?.reduce((acc, curr) => acc + (curr.downloads || 0), 0) || 0;
  const avgDownloads = allNotes && allNotes.length > 0 ? (totalDownloads / allNotes.length).toFixed(1) : 0;
  
  // Year & Type stats for AdminCharts
  const yearStats = { "1st": 0, "2nd": 0, "3rd": 0, "4th": 0 };
  const typeStats = { "Notes": 0, "Assignment": 0, "PYQ": 0 };
  const monthStats: Record<string, number> = {};

  allNotes?.forEach(note => {
    if (note.year && note.year.includes('1')) yearStats["1st"]++;
    else if (note.year && note.year.includes('2')) yearStats["2nd"]++;
    else if (note.year && note.year.includes('3')) yearStats["3rd"]++;
    else if (note.year && note.year.includes('4')) yearStats["4th"]++;

    if (note.type === 'Notes') typeStats["Notes"]++;
    else if (note.type === 'Assignment') typeStats["Assignment"]++;
    else if (note.type === 'PYQ') typeStats["PYQ"]++;

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

  const stats = [
    { label: "Total Students", value: userCount || 0, trend: "up", percent: "Real", icon: Users, color: "bg-blue-500" },
    { label: "Total Resources", value: allNotes?.length || 0, trend: "up", percent: "Real", icon: FileText, color: "bg-indigo-500" },
    { label: "Avg Downloads", value: avgDownloads, trend: "up", percent: "Real", icon: Activity, color: "bg-emerald-500" },
    { label: "Total Downloads", value: totalDownloads, trend: "up", percent: "Real", icon: Download, color: "bg-violet-500" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Platform Analytics</h1>
          <p className="text-slate-500 font-medium mt-2">Deep dive into community engagement and resource usage.</p>
        </div>
        <div className="flex gap-3">
           <Badge className="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border-none px-4 py-2 rounded-xl font-bold">
              Real-time Analysis
           </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden group">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg transition-transform group-hover:scale-110`}>
                  <stat.icon size={24} />
                </div>
                <div className={`flex items-center font-bold text-sm px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400`}>
                  <TrendingUp size={14} className="mr-1" />
                  Live
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Engagement Chart */}
        <Card className="lg:col-span-2 border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2.5rem] p-8">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-2xl font-black flex items-center gap-3">
              <TrendingUp className="text-indigo-500" /> Upload Activity
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">Resource contribution trends from the database.</CardDescription>
          </CardHeader>
          <AdminCharts data={chartData} />
        </Card>

        {/* Subject Distribution */}
        <Card className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2.5rem] p-8">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-2xl font-black flex items-center gap-3">
              <Globe className="text-violet-500" /> Subject Focus
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">Top subjects by resource count.</CardDescription>
          </CardHeader>
          <div className="space-y-6">
             {Object.entries(
               allNotes?.reduce((acc: Record<string, number>, note) => {
                 acc[note.subject] = (acc[note.subject] || 0) + 1;
                 return acc;
               }, {}) || {}
             )
             .sort((a, b) => b[1] - a[1])
             .slice(0, 5)
             .map(([subject, count], i) => {
               const percentage = allNotes && allNotes.length > 0 ? (count / allNotes.length) * 100 : 0;
               const colors = ["bg-indigo-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"];
               return (
                 <div key={subject} className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                       <span className="truncate pr-4">{subject}</span>
                       <span>{count} notes</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                       <div className={cn("h-full rounded-full", colors[i % colors.length])} style={{ width: `${percentage}%` }} />
                    </div>
                 </div>
               );
             })}

             {allNotes?.length === 0 && (
               <div className="py-12 text-center text-slate-400 font-bold">
                  No subject data available yet.
               </div>
             )}

             <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                <h4 className="font-black text-slate-900 dark:text-white mb-2">Platform Insight</h4>
                <p className="text-sm text-slate-500 font-medium">
                  {allNotes && allNotes.length > 0 
                    ? `The community is most active in ${Object.entries(allNotes.reduce((acc: any, n) => { acc[n.subject] = (acc[n.subject] || 0) + 1; return acc; }, {})).sort((a: any, b: any) => b[1] - a[1])[0][0]}.` 
                    : "Start uploading resources to see platform-wide insights."}
                </p>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

