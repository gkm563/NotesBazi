import { AuthForm } from "@/components/auth-form";
import { BookOpen, Star, Users, TrendingUp, GraduationCap } from "lucide-react";
import Link from "next/link";

const stats = [
  { icon: BookOpen, label: "Notes Shared", value: "2,400+" },
  { icon: Users, label: "Active Students", value: "1,200+" },
  { icon: Star, label: "Avg. Rating", value: "4.8 / 5" },
  { icon: TrendingUp, label: "Downloads", value: "18,000+" },
];

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 p-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-500/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="h-12 w-12 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20">
              <GraduationCap size={26} className="text-white" />
            </div>
            <span className="text-white font-black text-2xl tracking-tight">NotesBazi</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white leading-tight">
              Your Academic<br />Success Starts Here
            </h2>
            <p className="text-indigo-200 text-lg font-medium leading-relaxed max-w-sm">
              Access thousands of curated notes, assignments, and previous year papers shared by fellow students.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4">
                <stat.icon size={20} className="text-indigo-200 mb-2" />
                <p className="text-white font-black text-xl">{stat.value}</p>
                <p className="text-indigo-300 text-xs font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-indigo-300 text-sm font-medium">
          © {new Date().getFullYear()} NotesBazi · UIT Prayagraj Community
        </p>
      </div>

      {/* Right Panel — Form */}
      <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-6 pt-8 pb-4">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="font-black text-xl text-slate-900 dark:text-white">NotesBazi</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
          <div className="w-full max-w-md">
            <AuthForm mode="login" />
          </div>
        </div>
      </div>
    </div>
  );
}
