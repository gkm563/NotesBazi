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
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
      {/* Profile Hero */}
      <AnimatedSection direction="up">
        <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-indigo-600 p-8 md:p-12 text-white shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Trophy size={200} />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
            <div className="relative group shrink-0">
              <div className="h-28 w-28 md:h-40 md:w-40 rounded-[2.5rem] border-4 border-white/20 overflow-hidden bg-indigo-500 flex items-center justify-center shadow-2xl">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <User size={56} className="text-white/50" />
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploadingAvatar} />
                  <Camera size={28} />
                </label>
              </div>
              {isUploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-[2.5rem]">
                   <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent" />
                </div>
              )}
            </div>
            
            <div className="flex-grow text-center md:text-left space-y-4">
              <div className="space-y-1">
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-none rounded-lg px-3 py-1 font-black text-[10px] uppercase tracking-widest">
                  {stats.contributionLevel}
                </Badge>
                <h1 className="text-3xl md:text-6xl font-black tracking-tight">{profile?.name || profile?.full_name || "Scholar"}</h1>
                <p className="text-indigo-100 font-medium max-w-lg mx-auto md:mx-0 leading-relaxed opacity-90">{profile?.bio || "Academic contributor at NotesBazi."}</p>
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                   <Building2 size={16} className="text-indigo-200" />
                   <span className="text-sm font-bold">{profile?.department || "General"}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                   <GraduationCap size={16} className="text-indigo-200" />
                   <span className="text-sm font-bold">{profile?.year} Year • Sem {profile?.semester}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[200px]">
              <Button asChild className="w-full rounded-2xl bg-white text-indigo-600 hover:bg-indigo-50 font-black h-14 shadow-xl text-lg">
                <Link href="/upload"><Plus size={24} className="mr-2" /> Upload</Link>
              </Button>
              <Button onClick={handleLogout} variant="ghost" className="w-full text-indigo-100 hover:bg-white/10 font-bold h-12 rounded-xl">
                <LogOut size={18} className="mr-2" /> Sign Out
              </Button>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          <TabsList className="bg-slate-100 dark:bg-slate-900/50 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 flex w-max min-w-full md:w-auto h-auto">
            <TabsTrigger value="overview" className="flex-1 md:flex-none rounded-xl px-8 py-3 font-black text-xs uppercase tracking-widest transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg shadow-indigo-500/20">Overview</TabsTrigger>
            <TabsTrigger value="publications" className="flex-1 md:flex-none rounded-xl px-8 py-3 font-black text-xs uppercase tracking-widest transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg shadow-indigo-500/20">Uploads</TabsTrigger>
            <TabsTrigger value="saved" className="flex-1 md:flex-none rounded-xl px-8 py-3 font-black text-xs uppercase tracking-widest transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg shadow-indigo-500/20">Saved</TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 md:flex-none rounded-xl px-8 py-3 font-black text-xs uppercase tracking-widest transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg shadow-indigo-500/20">Settings</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6 md:space-y-8 outline-none mt-4">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Uploads", value: notes.length, icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50" },
              { label: "Downloads", value: stats.totalDownloads, icon: Download, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Views", value: stats.totalViews, icon: Eye, color: "text-violet-600", bg: "bg-violet-50" },
              { label: "Points", value: (notes.length * 50) + stats.totalDownloads, icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
            ].map((stat, i) => (
              <StaggerItem key={i}>
                <Card className="rounded-[2rem] border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 text-center p-6 md:p-8 hover:-translate-y-1 transition-all">
                  <div className={cn("h-12 w-12 md:h-16 md:w-16 mx-auto rounded-2xl flex items-center justify-center mb-4", stat.bg, "dark:bg-slate-800")}>
                    <stat.icon size={24} className={stat.color} />
                  </div>
                  <p className="text-[10px] md:text-xs uppercase font-black text-slate-400 tracking-widest mb-1">{stat.label}</p>
                  <p className="text-2xl md:text-4xl font-black">{stat.value}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-black flex items-center gap-2"><Clock size={20} /> Recent Uploads</h3>
              {notes.slice(0, 3).map(note => (
                <div key={note.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="text-slate-400" size={20} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold truncate">{note.title}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase">{note.subject}</p>
                  </div>
                  <Button variant="ghost" size="icon" asChild className="rounded-full">
                    <Link href={`/notes/${note.id}`}><ArrowRight size={18} /></Link>
                  </Button>
                </div>
              ))}
            </div>
            <Card className="bg-slate-900 text-white rounded-[2rem] p-8 relative overflow-hidden">
              <Zap className="absolute top-0 right-0 p-4 opacity-10" size={100} />
              <h3 className="text-xl font-black mb-2">Grow your Impact</h3>
              <p className="text-slate-400 text-sm mb-6">Upload 5 more notes to reach the next tier!</p>
              <Button asChild className="w-full rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-black">
                <Link href="/upload">Upload Now</Link>
              </Button>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="publications" className="space-y-6 outline-none mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notes.length > 0 ? notes.map(note => (
              <Card key={note.id} className="rounded-[2rem] border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 hover:shadow-2xl transition-all overflow-hidden group">
                <CardContent className="p-6 md:p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-14 w-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                       <FileText size={28} />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" asChild className="h-10 w-10 rounded-xl border-slate-100 dark:border-slate-800">
                        <Link href={`/upload?edit=${note.id}`}><Edit size={18} /></Link>
                      </Button>
                      <DeleteNoteButton noteId={note.id} />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <h4 className="font-black text-xl md:text-2xl text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 transition-colors">{note.title}</h4>
                    <div className="flex flex-wrap items-center gap-2">
                       <Badge className="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 border-none rounded-lg font-black text-[10px] tracking-wider px-2 py-0.5">
                         {note.subject}
                       </Badge>
                       <span className="text-[10px] text-slate-300 font-bold">•</span>
                       <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{note.year} Year • Sem {note.semester}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col items-center">
                      <span className="font-black text-2xl text-slate-900 dark:text-white">{note.downloads || 0}</span>
                      <span className="text-[9px] uppercase font-black text-slate-400 tracking-[0.1em]">Downloads</span>
                    </div>
                    <div className="flex flex-col items-center border-l border-slate-200 dark:border-slate-700">
                      <span className="font-black text-2xl text-slate-900 dark:text-white">{note.views || 0}</span>
                      <span className="text-[9px] uppercase font-black text-slate-400 tracking-[0.1em]">Views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-full py-24 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                 <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                 <h3 className="text-xl font-black text-slate-900 dark:text-white">Nothing uploaded yet</h3>
                 <p className="text-slate-400 max-w-xs mx-auto mt-2">Share your knowledge with the community and earn points!</p>
                 <Button asChild className="mt-8 rounded-xl px-8 h-12 bg-indigo-600">
                   <Link href="/upload">Upload Now</Link>
                 </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="saved" className="outline-none mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialSavedNotes.length > 0 ? initialSavedNotes.map((save: any) => (
              <Link key={save.id} href={`/notes/${save.notes?.id}`} className="group block">
                <Card className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl hover:-translate-y-2 transition-all">
                  <div className="h-14 w-14 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                    <Star size={28} fill="currentColor" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-xl text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 transition-colors">{save.notes?.title}</h4>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{save.notes?.subject}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between text-indigo-600 font-black text-xs uppercase tracking-widest">
                     View Resource <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            )) : (
              <div className="col-span-full py-24 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                 <Star size={48} className="mx-auto text-slate-200 mb-4" />
                 <h3 className="text-xl font-black text-slate-900 dark:text-white">No saved notes</h3>
                 <p className="text-slate-400 max-w-xs mx-auto mt-2">Bookmark resources you find helpful to see them here.</p>
                 <Button asChild variant="outline" className="mt-8 rounded-xl px-8 h-12 border-slate-200">
                   <Link href="/notes">Explore Resources</Link>
                 </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="outline-none mt-4">
          <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white dark:bg-slate-900 overflow-hidden">
            <CardHeader className="p-8 md:p-12 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-2xl md:text-3xl font-black">Profile Settings</CardTitle>
              <CardDescription className="text-slate-500 font-medium">Manage your academic profile and personal information.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 md:p-12">
              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Display Name</Label>
                    <Input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="rounded-2xl h-14 bg-slate-50 dark:bg-slate-800 border-none font-bold text-lg px-6 focus:ring-4 focus:ring-indigo-500/10" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Department</Label>
                    <Input value={editForm.department} onChange={e => setEditForm({...editForm, department: e.target.value})} className="rounded-2xl h-14 bg-slate-50 dark:bg-slate-800 border-none font-bold text-lg px-6 focus:ring-4 focus:ring-indigo-500/10" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Academic Year</Label>
                    <Select 
                      value={editForm.year} 
                      onValueChange={(val: string | null) => setEditForm({...editForm, year: val || "1st"})}
                    >
                      <SelectTrigger className="rounded-2xl h-14 bg-slate-50 dark:bg-slate-800 border-none font-bold text-lg px-6 focus:ring-4 focus:ring-indigo-500/10">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl shadow-2xl">
                        {["1st", "2nd", "3rd", "4th"].map(y => (
                          <SelectItem key={y} value={y} className="py-3 font-bold">{y} Year</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Semester</Label>
                    <Select 
                      value={editForm.semester.toString()} 
                      onValueChange={(val: string | null) => setEditForm({...editForm, semester: parseInt(val || "1")})}
                    >
                      <SelectTrigger className="rounded-2xl h-14 bg-slate-50 dark:bg-slate-800 border-none font-bold text-lg px-6 focus:ring-4 focus:ring-indigo-500/10">
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl shadow-2xl">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                          <SelectItem key={s} value={s.toString()} className="py-3 font-bold">Semester {s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Public Bio</Label>
                    <Textarea value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} className="rounded-3xl min-h-[140px] bg-slate-50 dark:bg-slate-800 border-none font-bold p-6 text-lg focus:ring-4 focus:ring-indigo-500/10" />
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <Button type="submit" disabled={isUpdating} className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 px-12 h-14 font-black shadow-xl shadow-indigo-500/30 text-lg transition-all hover:scale-[1.02] active:scale-95">
                    {isUpdating ? "Saving Changes..." : "Save Profile"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
