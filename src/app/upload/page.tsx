"use client";

import { useState, useRef, useEffect } from "react";
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
  ArrowRight,
  Book,
  Brain,
  ShieldCheck,
  Zap,
  Info,
  Eye,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { uploadNoteAction } from "@/lib/actions/notes";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const QUICK_SUBJECTS = [
  "Operating Systems", "DBMS", "Computer Networks", "DSA", 
  "Mathematics", "Physics", "Digital Electronics", "Software Engineering",
  "AI & ML", "Cyber Security"
];

const YEARS = ["1st", "2nd", "3rd", "4th"];
const TYPES = [
  "Notes", "Assignment", "PYQ", "Lab Manual", 
  "Syllabus", "Sessional Paper", "Test Paper", "Semester Paper", "Remedial Paper"
];

export default function UploadPage() {
  const router = useRouter();
  const supabase = createClient();
  const subjectInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
      if (selected.size > 15 * 1024 * 1024) {
        return toast.error("File is too large. Maximum size is 15MB.");
      }
      
      const allowedTypes = [
        "application/pdf", 
        "application/msword", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ];

      if (allowedTypes.includes(selected.type)) {
        setFile(selected);
        if (selected.type === "application/pdf") {
          const url = URL.createObjectURL(selected);
          setPreviewUrl(url);
        } else {
          setPreviewUrl(null);
        }
        
        const cleanName = selected.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
        setMetadata(prev => ({ ...prev, title: cleanName }));
      } else {
        toast.error("Invalid file type. Please upload PDF, DOCX, or PPTX.");
      }
    }
  };

  const handleSubjectClick = (sub: string) => {
    if (sub === "Other") {
      setMetadata({ ...metadata, subject: "" });
      subjectInputRef.current?.focus();
    } else {
      setMetadata({ ...metadata, subject: sub });
      toast.success(`Subject set to ${sub}`, { duration: 1000 });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file to upload");
    if (!metadata.subject) return toast.error("Please select or enter a subject");
    
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to upload.");
        router.push("/login");
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("notes")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("notes")
        .getPublicUrl(filePath);

      await uploadNoteAction({
        ...metadata,
        file_url: publicUrl,
      });

      toast.success("Brilliant! Your resource is live and helping others.");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background transition-colors py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-black text-xs uppercase tracking-widest mb-6 border border-amber-200 dark:border-amber-500/30 shadow-sm">
            <Sparkles size={14} className="animate-pulse" /> Community Contribution
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
            Share Your <span className="text-indigo-600 dark:text-indigo-400">Knowledge</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-bold leading-relaxed">
            Help thousands of students by uploading your study materials. Fast, simple, and impactful.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 space-y-6 order-2 lg:order-1"
          >
            <Card className="border-none shadow-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-[2.5rem] overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                <Brain size={120} />
              </div>
              <CardContent className="p-8 relative z-10">
                <h3 className="text-2xl font-black mb-6">Why Share?</h3>
                <div className="space-y-6">
                  {[
                    { icon: Zap, color: "bg-amber-400", text: "AI-Powered Summaries generated automatically" },
                    { icon: ShieldCheck, color: "bg-emerald-400", text: "Verified Contributor status for active users" },
                    { icon: Eye, color: "bg-rose-400", text: "Global Reach: See who your notes help" }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <div className={cn("p-2 rounded-xl text-slate-900 flex-shrink-0 shadow-lg", item.color)}>
                        <item.icon size={20} />
                      </div>
                      <p className="font-black text-white leading-tight">{item.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="p-8 bg-indigo-50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-indigo-100 dark:border-slate-800">
               <h4 className="font-black text-indigo-900 dark:text-indigo-400 mb-4 flex items-center gap-2">
                 <Info size={20} /> Pro Tip
               </h4>
               <p className="text-sm text-indigo-700/70 dark:text-slate-400 leading-relaxed font-bold">
                 Uploading <span className="text-indigo-600 font-black">PDFs</span> provides the best experience for students and the most accurate AI analysis!
               </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-8 order-1 lg:order-2"
          >
            <form onSubmit={handleUpload} className="space-y-10">
              <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border-t-8 border-indigo-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-black flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">1</div>
                    Select Resource
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                  <AnimatePresence mode="wait">
                    {!file ? (
                      <motion.div 
                        key="dropzone"
                        className="relative border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem] p-16 text-center hover:border-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all group cursor-pointer"
                      >
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.ppt,.pptx"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="mx-auto h-24 w-24 bg-indigo-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl">
                          <Upload size={48} />
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Click or Drag & Drop</h4>
                        <p className="text-slate-500 font-bold">PDF, Word, or PowerPoint (Max 15MB)</p>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="preview"
                        className="bg-indigo-50/50 dark:bg-slate-800/50 rounded-[2.5rem] p-8 border-2 border-indigo-200 dark:border-slate-700"
                      >
                        <div className="flex flex-col md:flex-row gap-10">
                          <div className="w-full md:w-56 h-72 bg-white dark:bg-slate-900 rounded-3xl border-4 border-white dark:border-slate-700 overflow-hidden shadow-2xl flex items-center justify-center relative group">
                            {previewUrl ? (
                              <iframe src={`${previewUrl}#toolbar=0`} className="w-full h-full pointer-events-none" />
                            ) : (
                              <div className="flex flex-col items-center gap-4">
                                <FileText size={72} className="text-indigo-600" />
                                <Badge className="bg-indigo-600 text-white font-black uppercase">{file.name.split('.').pop()}</Badge>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                               <Badge className="bg-white text-indigo-600 py-2 px-4 rounded-xl font-black shadow-xl">Ready to Upload</Badge>
                            </div>
                          </div>

                          <div className="flex-grow flex flex-col justify-center gap-6">
                            <div>
                              <Label className="text-xs font-black uppercase text-indigo-400 tracking-widest mb-2 block">Selected Document</Label>
                              <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-tight break-all">{file.name}</h3>
                              <p className="text-lg font-bold text-slate-400 mt-2">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                            <Button 
                              type="button" 
                              variant="destructive" 
                              onClick={() => { setFile(null); setPreviewUrl(null); }}
                              className="w-fit px-8 h-12 rounded-2xl font-black shadow-lg shadow-rose-500/20"
                            >
                              <X size={20} className="mr-2" /> Remove & Change
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border-t-8 border-emerald-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-black flex items-center gap-3">
                    <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">2</div>
                    Details & Metadata
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <Label className="text-sm font-black uppercase tracking-widest text-slate-400">Resource Title</Label>
                      <Input 
                        value={metadata.title}
                        onChange={(e) => setMetadata({...metadata, title: e.target.value})}
                        className="h-16 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-black text-xl focus:border-indigo-500 transition-all shadow-inner"
                        placeholder="e.g. OS Unit 1 Notes"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label className="text-sm font-black uppercase tracking-widest text-slate-400">Subject</Label>
                      <Input 
                        ref={subjectInputRef}
                        value={metadata.subject}
                        onChange={(e) => setMetadata({...metadata, subject: e.target.value})}
                        className="h-16 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-black text-xl focus:border-indigo-500 transition-all shadow-inner"
                        placeholder="Which subject is this?"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Quick Subject Tags</Label>
                    <div className="flex flex-wrap gap-3">
                      {QUICK_SUBJECTS.map((sub) => (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => handleSubjectClick(sub)}
                          className={cn(
                            "px-5 py-3 rounded-2xl text-sm font-black transition-all border-2",
                            metadata.subject === sub 
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-500/30 scale-105" 
                              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700 hover:border-indigo-400"
                          )}
                        >
                          {sub}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleSubjectClick("Other")}
                        className="px-5 py-3 rounded-2xl text-sm font-black transition-all border-2 bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 flex items-center gap-2"
                      >
                        <Plus size={16} /> Other
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <Label className="text-sm font-black uppercase tracking-widest text-slate-400">Academic Year</Label>
                      <div className="grid grid-cols-4 gap-3">
                        {YEARS.map((y) => (
                          <button
                            key={y}
                            type="button"
                            onClick={() => setMetadata({...metadata, year: y})}
                            className={cn(
                              "py-4 rounded-2xl font-black text-sm transition-all border-2",
                              metadata.year === y 
                                ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20" 
                                : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700 hover:border-emerald-400"
                            )}
                          >
                            {y}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <Label className="text-sm font-black uppercase tracking-widest text-slate-400">Resource Category</Label>
                      <div className="flex flex-wrap gap-2">
                        {TYPES.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setMetadata({...metadata, type: t})}
                            className={cn(
                              "px-4 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all border-2",
                              metadata.type === t 
                                ? "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20 scale-105" 
                                : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700 hover:border-rose-400"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <Button 
                      type="submit" 
                      className={cn(
                        "w-full py-12 rounded-[2.5rem] text-2xl font-black shadow-2xl transition-all relative overflow-hidden group",
                        file ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-slate-100 text-slate-400"
                      )}
                      disabled={loading || !file}
                    >
                      {loading ? (
                        <div className="flex items-center gap-4">
                          <Loader className="h-8 w-8 animate-spin" />
                          <span>Publishing your work...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-4">
                          <Zap size={28} className="fill-current group-hover:scale-125 transition-transform" />
                          <span>Submit Resource</span>
                          <ArrowRight size={28} className="ml-2 group-hover:translate-x-3 transition-transform" />
                        </div>
                      )}
                    </Button>
                    <p className="text-center text-sm text-slate-400 font-bold uppercase tracking-[0.2em] mt-6">
                      Trusted by 1000+ students at UIT
                    </p>
                  </div>
                </CardContent>
              </Card>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
