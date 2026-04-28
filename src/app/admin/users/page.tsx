import { createClient } from "@/lib/supabase/server";
import { 
  Users, 
  Search, 
  MoreVertical, 
  UserMinus, 
  Ban, 
  ShieldCheck,
  Calendar,
  Mail,
  Upload,
  Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function UserManagement() {
  const supabase = await createClient();

  // Fetch all users from profiles
  const { data: users, error } = await supabase
    .from("profiles")
    .select(`
      *,
      notes:notes(count),
      saved_notes:saved_notes(count)
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Student Community</h1>
          <p className="text-slate-500 font-medium mt-2">Manage user accounts, roles, and platform access.</p>
        </div>
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <Input 
            placeholder="Search students by name or email..." 
            className="pl-12 py-6 rounded-2xl border-none bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/40 dark:shadow-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/40 dark:shadow-none rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="p-8 text-xs font-black uppercase text-slate-400 tracking-widest">Student</th>
                <th className="p-8 text-xs font-black uppercase text-slate-400 tracking-widest">Account Status</th>
                <th className="p-8 text-xs font-black uppercase text-slate-400 tracking-widest">Stats</th>
                <th className="p-8 text-xs font-black uppercase text-slate-400 tracking-widest">Joined</th>
                <th className="p-8 text-xs font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users?.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400 text-lg">
                        {user.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          {user.name}
                          {user.role === 'admin' && <ShieldCheck size={14} className="text-indigo-500" />}
                        </div>
                        <div className="text-xs font-medium text-slate-400 flex items-center gap-1 mt-1">
                          <Mail size={12} /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <Badge className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-none rounded-lg px-3 py-1 font-bold">
                      Active
                    </Badge>
                  </td>
                  <td className="p-8">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700">
                        <Upload size={12} className="text-indigo-500" /> {user.notes?.[0]?.count || 0}
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700">
                        <Download size={12} className="text-emerald-500" /> {user.saved_notes?.[0]?.count || 0}
                      </div>
                    </div>
                  </td>
                  <td className="p-8 text-sm font-bold text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-8 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 hover:bg-slate-100 dark:hover:bg-slate-800">
                          <MoreVertical size={20} className="text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 rounded-[1.5rem] p-2 mt-2 shadow-2xl border-slate-200/50 dark:border-slate-800/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
                        <DropdownMenuItem className="rounded-xl cursor-pointer p-4 flex gap-3 font-bold text-slate-600 focus:bg-indigo-50 dark:focus:bg-indigo-900/20">
                          <Users size={16} /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl cursor-pointer p-4 flex gap-3 font-bold text-amber-600 focus:bg-amber-50 dark:focus:bg-amber-900/10">
                          <Ban size={16} /> Block Student
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl cursor-pointer p-4 flex gap-3 font-bold text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10">
                          <UserMinus size={16} /> Delete Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
