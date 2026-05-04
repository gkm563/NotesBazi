"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { uploadNoteAction } from '@/lib/actions/notes';
import { X, CheckCircle, AlertCircle, Loader2, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadItem {
  id: string;
  file: File;
  metadata: any;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

interface UploadContextType {
  uploads: UploadItem[];
  addUpload: (file: File, metadata: any) => void;
  removeUpload: (id: string) => void;
  isQueueActive: boolean;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export function UploadProvider({ children }: { children: React.ReactNode }) {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const supabase = createClient();

  const addUpload = useCallback((file: File, metadata: any) => {
    const id = Math.random().toString(36).substr(2, 9);
    setUploads(prev => [...prev, {
      id,
      file,
      metadata,
      progress: 0,
      status: 'pending'
    }]);
  }, []);

  const removeUpload = useCallback((id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id));
  }, []);

  const updateUpload = useCallback((id: string, updates: Partial<UploadItem>) => {
    setUploads(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  }, []);

  const compressImage = async (file: File): Promise<File> => {
    if (!file.type.startsWith('image/')) return file;
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1920;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              // Only use compressed if it's actually smaller
              resolve(compressedFile.size < file.size ? compressedFile : file);
            } else {
              resolve(file);
            }
          }, 'image/jpeg', 0.8);
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  };

  const processUpload = useCallback(async (item: UploadItem) => {
    if (item.status !== 'pending') return;

    updateUpload(item.id, { status: 'uploading' });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Authentication required");

      // Compress if it's an image
      const fileToUpload = await compressImage(item.file);
      
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;
      
      const bucket = "notes";
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${bucket}/${filePath}`;

      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`);
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          updateUpload(item.id, { progress: percentComplete });
        }
      };

      const responsePromise = new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(xhr.statusText || "Upload failed"));
          }
        };
        xhr.onerror = () => reject(new Error("Network error"));
      });

      xhr.send(fileToUpload);
      
      await responsePromise;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      // Save to database
      await uploadNoteAction({
        ...item.metadata,
        file_url: publicUrl,
      });

      updateUpload(item.id, { status: 'completed', progress: 100 });
      toast.success(`Uploaded: ${item.metadata.title}`);
      
      // Auto-remove completed after 5 seconds
      setTimeout(() => removeUpload(item.id), 5000);

    } catch (error: any) {
      updateUpload(item.id, { status: 'error', error: error.message });
      toast.error(`Failed: ${item.metadata.title}`);
    }
  }, [supabase, updateUpload, removeUpload]);

  useEffect(() => {
    const pendingItem = uploads.find(u => u.status === 'pending');
    if (pendingItem) {
      processUpload(pendingItem);
    }
  }, [uploads, processUpload]);

  const isQueueActive = uploads.some(u => u.status === 'uploading' || u.status === 'pending');

  return (
    <UploadContext.Provider value={{ uploads, addUpload, removeUpload, isQueueActive }}>
      {children}
      
      {/* Global Upload Progress UI */}
      <AnimatePresence>
        {uploads.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 right-6 z-[100] w-80 shadow-2xl"
          >
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-4 bg-indigo-600 text-white flex items-center justify-between cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
                <div className="flex items-center gap-2">
                   <Loader2 size={18} className={cn(isQueueActive && "animate-spin")} />
                   <span className="font-black text-xs uppercase tracking-widest">
                     {isQueueActive ? "Uploading Resources..." : "Uploads Finished"}
                   </span>
                </div>
                {isMinimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              
              {!isMinimized && (
                <div className="max-h-64 overflow-y-auto p-4 space-y-4">
                  {uploads.map(u => (
                    <div key={u.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                         <p className="text-[10px] font-black uppercase text-slate-400 truncate w-40">{u.metadata.title || u.file.name}</p>
                         {u.status === 'completed' ? (
                           <CheckCircle size={14} className="text-emerald-500" />
                         ) : u.status === 'error' ? (
                           <AlertCircle size={14} className="text-rose-500" />
                         ) : (
                           <span className="text-[10px] font-black text-indigo-500">{u.progress}%</span>
                         )}
                      </div>
                      <Progress value={u.progress} className="h-1.5" />
                      {u.status === 'error' && (
                        <p className="text-[8px] text-rose-500 font-bold">{u.error}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </UploadContext.Provider>
  );
}

export function useUpload() {
  const context = useContext(UploadContext);
  if (context === undefined) {
    throw new Error('useUpload must be used within an UploadProvider');
  }
  return context;
}
