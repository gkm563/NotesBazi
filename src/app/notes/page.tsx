import { NotesListing } from "@/components/notes-listing";
import { GraduationCap } from "lucide-react";
import { Suspense } from "react";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const query = typeof resolvedParams.q === "string" ? resolvedParams.q : "";

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] transition-colors pb-20">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-6 shadow-sm border border-indigo-100 dark:border-indigo-800/50">
            <GraduationCap size={18} />
            <span>Discover Top Resources</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
            Explore <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 animate-gradient-x">Academic Content</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
            Browse through thousands of high-quality, student-verified notes, assignments, and previous year papers. Elevate your learning experience.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="h-[400px] bg-white dark:bg-slate-800 rounded-3xl animate-pulse shadow-xl" />
            <div className="h-[400px] bg-white dark:bg-slate-800 rounded-3xl animate-pulse shadow-xl md:col-span-2" />
          </div>
        }>
          <NotesListing initialSearch={query} />
        </Suspense>
      </div>
    </main>
  );
}
