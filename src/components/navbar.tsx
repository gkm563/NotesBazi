"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { 
  BookOpen, 
  Search, 
  Upload, 
  User, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Star,
  PlusCircle,
  Bell,
  Heart,
  Trophy,
  ChevronRight
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "@/components/mode-toggle";
import { CommandMenu } from "@/components/command-menu";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    router.refresh();
    router.push("/");
  };

  const navLinks = [
    { name: "Explore", href: "/notes" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Community", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className={cn(
      "sticky top-0 z-[100] w-full transition-all duration-500 px-4 py-3 md:px-6",
      isScrolled 
        ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm" 
        : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/20 rounded-[2rem] px-6 h-16 md:h-20 shadow-xl shadow-slate-200/20 dark:shadow-none">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="h-10 w-10 md:h-12 md:w-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30"
          >
            <BookOpen className="h-6 w-6 text-white" />
          </motion.div>
          <span className="hidden sm:block text-xl md:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
            NotesBazi
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={cn(
                "text-sm font-black uppercase tracking-widest transition-all hover:text-indigo-600 dark:hover:text-indigo-400",
                pathname === link.href ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <CommandMenu />
          <ModeToggle />
          {user ? (
            <div className="flex items-center gap-2 md:gap-4">
              <Link 
                href="/upload" 
                className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 text-white font-black text-sm shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all"
              >
                <PlusCircle size={18} /> Upload
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:shadow-xl transition-all outline-none">
                    <User className="h-5 w-5 md:h-6 md:w-6 text-slate-600 dark:text-slate-300" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-[2.5rem] p-4 mt-4 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-slate-200/50 dark:border-slate-800/50">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="p-4 pt-2">
                      <p className="text-sm font-black text-slate-900 dark:text-white truncate">{user.user_metadata?.full_name || "Student"}</p>
                      <p className="text-xs font-bold text-slate-400 mt-0.5 truncate">{user.email}</p>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="my-2 bg-slate-100 dark:bg-slate-800" />
                  <DropdownMenuItem asChild className="rounded-2xl p-4 cursor-pointer focus:bg-indigo-50 dark:focus:bg-indigo-900/20 transition-all group">
                    <Link href="/dashboard" className="flex items-center gap-4 w-full">
                      <LayoutDashboard className="h-5 w-5 text-indigo-600" />
                      <span className="font-black text-sm">Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-2xl p-4 cursor-pointer focus:bg-indigo-50 dark:focus:bg-indigo-900/20 transition-all group">
                    <Link href="/leaderboard" className="flex items-center gap-4 w-full">
                      <Trophy className="h-5 w-5 text-amber-500" />
                      <span className="font-black text-sm">Leaderboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-2xl p-4 cursor-pointer focus:bg-indigo-50 dark:focus:bg-indigo-900/20 transition-all group">
                    <Link href="/upload" className="flex items-center gap-4 w-full md:hidden">
                      <PlusCircle className="h-5 w-5 text-indigo-600" />
                      <span className="font-black text-sm">Upload Note</span>
                    </Link>
                  </DropdownMenuItem>
                  {user?.email === "admin@notesbazi.com" && (
                    <DropdownMenuItem asChild className="rounded-2xl p-4 cursor-pointer focus:bg-emerald-50 dark:focus:bg-emerald-900/20 transition-all group">
                      <Link href="/admin" className="flex items-center gap-4 w-full">
                        <ShieldCheck className="h-5 w-5 text-emerald-600" />
                        <span className="font-black text-sm">Admin Portal</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="my-2 bg-slate-100 dark:bg-slate-800" />
                  <DropdownMenuItem onClick={handleSignOut} className="rounded-2xl p-4 cursor-pointer text-red-500 focus:bg-red-50 dark:focus:bg-red-900/10 transition-all">
                    <div className="flex items-center gap-4 w-full">
                      <LogOut className="h-5 w-5" />
                      <span className="font-black text-sm">Sign Out</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "hidden md:flex font-black text-slate-600 dark:text-slate-300 rounded-full px-6")}>
                Log in
              </Link>
              <Link href="/signup" className={cn(buttonVariants(), "rounded-full px-6 md:px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-500/20")}>
                Join Now
              </Link>
            </div>
          )}

          {/* Mobile Search & Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button 
              onClick={() => {
                // We need to trigger the CommandMenu's setOpen.
                // Since it's a separate component, I should probably use a custom event or a shared state.
                // For now, I'll just dispatch a custom event.
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
              }}
              className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"
            >
              <Search size={24} />
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 right-0 mx-4 mt-2 p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800/50 shadow-2xl z-[100]"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="p-4 rounded-2xl font-black text-lg text-slate-900 dark:text-white hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all flex justify-between items-center"
                >
                  {link.name}
                  <ChevronRight size={20} className="text-slate-300" />
                </Link>
              ))}
              <Separator className="my-4 bg-slate-100 dark:bg-slate-800" />
              {user ? (
                <>
                  <Link 
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="p-4 rounded-2xl font-black text-lg text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 transition-all flex items-center gap-4"
                  >
                    <LayoutDashboard size={20} /> My Dashboard
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="p-4 rounded-2xl font-black text-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all flex items-center gap-4 text-left"
                  >
                    <LogOut size={20} /> Sign Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className={cn(buttonVariants({ variant: "outline" }), "py-6 rounded-2xl font-black")}>Log in</Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)} className={cn(buttonVariants(), "py-6 rounded-2xl bg-indigo-600 text-white font-black")}>Join Now</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
