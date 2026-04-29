"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  AlertTriangle, 
  Menu,
  ShieldCheck,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Home", href: "/admin" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: FileText, label: "Notes", href: "/admin/notes" },
  { icon: AlertTriangle, label: "Reports", href: "/admin/reports" },
];

export function MobileAdminNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="font-black text-slate-900 dark:text-white">Admin Hub</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Side Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60]" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Side Menu Panel */}
      <div className={cn(
        "fixed top-0 left-0 h-full w-[280px] bg-white dark:bg-slate-900 z-[70] transition-transform duration-300 ease-in-out p-6 shadow-2xl",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black">Admin Hub</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </Button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all",
                  isActive 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <item.icon size={22} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Bar for quick access */}
      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around p-3 z-50">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1">
              <div className={cn(
                "p-2 rounded-xl transition-colors",
                isActive ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600" : "text-slate-400"
              )}>
                <item.icon size={20} />
              </div>
              <span className={cn("text-[10px] font-bold", isActive ? "text-indigo-600" : "text-slate-400")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
