"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  User, 
  Building2, 
  AtSign, 
  Save, 
  Loader, 
  ArrowLeft,
  CheckCircle2,
  Camera,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { updateProfileAction } from "@/lib/actions/profile";
import Link from "next/link";
import { AnimatedSection } from "@/components/ui/animated-section";

const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Basic Sciences",
  "Other"
];

export default function SettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    department: "",
    year: "1st",
    semester: 1
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (data) {
          setProfile(data);
          setAvatarUrl(data.avatar_url || null);
          setFormData({
            name: data.name || "",
            username: data.username || "",
            department: data.department || "Other",
            year: data.year || "1st",
            semester: data.semester || 1
          });
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    setUploadingAvatar(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Bust cache by appending a timestamp
      const finalUrl = `${publicUrl}?t=${Date.now()}`;
      setAvatarUrl(finalUrl);
      
      await updateProfileAction({ avatar_url: finalUrl });
      toast.success("Profile picture updated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfileAction(formData);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  const initials = formData.name ? formData.name.slice(0, 2).toUpperCase() : "U";

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
          </Link>
        </div>

        <AnimatedSection direction="up">
          <header>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Account Settings</h1>
            <p className="text-slate-500 font-medium mt-2">Manage your public profile and preferences.</p>
          </header>
        </AnimatedSection>

        <AnimatedSection direction="up" delay={0.1}>
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Profile Picture Card */}
            <Card className="border-none shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 border-b border-slate-50 dark:border-slate-800">
                <CardTitle className="text-2xl font-black flex items-center gap-3">
                  <Camera className="text-indigo-600" /> Profile Picture
                </CardTitle>
                <CardDescription>Upload a photo to personalize your profile card on notes.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex items-center gap-8">
                  {/* Avatar Preview */}
                  <div className="relative shrink-0">
                    <div className="h-24 w-24 rounded-[1.5rem] overflow-hidden bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-indigo-500/20">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        initials
                      )}
                    </div>
                    {uploadingAvatar && (
                      <div className="absolute inset-0 rounded-[1.5rem] bg-black/50 flex items-center justify-center">
                        <Loader className="animate-spin text-white" size={24} />
                      </div>
                    )}
                  </div>

                  {/* Upload Area */}
                  <div className="flex-1 space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploadingAvatar}
                      onClick={() => fileInputRef.current?.click()}
                      className="h-12 px-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-bold transition-all"
                    >
                      <Upload size={18} className="mr-2 text-indigo-500" />
                      {uploadingAvatar ? "Uploading..." : "Choose Image"}
                    </Button>
                    <p className="text-xs text-slate-400 font-medium">PNG, JPG or WebP. Max 2MB.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Info Card */}
            <Card className="border-none shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 border-b border-slate-50 dark:border-slate-800">
                <CardTitle className="text-2xl font-black flex items-center gap-3">
                  <User className="text-indigo-600" /> Personal Information
                </CardTitle>
                <CardDescription>This information will be visible to other students on every note card.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <Input 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="h-14 pl-12 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold focus:border-indigo-500 transition-all"
                        placeholder="Gautam Kumar"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Username</Label>
                    <div className="relative">
                      <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <Input 
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '')})}
                        className="h-14 pl-12 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold focus:border-indigo-500 transition-all"
                        placeholder="gautam_kun"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Department</Label>
                  <Select 
                    value={formData.department} 
                    onValueChange={(val: string | null) => setFormData({...formData, department: val || "Other"})}
                  >
                    <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold focus:ring-indigo-500/20">
                      <div className="flex items-center gap-3">
                        <Building2 size={18} className="text-slate-400" />
                        <SelectValue placeholder="Select Department" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-200 dark:border-slate-700 shadow-2xl">
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept} className="py-3 font-medium">
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Academic Year</Label>
                    <Select 
                      value={formData.year} 
                      onValueChange={(val: string | null) => setFormData({...formData, year: val || "1st"})}
                    >
                      <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold focus:ring-indigo-500/20">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-slate-200 dark:border-slate-700 shadow-2xl">
                        {["1st", "2nd", "3rd", "4th"].map((y) => (
                          <SelectItem key={y} value={y} className="py-3 font-medium">{y} Year</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Current Semester</Label>
                    <Select 
                      value={formData.semester.toString()} 
                      onValueChange={(val: string | null) => setFormData({...formData, semester: parseInt(val || "1")})}
                    >
                      <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold focus:ring-indigo-500/20">
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-slate-200 dark:border-slate-700 shadow-2xl">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                          <SelectItem key={s} value={s.toString()} className="py-3 font-medium">Semester {s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={saving}
                    className="w-full md:w-auto h-14 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-500/20 flex gap-2 transition-all hover:scale-[1.02]"
                  >
                    {saving ? <Loader className="animate-spin" /> : <Save size={20} />}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-2xl shadow-slate-200/50 dark:shadow-none bg-slate-900 text-white rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-8 flex items-center justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-black flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-400" /> Verified Status
                  </h3>
                  <p className="text-slate-400 text-sm font-medium">
                    {profile?.role === 'admin' 
                      ? "You are an administrator with full access." 
                      : "Contribute high-quality notes to earn a verified badge on your profile."}
                  </p>
                </div>
                {profile?.role === 'admin' && (
                  <Badge className="bg-emerald-500 text-white border-none py-2 px-4 rounded-xl font-black">
                    ADMIN
                  </Badge>
                )}
              </CardContent>
            </Card>
          </form>
        </AnimatedSection>
      </div>
    </main>
  );
}
