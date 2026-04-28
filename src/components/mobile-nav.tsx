"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Explore", href: "/notes", icon: Search },
    { name: "Upload", href: "/upload", icon: PlusCircle },
    { name: "Profile", href: "/dashboard", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all",
                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              )}
            >
              <div className={cn(
                "p-1 rounded-full transition-all duration-300",
                isActive ? "bg-indigo-50 dark:bg-indigo-900/30 scale-110" : "bg-transparent scale-100"
              )}>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "fill-indigo-100 dark:fill-indigo-900/20" : ""} />
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-all",
                isActive ? "font-bold opacity-100" : "opacity-80"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
