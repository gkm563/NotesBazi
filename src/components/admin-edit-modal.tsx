"use client";

import { useState } from "react";
import { Edit, Loader, Save, X } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { updateResourceByAdmin } from "@/lib/actions/admin";

interface AdminEditModalProps {
  note: any;
}

const YEARS = ["1st", "2nd", "3rd", "4th"];
const TYPES = [
  "Notes", "Assignment", "PYQ", "Lab Manual", 
  "Syllabus", "Sessional Paper", "Test Paper", "Semester Paper", "Remedial Paper"
];

export function AdminEditModal({ note }: AdminEditModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: note.title,
    subject: note.subject,
    year: note.year,
    semester: note.semester || 1,
    type: note.type,
    description: note.description || "",
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await updateResourceByAdmin(note.id, formData);
      if (res.success) {
        toast.success("Resource updated successfully!");
        setOpen(false);
      } else {
        throw new Error(res.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="rounded-2xl h-12 w-12 p-0 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-all border-slate-100 dark:border-slate-800"
        >
          <Edit size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">Edit Resource Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label className="font-bold ml-1">Title</Label>
            <Input 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="rounded-xl h-12"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-bold ml-1">Subject</Label>
              <Input 
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold ml-1">Type</Label>
              <Select 
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v })}
              >
                <SelectTrigger className="rounded-xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-bold ml-1">Academic Year</Label>
              <Select 
                value={formData.year}
                onValueChange={(v) => setFormData({ ...formData, year: v })}
              >
                <SelectTrigger className="rounded-xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {YEARS.map(y => <SelectItem key={y} value={y}>{y} Year</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-bold ml-1">Semester</Label>
              <Select 
                value={formData.semester.toString()}
                onValueChange={(v) => setFormData({ ...formData, semester: parseInt(v) })}
              >
                <SelectTrigger className="rounded-xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-bold ml-1">Description</Label>
            <Textarea 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="rounded-xl min-h-[100px]"
              placeholder="Add details about this resource..."
            />
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl h-12 flex-grow">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading} className="rounded-xl h-12 flex-grow bg-indigo-600 hover:bg-indigo-700">
            {loading ? <Loader className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
