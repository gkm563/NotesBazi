import { createClient } from "@/lib/supabase/server";
import { 
  Users, 
  Search, 
  ShieldCheck,
  Calendar,
  Mail,
  Upload,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UserRowActions } from "@/components/admin-user-actions";
import { AdminSearch } from "@/components/admin-search";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PageProps {
  searchParams: Promise<{
    sort?: string;
    order?: 'asc' | 'desc';
    q?: string;
  }>
}

export default async function UserManagement({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const sort = params.sort || 'created_at';
  const order = params.order || 'desc';
  const query = params.q || '';

  // 1. Prepare Queries
  let dbQuery = supabase.from("profiles").select("*");
  if (query) {
    dbQuery = dbQuery.or(`full_name.ilike.%${query}%,email.ilike.%${query}%,username.ilike.%${query}%`);
  }
  if (['full_name', 'role', 'created_at', 'username'].includes(sort)) {
    dbQuery = dbQuery.order(sort, { ascending: order === 'asc' });
  } else {
    dbQuery = dbQuery.order('created_at', { ascending: false });
  }

  // 2. Fetch Data in Parallel
  const [
    { data: usersData, error: usersError },
    { data: notesCounts }
  ] = await Promise.all([
    dbQuery,
    supabase.from("notes").select("uploaded_by")
  ]);

  if (usersError) {
    console.error("Error fetching users:", usersError);
  }

  // 3. Merge Data
  let users = (usersData || []).filter(u => u.email !== 'admin@notesbazi.com');

  const countMap: Record<string, number> = {};
  notesCounts?.forEach(n => {
    if (n.uploaded_by) {
      countMap[n.uploaded_by] = (countMap[n.uploaded_by] || 0) + 1;
    }
  });

  users = users.map(user => ({
    ...user,
    notes_count: countMap[user.id] || 0,
    notes: [{ count: countMap[user.id] || 0 }]
  }));

  // 4. Calculate Stats
  const totalStudents = users.length;
  const blockedStudents = users.filter(u => u.is_blocked).length;
  const activeStudents = totalStudents - blockedStudents;

  // 5. Handle complex sorting in memory
  if (sort === 'uploads') {
    users.sort((a, b) => {
      const diff = a.notes_count - b.notes_count;
      return order === 'asc' ? diff : -diff;
    });
  } else if (sort === 'student') {
    users.sort((a, b) => {
      const nameA = (a.full_name || a.username || '').toLowerCase();
      const nameB = (b.full_name || b.username || '').toLowerCase();
      return order === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  }

  const error = usersError;

  const getSortLink = (column: string) => {
    const newOrder = sort === column && order === 'asc' ? 'desc' : 'asc';
    return `/admin/users?sort=${column}&order=${newOrder}${query ? `&q=${query}` : ''}`;
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sort !== column) return <ArrowUpDown size={14} className="ml-1 opacity-20" />;
    return order === 'asc' ? <ArrowUp size={14} className="ml-1 text-indigo-500" /> : <ArrowDown size={14} className="ml-1 text-indigo-500" />;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Student Community</h1>
          <p className="text-slate-500 font-medium mt-2">Manage user accounts, roles, and platform access.</p>
        </div>
        <AdminSearch 
          defaultValue={query} 
          placeholder="Search students..." 
          baseUrl="/admin/users" 
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Students", value: totalStudents, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Active Now", value: activeStudents, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Blocked Accounts", value: blockedStudents, color: "text-red-600", bg: "bg-red-50" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-xl shadow-slate-200/20 dark:shadow-none bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
            <CardContent className="p-6 flex items-center justify-between">
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</p>
               </div>
               <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                  <Users size={20} className={stat.color} />
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {error && (
        <div className="p-6 bg-red-50 text-red-600 rounded-3xl flex items-center gap-3 font-bold border border-red-100">
           <AlertCircle /> Error loading users: {error.message}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/40 dark:shadow-none rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="p-4 md:p-8">
                  <Link href={getSortLink('student')} className="flex items-center text-xs font-black uppercase text-slate-400 tracking-widest hover:text-indigo-500 transition-colors">
                    Student <SortIcon column="student" />
                  </Link>
                </th>
                <th className="p-4 md:p-8">
                  <Link href={getSortLink('role')} className="flex items-center text-xs font-black uppercase text-slate-400 tracking-widest hover:text-indigo-500 transition-colors">
                    Role <SortIcon column="role" />
                  </Link>
                </th>
                <th className="p-4 md:p-8 hidden sm:table-cell">
                  <Link href={getSortLink('uploads')} className="flex items-center text-xs font-black uppercase text-slate-400 tracking-widest hover:text-indigo-500 transition-colors">
                    Uploads <SortIcon column="uploads" />
                  </Link>
                </th>
                <th className="p-4 md:p-8 hidden lg:table-cell">
                  <Link href={getSortLink('created_at')} className="flex items-center text-xs font-black uppercase text-slate-400 tracking-widest hover:text-indigo-500 transition-colors">
                    Joined <SortIcon column="created_at" />
                  </Link>
                </th>
                <th className="p-4 md:p-8 text-xs font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users?.map((user) => {
                const displayName = user.full_name || user.name || user.username || user.email?.split('@')[0] || "Unknown Student";
                const handle = user.username || user.email?.split('@')[0] || "student";
                const isBlocked = user.is_blocked === true;

                return (
                  <tr key={user.id} className={cn(
                    "hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group",
                    isBlocked && "opacity-60 bg-slate-50/30"
                  )}>
                    <td className="p-4 md:p-8">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className={cn(
                          "h-10 w-10 md:h-12 md:w-12 rounded-2xl flex items-center justify-center font-black text-sm md:text-lg uppercase",
                          isBlocked ? "bg-slate-200 text-slate-500" : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                        )}>
                          {displayName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2 truncate">
                            <span className="truncate">{displayName}</span>
                            {user.role === 'admin' && <ShieldCheck size={14} className="text-indigo-500 flex-shrink-0" />}
                          </div>
                          <div className="text-[10px] md:text-xs font-medium text-slate-400 mt-1 flex items-center gap-1 truncate">
                            <Mail size={10} className="opacity-50 flex-shrink-0" /> <span className="truncate">{user.email || `@${handle}`}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 md:p-8">
                      <Badge className={cn(
                        "border-none rounded-lg px-2 md:px-3 py-1 font-bold text-[10px] md:text-xs",
                        user.role === 'admin' ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
                      )}>
                        {user.role?.toUpperCase() || 'STUDENT'}
                      </Badge>
                    </td>
                    <td className="p-4 md:p-8 hidden sm:table-cell">
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700 w-fit">
                        <Upload size={12} className="text-indigo-500" /> {user.notes_count}
                      </div>
                    </td>
                    <td className="p-4 md:p-8 text-sm font-bold text-slate-500 hidden lg:table-cell" suppressHydrationWarning>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : "N/A"}
                      </div>
                    </td>
                    <td className="p-4 md:p-8 text-right">
                      <UserRowActions userId={user.id} isBlocked={isBlocked} username={displayName} />
                    </td>
                  </tr>
                );
              })}
              {users?.length === 0 && !error && (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-400">
                       <Users size={48} className="opacity-20" />
                       <p className="font-bold">No students found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
