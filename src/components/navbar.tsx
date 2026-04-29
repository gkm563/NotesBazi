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

  ShieldCheck
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-indigo-500/30">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              NotesBazi
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/notes" className="text-sm font-bold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
              Explore
            </Link>
            <Link href="/about" className="text-sm font-bold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-bold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
              Contact
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full h-10 w-10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <div className="hidden md:flex items-center gap-4 border-l border-slate-200 dark:border-slate-800 ml-2 pl-5">
              {user ? (
                <>
                  <Link href="/upload" className={buttonVariants({ variant: "ghost", className: "rounded-full px-5 flex gap-2 font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400" })}>
                    <Upload className="h-4 w-4" />
                    Upload
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="rounded-full border border-slate-200 dark:border-slate-800 h-10 w-10 flex items-center justify-center overflow-hidden shadow-sm hover:shadow-md transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer">
                        <User className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-[2rem] p-3 mt-2 shadow-2xl border-slate-200/50 dark:border-slate-800/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="font-normal p-4">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-black leading-none">{user.user_metadata?.full_name || "Student"}</p>
                            <p className="text-xs leading-none text-slate-500 mt-1">{user.email}</p>
                          </div>
                        </DropdownMenuLabel>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 mx-1 my-2" />
                      <DropdownMenuItem asChild className="rounded-2xl cursor-pointer p-4 flex gap-3 font-bold focus:bg-indigo-50 dark:focus:bg-indigo-900/20 focus:text-indigo-600 dark:focus:text-indigo-400 transition-colors">
                        <Link href="/dashboard" className="flex items-center gap-3 w-full">
                          <LayoutDashboard className="h-4 w-4" /> Dashboard
                        </Link>
                      </DropdownMenuItem>
                      {user?.email === "admin@notesbazi.com" && (
                        <DropdownMenuItem asChild className="rounded-2xl cursor-pointer p-4 flex gap-3 font-bold focus:bg-indigo-50 dark:focus:bg-indigo-900/20 focus:text-indigo-600 dark:focus:text-indigo-400 transition-colors">
                          <Link href="/admin" className="flex items-center gap-3 w-full">
                            <ShieldCheck className="h-4 w-4" /> Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 mx-1 my-2" />
                      <DropdownMenuItem onClick={handleSignOut} className="rounded-2xl cursor-pointer p-4 text-red-500 font-bold focus:bg-red-50 dark:focus:bg-red-900/10 focus:text-red-600 transition-colors">
                        <div className="flex items-center gap-3 w-full">
                          <LogOut className="h-4 w-4" /> Log out
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login" className={buttonVariants({ variant: "ghost", className: "rounded-full px-6 font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600" })}>
                    Log in
                  </Link>
                  <Link href="/signup" className={buttonVariants({ className: "rounded-full px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all" })}>
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-4 duration-300">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link 
              href="/notes" 
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-4 rounded-2xl text-base font-black text-slate-900 dark:text-white hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
            >
              Explore Notes
            </Link>
            <Link 
              href="/about" 
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-4 rounded-2xl text-base font-black text-slate-900 dark:text-white hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
            >
              About Us
            </Link>
            <Link 
              href="/contact" 
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-4 rounded-2xl text-base font-black text-slate-900 dark:text-white hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
            >
              Contact Support
            </Link>
            
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
              {user ? (
                <>
                  <Link 
                    href="/dashboard" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-4 rounded-2xl text-base font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 transition-colors"
                  >
                    <LayoutDashboard size={20} /> My Dashboard
                  </Link>
                  <Button 
                    onClick={handleSignOut}
                    variant="ghost" 
                    className="flex items-center justify-start gap-3 px-4 py-4 rounded-2xl text-base font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  >
                    <LogOut size={20} /> Sign Out
                  </Button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    href="/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className={buttonVariants({ variant: "outline", className: "rounded-2xl py-6 font-bold" })}
                  >
                    Log in
                  </Link>
                  <Link 
                    href="/signup" 
                    onClick={() => setIsMenuOpen(false)}
                    className={buttonVariants({ className: "rounded-2xl py-6 bg-indigo-600 text-white font-bold" })}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
