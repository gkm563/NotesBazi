"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  AlertTriangle, 
  UploadCloud, 
  Settings,
  LogOut,
  ChevronLeft,
  PieChart,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "User Management", href: "/admin/users" },
  { icon: FileText, label: "Notes Management", href: "/admin/notes" },
  { icon: AlertTriangle, label: "Report System", href: "/admin/reports" },
  { icon: UploadCloud, label: "Bulk Upload", href: "/admin/bulk-upload" },
  { icon: PieChart, label: "Analytics", href: "/admin/analytics" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col sticky top-0 h-screen">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white">Admin Hub</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200",
                isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                  : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-100 dark:border-slate-800">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 rounded-xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
        >
          <LogOut size={20} />
          Exit Admin
        </Button>
      </div>
    </aside>
  );
}
