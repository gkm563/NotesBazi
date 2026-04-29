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
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { DeleteNoteButton } from "@/components/delete-note-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Admin Guard: Redirect admins to their own dashboard
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === 'admin') {
    redirect("/admin");
  }

  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .eq("uploaded_by", user.id)
    .order("created_at", { ascending: false });

  const { data: savedNotesData } = await supabase
    .from("saved_notes")
    .select(`
      id,
      notes (
        id,
        title,
        subject,
        year
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const stats = {
    uploads: notes?.length || 0,
    downloads: notes?.reduce((acc, note) => acc + (note.downloads || 0), 0) || 0,
    bookmarks: savedNotesData?.length || 0, 
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">User Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage your contributions and track performance.</p>
          </div>
          <Button asChild className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 h-12 px-8">
            <Link href="/upload" className="flex gap-2">
              <Upload size={18} /> Upload New Note
            </Link>
          </Button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: "Total Uploads", value: stats.uploads, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Total Downloads", value: stats.downloads, icon: Download, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Bookmarks Received", value: stats.bookmarks, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden">
               <CardContent className="p-8 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-4xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                  </div>
                  <div className={`h-14 w-14 ${stat.bg} dark:bg-slate-800 rounded-2xl flex items-center justify-center`}>
                    <stat.icon className={stat.color} size={28} />
                  </div>
               </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* My Uploads List */}
          <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-black">My Uploaded Resources</CardTitle>
                <CardDescription className="text-base font-medium">A list of all materials you've shared with the community.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {notes && notes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-xs font-bold uppercase tracking-widest">
                      <tr>
                        <th className="px-8 py-4">Resource</th>
                        <th className="px-8 py-4">Status</th>
                        <th className="px-8 py-4">Downloads</th>
                        <th className="px-8 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {notes.map((note) => (
                        <tr key={note.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                  <FileText className="text-slate-400 group-hover:text-indigo-600" size={24} />
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{note.title}</p>
                                  <p className="text-xs text-slate-500 font-semibold">{note.subject} • {note.year} Year</p>
                                </div>
                              </div>
                          </td>
                          <td className="px-8 py-6">
                            <Badge className="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-none rounded-lg font-bold">Published</Badge>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center font-bold text-slate-700 dark:text-slate-300">
                              <Download size={14} className="mr-2 text-slate-400" /> {note.downloads || 0}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-2">
                               <Button variant="ghost" size="sm" asChild className="rounded-xl h-10 w-10 p-0 hover:bg-indigo-50">
                                 <Link href={`/notes/${note.id}`}><Eye size={18} className="text-slate-400 hover:text-indigo-600" /></Link>
                               </Button>
                               <Button variant="ghost" size="sm" asChild className="rounded-xl h-10 w-10 p-0 hover:bg-indigo-50">
                                 <Link href={`/upload?edit=${note.id}`}><Edit size={18} className="text-slate-400 hover:text-indigo-600" /></Link>
                               </Button>
                               <DeleteNoteButton noteId={note.id} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-20 text-center bg-slate-50/50 dark:bg-slate-800/20">
                  <FileText size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">You haven't uploaded anything yet</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Start sharing your notes and help your community grow.</p>
                  <Button asChild className="rounded-xl bg-indigo-600 font-bold hover:scale-105 transition-transform">
                    <Link href="/upload">Upload Now</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Saved Notes List */}
          <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50 dark:border-slate-800">
              <CardTitle className="text-2xl font-black flex items-center"><Star className="mr-3 text-amber-500" size={24}/> Saved Resources</CardTitle>
              <CardDescription className="text-base font-medium">Materials you have bookmarked for quick access.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {savedNotesData && savedNotesData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-xs font-bold uppercase tracking-widest">
                      <tr>
                        <th className="px-8 py-4">Resource</th>
                        <th className="px-8 py-4">Uploaded By</th>
                        <th className="px-8 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {savedNotesData.map((save: any) => {
                        const note = save.notes;
                        if (!note) return null;
                        return (
                          <tr key={save.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                  <div className="h-12 w-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                                    <Star className="text-amber-400 group-hover:text-amber-600" size={24} />
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{note.title}</p>
                                    <p className="text-xs text-slate-500 font-semibold">{note.subject} • {note.year} Year</p>
                                  </div>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                               <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{note.profiles?.name || "Community Member"}</p>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <Button variant="outline" size="sm" asChild className="rounded-xl border-slate-200 hover:bg-indigo-50 hover:text-indigo-600">
                                 <Link href={`/notes/${note.id}`}>View Note</Link>
                               </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-20 text-center bg-slate-50/50 dark:bg-slate-800/20">
                  <Star size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">No saved notes yet</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Browse resources and bookmark them for later.</p>
                  <Button asChild className="rounded-xl bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white font-bold hover:scale-105 transition-transform">
                    <Link href="/notes">Explore Notes</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
