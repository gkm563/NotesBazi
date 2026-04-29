"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Upload, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Explore", icon: Search, href: "/notes" },
    { label: "Upload", icon: Upload, href: "/upload" },
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800/50 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] dark:shadow-none flex items-center justify-around h-18 px-4 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 transition-all duration-300 relative px-3",
                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"
              )}
            >
              <div className={cn(
                "p-2 rounded-2xl transition-all duration-300",
                isActive ? "bg-indigo-50 dark:bg-indigo-900/40 scale-110" : "bg-transparent scale-100"
              )}>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest transition-all duration-300 overflow-hidden",
                isActive ? "max-h-4 opacity-100 mt-1" : "max-h-0 opacity-0 mt-0"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
