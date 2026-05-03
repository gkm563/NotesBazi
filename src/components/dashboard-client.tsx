"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Upload, FileText, Trash2, Edit, Eye, Download, TrendingUp, Users,
  Clock, ArrowRight, Star, Zap, Award, BookOpen, ChevronRight,
  Plus, Settings, User, LogOut, Camera, CheckCircle2, AlertCircle, Trophy,
  Building2, GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Link from "next/link";
import { DeleteNoteButton } from "@/components/delete-note-button";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export function DashboardClient({ 
  initialProfile, 
  initialNotes, 
  initialSavedNotes,
  stats
}: { 
  initialProfile: any; 
  initialNotes: any[]; 
  initialSavedNotes: any[];
  stats: {
    totalDownloads: number;
    totalViews: number;
    contributionLevel: string;
  }
}) {
  const supabase = createClient();
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  const [notes, setNotes] = useState(initialNotes);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [editForm, setEditForm] = useState({
    name: initialProfile?.name || initialProfile?.full_name || "",
    bio: initialProfile?.bio || "",
    department: initialProfile?.department || "",
    year: initialProfile?.year || "1st",
    semester: initialProfile?.semester || 1
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: editForm.name,
          bio: editForm.bio,
          department: editForm.department,
          year: editForm.year,
          semester: editForm.semester
        })
        .eq("id", profile.id);

      if (error) throw error;
      
      setProfile({ ...profile, ...editForm });
      toast.success("Profile updated successfully!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      toast.success("Avatar updated!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to upload avatar");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Profile Hero - More Compact */}
      <AnimatedSection direction="up">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-indigo-600 p-6 md:p-10 text-white shadow-2xl">
          <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none">
            <Trophy size={280} />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="relative shrink-0">
              <div className="h-24 w-24 md:h-32 md:w-32 rounded-3xl border-4 border-white/20 overflow-hidden bg-indigo-500 shadow-2xl">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-400 text-white font-black text-3xl">
                    {profile?.name?.[0] || "S"}
                  </div>
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploadingAvatar} />
                  <Camera size={24} />
                </label>
              </div>
            </div>
            
            <div className="flex-grow text-center md:text-left space-y-3">
              <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                 <Zap size={12} className="text-amber-300" />
                 <span className="text-[10px] font-black uppercase tracking-widest">{stats.contributionLevel || "Rising Star"}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none">{profile?.name || profile?.full_name || "Scholar"}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Badge className="bg-indigo-500/50 hover:bg-indigo-500/50 text-white border-none rounded-lg px-3 py-1 font-bold text-xs">
                  {profile?.department || "General"}
                </Badge>
                <Badge className="bg-indigo-500/50 hover:bg-indigo-500/50 text-white border-none rounded-lg px-3 py-1 font-bold text-xs">
                  {profile?.year || "1st"} Year • Sem {profile?.semester || 1}
                </Badge>
              </div>
            </div>

            <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
              <Button asChild className="flex-1 md:flex-none rounded-2xl bg-white text-indigo-600 hover:bg-indigo-50 font-black h-12 md:h-14 px-8 shadow-xl">
                <Link href="/upload"><Plus size={20} className="mr-2" /> Upload</Link>
              </Button>
              <Button onClick={handleLogout} variant="ghost" className="rounded-xl text-white hover:bg-white/10 font-bold h-12">
                <LogOut size={18} className="mr-2" /> Sign Out
              </Button>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Tabs - Fixed Spacing */}
      <Tabs defaultValue="overview" className="w-full">
        <div className="sticky top-20 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md py-4 -mx-4 px-4 border-b">
          <TabsList className="bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border w-full md:w-auto overflow-x-auto flex justify-start md:justify-center">
            {["overview", "publications", "saved", "settings"].map((tab) => (
              <TabsTrigger 
                key={tab}
                value={tab} 
                className="flex-1 md:flex-none rounded-xl px-6 md:px-10 py-3 font-black text-[10px] uppercase tracking-widest transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                {tab === "publications" ? "Uploads" : tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="pt-6">
          <TabsContent value="overview" className="space-y-8 outline-none m-0">
            {/* Stats Grid - Compact */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: "Uploads", value: notes.length, icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50" },
                { label: "Downloads", value: stats.totalDownloads, icon: Download, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Views", value: stats.totalViews, icon: Eye, color: "text-violet-600", bg: "bg-violet-50" },
                { label: "Points", value: (notes.length * 50) + stats.totalDownloads, icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
              ].map((stat, i) => (
                <Card key={i} className="rounded-3xl border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 p-5 md:p-6 text-center hover:-translate-y-1 transition-all">
                  <div className={cn("h-10 w-10 md:h-12 md:w-12 mx-auto rounded-xl flex items-center justify-center mb-3", stat.bg, "dark:bg-slate-800")}>
                    <stat.icon size={20} className={stat.color} />
                  </div>
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">{stat.label}</p>
                  <p className="text-xl md:text-3xl font-black">{stat.value}</p>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-xl font-black flex items-center gap-2 px-1"><Clock size={20} className="text-indigo-600" /> Recent Activity</h3>
                <div className="space-y-4">
                  {notes.slice(0, 4).length > 0 ? notes.slice(0, 4).map(note => (
                    <Link key={note.id} href={`/notes/${note.id}`} className="block group">
                      <div className="p-4 bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:shadow-xl transition-all">
                        <div className="h-12 w-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-indigo-50 transition-colors">
                          <FileText className="text-slate-400 group-hover:text-indigo-600" size={20} />
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="font-black text-slate-900 dark:text-white truncate group-hover:text-indigo-600">{note.title}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{note.subject} • {note.year} Year</p>
                        </div>
                        <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  )) : (
                    <div className="p-12 text-center bg-slate-50/50 dark:bg-slate-900/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                      <p className="text-slate-400 font-bold">No activity yet.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <Card className="bg-slate-900 text-white rounded-[2rem] p-8 relative overflow-hidden shadow-2xl border-none">
                  <Zap className="absolute -top-6 -right-6 opacity-20 text-indigo-500" size={120} />
                  <div className="relative z-10">
                    <Badge className="bg-indigo-600 mb-4 border-none font-black text-[10px] tracking-widest px-3">NEXT LEVEL</Badge>
                    <h3 className="text-2xl font-black mb-2 leading-tight">Contribution Power</h3>
                    <p className="text-slate-400 text-sm font-medium mb-6">Upload 4 more notes to unlock the <span className="text-white font-bold">Silver Contributor</span> badge!</p>
                    <Button asChild className="w-full rounded-xl bg-white text-slate-900 hover:bg-indigo-50 font-black h-12">
                      <Link href="/upload">Upload Now</Link>
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="publications" className="space-y-6 outline-none m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {notes.length > 0 ? notes.map(note => (
                <Card key={note.id} className="rounded-3xl border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <Badge className="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 border-none rounded-lg font-black text-[10px] tracking-wider px-2 py-1">
                        {note.subject}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-lg">
                          <Link href={`/upload?edit=${note.id}`}><Edit size={16} /></Link>
                        </Button>
                        <DeleteNoteButton noteId={note.id} />
                      </div>
                    </div>
                    <h4 className="font-black text-lg text-slate-900 dark:text-white line-clamp-1 mb-1 group-hover:text-indigo-600">{note.title}</h4>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-6">{note.year} Year • Sem {note.semester} • {note.type}</p>
                    
                    <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                      <div className="text-center">
                        <p className="font-black text-xl">{note.downloads || 0}</p>
                        <p className="text-[8px] uppercase font-black text-slate-400">Downloads</p>
                      </div>
                      <div className="text-center border-l">
                        <p className="font-black text-xl">{note.views || 0}</p>
                        <p className="text-[8px] uppercase font-black text-slate-400">Views</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="col-span-full py-20 text-center">
                   <h3 className="text-lg font-black text-slate-400">No uploads found.</h3>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="space-y-6 outline-none m-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialSavedNotes.length > 0 ? initialSavedNotes.map((save: any) => (
                <Link key={save.id} href={`/notes/${save.notes?.id}`} className="block group">
                  <Card className="p-6 bg-white dark:bg-slate-900 rounded-3xl border-none shadow-xl shadow-slate-200/40 dark:shadow-none hover:-translate-y-1 transition-all">
                    <div className="h-10 w-10 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-xl flex items-center justify-center mb-4">
                      <Star size={20} fill="currentColor" />
                    </div>
                    <h4 className="font-black text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600">{save.notes?.title}</h4>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{save.notes?.subject}</p>
                  </Card>
                </Link>
              )) : (
                <div className="col-span-full py-20 text-center">
                   <h3 className="text-lg font-black text-slate-400">No saved notes found.</h3>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="outline-none m-0">
            <Card className="rounded-[2rem] border-none shadow-2xl bg-white dark:bg-slate-900 p-6 md:p-10">
              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Display Name</Label>
                    <Input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="rounded-xl h-12 bg-slate-50 dark:bg-slate-800 border-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Department</Label>
                    <Input value={editForm.department} onChange={e => setEditForm({...editForm, department: e.target.value})} className="rounded-xl h-12 bg-slate-50 dark:bg-slate-800 border-none font-bold" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Academic Year</Label>
                    <Select value={editForm.year} onValueChange={(v) => setEditForm({...editForm, year: v})}>
                      <SelectTrigger className="rounded-xl h-12 bg-slate-50 dark:bg-slate-800 border-none font-bold">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {["1st", "2nd", "3rd", "4th"].map(y => (
                          <SelectItem key={y} value={y}>{y} Year</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Semester</Label>
                    <Select value={editForm.semester.toString()} onValueChange={(v) => setEditForm({...editForm, semester: parseInt(v)})}>
                      <SelectTrigger className="rounded-xl h-12 bg-slate-50 dark:bg-slate-800 border-none font-bold">
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                          <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">About You</Label>
                    <Textarea value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} className="rounded-2xl min-h-[100px] bg-slate-50 dark:bg-slate-800 border-none font-bold p-4" />
                </div>

                <Button type="submit" disabled={isUpdating} className="w-full md:w-auto rounded-xl bg-indigo-600 px-10 h-12 font-black shadow-lg shadow-indigo-500/20">
                  {isUpdating ? "Saving..." : "Save Profile Changes"}
                </Button>
              </form>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
