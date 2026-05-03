"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Upload, FileText, Trash2, Edit, Eye, Download, TrendingUp, Users,
  Clock, ArrowRight, Star, Zap, Award, BookOpen, ChevronRight,
  Plus, Settings, User, LogOut, Camera, CheckCircle2, AlertCircle, Trophy
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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Profile Hero */}
      <AnimatedSection direction="up">
        <div className="relative overflow-hidden rounded-[2rem] bg-indigo-600 p-6 md:p-12 text-white shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative group shrink-0">
              <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-white/20 overflow-hidden bg-indigo-500 flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <User size={48} />
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploadingAvatar} />
                  <Camera size={24} />
                </label>
              </div>
            </div>

            <div className="flex-grow text-center md:text-left space-y-2">
              <Badge variant="outline" className="bg-white/10 border-white/20 text-white uppercase font-black text-[10px] tracking-widest px-3 py-1">
                {stats.contributionLevel}
              </Badge>
              <h1 className="text-3xl md:text-5xl font-black">{profile?.name || profile?.full_name || "Scholar"}</h1>
              <p className="text-indigo-100 font-medium max-w-lg">{profile?.bio || "No bio set yet."}</p>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto">
              <Button asChild className="rounded-xl bg-white text-indigo-600 hover:bg-indigo-50 font-black px-8 h-12 shadow-lg">
                <Link href="/upload"><Plus size={20} className="mr-2" /> Upload Notes</Link>
              </Button>
              <Button onClick={handleLogout} variant="ghost" className="text-white hover:bg-white/10 font-bold h-10">
                <LogOut size={18} className="mr-2" /> Sign Out
              </Button>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-slate-100 dark:bg-slate-900 p-1 rounded-full border mb-8 flex-wrap h-auto inline-flex">
          <TabsTrigger value="overview" className="rounded-full px-6 py-2 font-bold transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="publications" className="rounded-full px-6 py-2 font-bold transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white">My Uploads</TabsTrigger>
          <TabsTrigger value="saved" className="rounded-full px-6 py-2 font-bold transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Saved</TabsTrigger>
          <TabsTrigger value="settings" className="rounded-full px-6 py-2 font-bold transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8 outline-none">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Uploads", value: notes.length, icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50" },
              { label: "Downloads", value: stats.totalDownloads, icon: Download, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Views", value: stats.totalViews, icon: Eye, color: "text-violet-600", bg: "bg-violet-50" },
              { label: "Level", value: stats.contributionLevel.split(' ')[0], icon: Award, color: "text-amber-500", bg: "bg-amber-50" },
            ].map((stat, i) => (
              <StaggerItem key={i}>
                <Card className="rounded-[1.5rem] border-none shadow-lg shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 text-center p-6">
                  <div className={cn("h-12 w-12 mx-auto rounded-xl flex items-center justify-center mb-3", stat.bg, "dark:bg-slate-800")}>
                    <stat.icon size={24} className={stat.color} />
                  </div>
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black mt-1">{stat.value}</p>
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

        <TabsContent value="publications" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notes.map(note => (
              <Card key={note.id} className="rounded-[1.5rem] border hover:shadow-xl transition-all overflow-hidden bg-white dark:bg-slate-900">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge className="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 border-none rounded-lg font-bold">
                      {note.subject}
                    </Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-lg">
                        <Link href={`/upload?edit=${note.id}`}><Edit size={16} /></Link>
                      </Button>
                      <DeleteNoteButton noteId={note.id} />
                    </div>
                  </div>
                  <h4 className="font-black text-lg line-clamp-1 mb-1">{note.title}</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase mb-4">{note.year} Year • Sem {note.semester || "N/A"} • {note.type}</p>
                  <div className="grid grid-cols-2 gap-2 pt-4 border-t">
                    <div className="flex flex-col items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <span className="font-black text-lg">{note.downloads || 0}</span>
                      <span className="text-[9px] uppercase font-bold text-slate-400">Downloads</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <span className="font-black text-lg">{note.views || 0}</span>
                      <span className="text-[9px] uppercase font-bold text-slate-400">Views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="saved" className="outline-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialSavedNotes.map((save: any) => (
              <Link key={save.id} href={`/notes/${save.notes?.id}`} className="p-6 bg-white dark:bg-slate-900 rounded-[1.5rem] border hover:shadow-xl transition-all flex flex-col gap-3 group">
                <div className="h-10 w-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                  <Star size={20} fill="currentColor" />
                </div>
                <h4 className="font-black truncate group-hover:text-indigo-600 transition-colors">{save.notes?.title}</h4>
                <p className="text-xs text-slate-400 font-bold uppercase">{save.notes?.subject}</p>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="outline-none">
          <Card className="rounded-[2rem] border-none shadow-2xl bg-white dark:bg-slate-900">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-2xl font-black">Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-slate-400">Display Name</Label>
                    <Input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="rounded-xl h-12 bg-slate-50 dark:bg-slate-800 border-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-slate-400">Department</Label>
                    <Input value={editForm.department} onChange={e => setEditForm({...editForm, department: e.target.value})} className="rounded-xl h-12 bg-slate-50 dark:bg-slate-800 border-none font-bold" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-slate-400">Academic Year</Label>
                    <Select 
                      value={editForm.year} 
                      onValueChange={(val: string | null) => setEditForm({...editForm, year: val || "1st"})}
                    >
                      <SelectTrigger className="rounded-xl h-12 bg-slate-50 dark:bg-slate-800 border-none font-bold">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {["1st", "2nd", "3rd", "4th"].map(y => (
                          <SelectItem key={y} value={y}>{y} Year</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-slate-400">Semester</Label>
                    <Select 
                      value={editForm.semester.toString()} 
                      onValueChange={(val: string | null) => setEditForm({...editForm, semester: parseInt(val || "1")})}
                    >
                      <SelectTrigger className="rounded-xl h-12 bg-slate-50 dark:bg-slate-800 border-none font-bold">
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                          <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <Label className="text-xs font-black uppercase text-slate-400">Bio</Label>
                    <Textarea value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} className="rounded-2xl min-h-[100px] bg-slate-50 dark:bg-slate-800 border-none font-bold p-4" />
                </div>
                <Button type="submit" disabled={isUpdating} className="rounded-xl bg-indigo-600 px-8 h-12 font-black shadow-lg">
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
