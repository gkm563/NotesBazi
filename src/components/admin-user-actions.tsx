'use client'

import { 
  MoreVertical, 
  UserMinus, 
  Ban, 
  ShieldCheck,
  Users,
  CheckCircle,
  Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { toggleBlockUser, deleteUserAccount } from "@/lib/actions/admin";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UserRowActionsProps {
  userId: string;
  isBlocked: boolean;
  username: string;
}

export function UserRowActions({ userId, isBlocked, username }: UserRowActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBlock = async () => {
    startTransition(async () => {
      try {
        setLoading(true);
        const res = await toggleBlockUser(userId, isBlocked);
        if (res.success) {
          toast.success(isBlocked ? "User unblocked" : "User blocked");
          router.refresh();
        } else {
          toast.error("Error: " + res.error);
        }
      } catch (err) {
        toast.error("Operation failed");
      } finally {
        setLoading(false);
      }
    });
  };

  const handleDelete = async () => {
    if (!confirm(`Permanently delete ${username}?`)) return;
    
    startTransition(async () => {
      try {
        setLoading(true);
        const res = await deleteUserAccount(userId);
        if (res.success) {
          toast.success("User deleted");
          router.refresh();
        } else {
          toast.error("Error: " + res.error);
        }
      } catch (err) {
        toast.error("Operation failed");
      } finally {
        setLoading(false);
      }
    });
  };

  const isLoading = loading || isPending;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 hover:bg-slate-100 dark:hover:bg-slate-800" disabled={isLoading}>
          {isLoading ? <Loader2 size={20} className="animate-spin text-slate-400" /> : <MoreVertical size={20} className="text-slate-400" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-[1.5rem] p-2 mt-2 shadow-2xl border-slate-200/50 dark:border-slate-800/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
        <DropdownMenuItem className="rounded-xl cursor-pointer p-4 flex gap-3 font-bold text-slate-600 focus:bg-indigo-50 dark:focus:bg-indigo-900/20" onClick={() => window.location.href = `/profile/${username}`}>
          <Users size={16} /> View Profile
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`rounded-xl cursor-pointer p-4 flex gap-3 font-bold focus:bg-amber-50 dark:focus:bg-amber-900/10 ${isBlocked ? 'text-emerald-600' : 'text-amber-600'}`}
          onClick={handleBlock}
        >
          {isBlocked ? <CheckCircle size={16} /> : <Ban size={16} />}
          {isBlocked ? "Unblock Student" : "Block Student"}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="rounded-xl cursor-pointer p-4 flex gap-3 font-bold text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10"
          onClick={handleDelete}
        >
          <UserMinus size={16} /> Delete Account
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
