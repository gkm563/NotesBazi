"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Loader, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { uploadNoteAction } from "@/lib/actions/notes";

export default function UploadPage() {
  const router = useRouter();
  const supabase = createClient();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState({
    title: "",
    subject: "",
    year: "1st",
    type: "Notes",
    description: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 10 * 1024 * 1024) {
        return toast.error("File is too large. Maximum size is 10MB.");
      }
      
      if (
        selected.type === "application/pdf" ||
        selected.type === "application/msword" ||
        selected.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        selected.type === "application/vnd.ms-powerpoint" ||
        selected.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ) {
        setFile(selected);
        // Auto-fill title from filename
        const cleanName = selected.name.replace(/\.[^/.]+$/, "");
        setMetadata(prev => ({ ...prev, title: cleanName }));
      } else {
        toast.error("Invalid file type. Please upload PDF, DOCX, or PPTX.");
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file to upload");
    
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      // 1. Upload to Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("notes")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("notes")
        .getPublicUrl(filePath);

      // 2. Call Server Action (handles AI and DB)
      await uploadNoteAction({
        ...metadata,
        file_url: publicUrl,
      });

      toast.success("Note uploaded successfully with AI analysis!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-4">
            <Sparkles size={16} /> Contribute to Community
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Upload Your Resources</h1>
          <p className="text-slate-500 dark:text-slate-400">Help your peers by sharing quality study materials.</p>
        </header>

        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* File Picker */}
          <div className="space-y-6">
            <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden h-full flex flex-col">
              <CardHeader className="bg-indigo-600 text-white pb-10">
                <CardTitle className="text-xl">Step 1: Select File</CardTitle>
                <CardDescription className="text-indigo-100">Upload your PDF, DOCX, or PPTX file.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-center p-8 -mt-6">
                <div 
                  className={`relative border-2 border-dashed rounded-3xl p-10 text-center transition-all ${
                    file 
                      ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10" 
                      : "border-slate-200 dark:border-slate-800 hover:border-indigo-400"
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  {file ? (
                    <div className="space-y-3">
                      <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <FileText className="text-white" size={32} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{file.name}</p>
                        <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={(e) => { e.preventDefault(); setFile(null); }}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Remove File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                        <Upload className="text-slate-400" size={32} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Click or Drag & Drop</p>
                        <p className="text-sm text-slate-500">PDF, DOCX, PPTX up to 10MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Metadata */}
          <div className="space-y-6">
            <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-3xl">
              <CardHeader>
                <CardTitle>Step 2: Details</CardTitle>
                <CardDescription>Add metadata to help others find your notes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input 
                    value={metadata.title}
                    onChange={(e) => setMetadata({...metadata, title: e.target.value})}
                    placeholder="e.g. OS Unit 1 Notes"
                    className="rounded-2xl py-6"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Select value={metadata.year} onValueChange={(v) => setMetadata({...metadata, year: v})}>
                      <SelectTrigger className="rounded-2xl py-6">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="1st">1st Year</SelectItem>
                        <SelectItem value="2nd">2nd Year</SelectItem>
                        <SelectItem value="3rd">3rd Year</SelectItem>
                        <SelectItem value="4th">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={metadata.type} onValueChange={(v) => setMetadata({...metadata, type: v})}>
                      <SelectTrigger className="rounded-2xl py-6">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="Notes">Notes</SelectItem>
                        <SelectItem value="Assignment">Assignment</SelectItem>
                        <SelectItem value="PYQ">PYQ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input 
                    value={metadata.subject}
                    onChange={(e) => setMetadata({...metadata, subject: e.target.value})}
                    placeholder="e.g. Operating Systems"
                    className="rounded-2xl py-6"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Textarea 
                    value={metadata.description}
                    onChange={(e) => setMetadata({...metadata, description: e.target.value})}
                    placeholder="Briefly describe the content..."
                    className="rounded-2xl min-h-[100px]"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-7 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
                  disabled={loading || !file}
                >
                  {loading ? (
                    <>
                      <Loader className="mr-2 h-5 w-5 animate-spin" />
                      Uploading & Processing AI...
                    </>
                  ) : (
                    <>
                      Publish Resource <ArrowRight size={20} className="ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </main>
  );
}
