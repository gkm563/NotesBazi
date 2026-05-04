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
  Wand2,
  Presentation,
  Settings2,
  LayoutGrid,
  CheckSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { getAIModelData } from "@/lib/actions/ai";
import { useUpload } from "@/components/providers/upload-provider";

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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { addUpload } = useUpload();
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === stagedFiles.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(stagedFiles.map(f => f.id)));
    }
  };

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
    setStagedFiles(prev => {
      const isSelected = selectedIds.has(id);
      return prev.map(f => {
        if (f.id === id) return { ...f, ...data };
        
        // Sync other selected items but exclude unique fields like title
        if (isSelected && selectedIds.has(f.id)) {
          const { title, ...syncableData } = data;
          return { ...f, ...syncableData };
        }
        return f;
      });
    });
  };

  const handleBulkUpload = async () => {
    const filesToUpload = selectedIds.size > 0 
      ? stagedFiles.filter(f => selectedIds.has(f.id))
      : stagedFiles;

    if (filesToUpload.length === 0) return;
    setIsUploading(true);
    
    try {
      for (const staged of filesToUpload) {
        addUpload(staged.file, {
          title: staged.title,
          subject: staged.subject || "General",
          year: staged.year,
          type: staged.type,
          is_verified: true,
        });
      }
      
      toast.success(`Queued ${filesToUpload.length} resources for background upload.`);
      
      // Remove uploaded files from staging
      const uploadedIds = new Set(filesToUpload.map(f => f.id));
      setStagedFiles(prev => prev.filter(f => !uploadedIds.has(f.id)));
      setSelectedIds(new Set());
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
          {selectedIds.size > 0 ? `Publish ${selectedIds.size} Selected` : "Publish All Resources"}
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
           <p className="text-slate-500 font-medium">Supports PDF, PPTX, DOCX & Images (Max 10MB per file)</p>
        </div>
      </div>

      {/* Staging Area */}
      {stagedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                   <Checkbox 
                     checked={selectedIds.size === stagedFiles.length && stagedFiles.length > 0}
                     onCheckedChange={toggleSelectAll}
                     className="h-6 w-6 rounded-lg border-2"
                   />
                   <span className="text-sm font-black text-slate-500 uppercase tracking-widest">Select All</span>
                </div>
                
                {selectedIds.size > 0 && (
                  <div className="flex items-center gap-4 pl-6 border-l border-slate-200 dark:border-slate-700">
                     <Badge className="bg-indigo-600 text-white px-3 py-1 rounded-lg font-black">
                        {selectedIds.size} Selected
                     </Badge>
                     <p className="text-xs text-slate-400 font-bold italic">
                        * Editing one selected item will sync all {selectedIds.size} items
                     </p>
                  </div>
                )}
             </div>

             <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setStagedFiles([])} className="text-red-500 font-bold hover:bg-red-50 rounded-xl">
                   <Trash2 size={18} className="mr-2" /> Clear All
                </Button>
             </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
             {stagedFiles.map((item) => (
               <Card 
                 key={item.id} 
                 className={cn(
                   "border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden group transition-all duration-300",
                   selectedIds.has(item.id) && "ring-2 ring-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10"
                 )}
               >
                 <CardContent className="p-6 flex flex-col lg:flex-row items-center gap-6">
                    <div className="flex items-center gap-4">
                       <Checkbox 
                         checked={selectedIds.has(item.id)}
                         onCheckedChange={() => toggleSelect(item.id)}
                         className="h-6 w-6 rounded-lg border-2"
                       />
                       <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center flex-shrink-0">
                          {item.file.name.toLowerCase().match(/\.(ppt|pptx)$/) ? (
                            <Presentation className="text-orange-400" />
                          ) : item.file.name.toLowerCase().match(/\.(doc|docx)$/) ? (
                            <FileText className="text-blue-400" />
                          ) : (
                            <FileText className="text-slate-400" />
                          )}
                       </div>
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

