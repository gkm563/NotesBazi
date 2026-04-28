"use client";

import { useState, useCallback } from "react";
import { 
  UploadCloud, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Trash2,
  Edit3,
  Search,
  Wand2
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { getAIModelData } from "@/lib/actions/ai";

interface StagedFile {
  id: string;
  file: File;
  title: string;
  subject: string;
  year: string;
  type: string;
  status: 'pending' | 'processing' | 'ready' | 'error';
  metadata?: any;
}

export default function BulkUpload() {
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  const handleAIAssist = async (id: string) => {
    const item = stagedFiles.find(f => f.id === id);
    if (!item) return;

    updateFileData(id, { status: 'processing' });
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(item.file);
      reader.onload = async () => {
        const base64 = reader.result as string;
        const aiData = await getAIModelData(base64);
        
        if (aiData) {
          updateFileData(id, {
            title: aiData.title || item.title,
            subject: aiData.subject || item.subject,
            year: aiData.year || item.year,
            status: 'ready'
          });
          toast.success(`AI identified: ${aiData.subject}`);
        } else {
          updateFileData(id, { status: 'pending' });
          toast.error("AI couldn't analyze this file.");
        }
      };
    } catch (error) {
      updateFileData(id, { status: 'error' });
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      title: file.name.replace(/\.[^/.]+$/, ""),
      subject: "",
      year: "1st",
      type: "Notes",
      status: 'pending' as const
    }));
    setStagedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = (id: string) => {
    setStagedFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateFileData = (id: string, data: Partial<StagedFile>) => {
    setStagedFiles(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));
  };

  const handleBulkUpload = async () => {
    if (stagedFiles.length === 0) return;
    setIsUploading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      for (const staged of stagedFiles) {
        if (staged.status === 'ready' || staged.status === 'pending') {
          updateFileData(staged.id, { status: 'processing' });
          
          // 1. Upload to Storage
          const fileName = `${Date.now()}-${staged.file.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("notes")
            .upload(fileName, staged.file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from("notes")
            .getPublicUrl(fileName);

          // 2. Save to Database
          const { error: dbError } = await supabase
            .from("notes")
            .insert({
              title: staged.title,
              subject: staged.subject || "General",
              year: staged.year,
              type: staged.type,
              file_url: publicUrl,
              uploader_id: user.id,
              is_verified: true,
              downloads: 0
            });

          if (dbError) throw dbError;
          updateFileData(staged.id, { status: 'ready' });
        }
      }
      toast.success("All resources uploaded successfully!");
      setStagedFiles([]);
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Bulk Repository</h1>
          <p className="text-slate-500 font-medium mt-2">Upload multiple resources, auto-classify, and verify in one go.</p>
        </div>
        <Button 
          onClick={handleBulkUpload} 
          disabled={isUploading || stagedFiles.length === 0}
          className="h-14 px-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-xl shadow-indigo-500/20 disabled:opacity-50 flex gap-2"
        >
          {isUploading ? <Loader2 className="animate-spin" /> : <UploadCloud />}
          Publish All Resources
        </Button>
      </div>

      {/* Dropzone */}
      <div 
        {...getRootProps()} 
        className={cn(
          "relative h-64 border-4 border-dashed rounded-[3rem] transition-all flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden",
          isDragActive 
            ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10" 
            : "border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-900/50"
        )}
      >
        <input {...getInputProps()} />
        <div className="h-20 w-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center text-indigo-600 animate-bounce-slow">
           <UploadCloud size={40} />
        </div>
        <div className="text-center">
           <h3 className="text-xl font-black text-slate-900 dark:text-white">Drag & drop resources here</h3>
           <p className="text-slate-500 font-medium">Supports PDF, JPG, PNG & ZIP (Max 10MB per file)</p>
        </div>
      </div>

      {/* Staging Area */}
      {stagedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-4">
             <h2 className="text-xl font-black flex items-center gap-2">
                Staging Area <Badge variant="secondary" className="rounded-lg">{stagedFiles.length}</Badge>
             </h2>
             <Button variant="ghost" onClick={() => setStagedFiles([])} className="text-red-500 font-bold hover:bg-red-50">Clear Staging</Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
             {stagedFiles.map((item) => (
               <Card key={item.id} className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden group">
                 <CardContent className="p-6 flex flex-col lg:flex-row items-center gap-6">
                    <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center flex-shrink-0">
                       <FileText className="text-slate-400" />
                    </div>
                    
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">File Title</label>
                          <Input 
                            value={item.title} 
                            onChange={(e) => updateFileData(item.id, { title: e.target.value })}
                            className="h-11 rounded-xl border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50"
                          />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subject</label>
                          <Input 
                            placeholder="e.g. Mathematics"
                            value={item.subject} 
                            onChange={(e) => updateFileData(item.id, { subject: e.target.value })}
                            className="h-11 rounded-xl border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50"
                          />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Academic Year</label>
                          <select 
                            value={item.year}
                            onChange={(e) => updateFileData(item.id, { year: e.target.value })}
                            className="w-full h-11 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 text-sm outline-none"
                          >
                             <option value="1st">1st Year</option>
                             <option value="2nd">2nd Year</option>
                             <option value="3rd">3rd Year</option>
                             <option value="4th">4th Year</option>
                          </select>
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Type</label>
                          <select 
                            value={item.type}
                            onChange={(e) => updateFileData(item.id, { type: e.target.value })}
                            className="w-full h-11 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 text-sm outline-none"
                          >
                             <option value="Notes">Notes</option>
                             <option value="Assignment">Assignment</option>
                             <option value="PYQ">PYQ</option>
                          </select>
                       </div>
                    </div>

                    <div className="flex items-center gap-2 border-l border-slate-100 dark:border-slate-800 pl-6">
                       <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAIAssist(item.id)}
                          className="h-11 w-11 rounded-xl hover:bg-indigo-50 text-indigo-400 hover:text-indigo-600 transition-colors"
                          title="AI Auto-Fill"
                       >
                          <Wand2 size={20} />
                       </Button>
                       {item.status === 'processing' ? (
                         <Loader2 className="animate-spin text-indigo-500" />
                       ) : item.status === 'ready' ? (
                         <CheckCircle className="text-emerald-500" />
                       ) : (
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeFile(item.id)}
                            className="h-11 w-11 rounded-xl hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors"
                          >
                           <Trash2 size={20} />
                         </Button>
                       )}
                    </div>
                 </CardContent>
               </Card>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
