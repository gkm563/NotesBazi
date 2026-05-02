"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error_description") || searchParams.get("error") || "An unexpected authentication error occurred.";

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] flex items-center justify-center p-4">
      <AnimatedSection direction="up" className="max-w-md w-full">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 text-center">
          <div className="h-20 w-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-8 text-red-600">
            <ShieldAlert size={40} />
          </div>
          
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Authentication Error
          </h1>
          
          <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl mb-8 border border-red-100 dark:border-red-900/30">
            <p className="text-sm font-medium text-red-600 dark:text-red-400 break-words">
              {decodeURIComponent(error.replace(/\+/g, ' '))}
            </p>
          </div>
          
          <div className="space-y-4">
            <Button asChild className="w-full py-7 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-500/20">
              <Link href="/login">
                <RefreshCw size={20} className="mr-2" /> Try Again
              </Link>
            </Button>
            
            <Button variant="ghost" asChild className="w-full py-7 rounded-2xl font-black text-slate-500">
              <Link href="/">
                <ArrowLeft size={20} className="mr-2" /> Back to Home
              </Link>
            </Button>
          </div>
          
          <p className="mt-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
            If this persists, please contact support
          </p>
        </div>
      </AnimatedSection>
    </main>
  );
}
