import { createClient } from "@/lib/supabase/server";
import { 
  AlertTriangle, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Clock,
  User,
  FileText,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ReportSystem() {
  const supabase = await createClient();

  // Fetch reports with associated notes and profiles
  const { data: reports, error } = await supabase
    .from("reports")
    .select(`
      *,
      notes(id, title),
      profiles(name)
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Active Reports</h1>
          <p className="text-slate-500 font-medium mt-2">Moderate reported content and maintain community guidelines.</p>
        </div>
        <Badge className="bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-none px-6 py-2 rounded-full font-black text-sm">
           {reports?.length || 0} Open Reports
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {reports && reports.length > 0 ? reports.map((report) => (
          <Card key={report.id} className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden group">
            <CardContent className="p-0">
               <div className="flex flex-col lg:flex-row">
                  {/* Left: Indicator */}
                  <div className="w-2 bg-red-500" />
                  
                  {/* Content */}
                  <div className="flex-grow p-8">
                     <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                        <div className="space-y-4 flex-grow">
                           <div className="flex items-center gap-3">
                              <Badge className="bg-red-50 text-red-600 border-none font-black px-3 py-1">URGENT</Badge>
                              <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                                 <Clock size={16} /> {new Date(report.created_at).toLocaleString()}
                              </div>
                           </div>
                           
                           <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                              Reported Resource: <Link href={`/notes/${report.notes?.id}`} className="text-indigo-600 hover:underline">{report.notes?.title}</Link>
                           </h3>
                           
                           <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                              <p className="text-slate-600 dark:text-slate-300 font-medium italic">"{report.reason}"</p>
                           </div>
                           
                           <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                              <div className="flex items-center gap-2">
                                 <User size={16} className="text-indigo-500" /> 
                                 Reported by: <span className="text-slate-900 dark:text-white">{report.profiles?.name || "Anonymous Student"}</span>
                              </div>
                           </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 w-full lg:w-64">
                           <Button className="w-full h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black shadow-lg shadow-red-500/20 flex gap-2">
                              <Trash2 size={20} /> Delete Resource
                           </Button>
                           <Button variant="outline" className="w-full h-14 rounded-2xl font-black border-slate-200 dark:border-slate-800 flex gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-600">
                              <CheckCircle size={20} /> Dismiss Report
                           </Button>
                        </div>
                     </div>
                  </div>
               </div>
            </CardContent>
          </Card>
        )) : (
          <div className="py-32 text-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
            <div className="h-24 w-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-6 text-emerald-500">
               <CheckCircle size={48} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Community is Clean</h3>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md">
              No active reports found. All resources are currently meeting the community guidelines.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
