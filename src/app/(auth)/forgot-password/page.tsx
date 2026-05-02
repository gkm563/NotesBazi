import { AuthForm } from "@/components/auth-form";
import { GraduationCap, KeyRound } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Panel — Form */}
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
            <AuthForm mode="forgot" />
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-800 via-indigo-900 to-violet-900 p-16 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-white/5 rounded-full" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="h-12 w-12 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20">
              <GraduationCap size={26} className="text-white" />
            </div>
            <span className="text-white font-black text-2xl tracking-tight">NotesBazi</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="h-24 w-24 bg-white/10 border border-white/20 rounded-3xl flex items-center justify-center">
            <KeyRound size={48} className="text-indigo-300" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white leading-tight">
              Forgot your<br />password?
            </h2>
            <p className="text-indigo-200 text-lg font-medium leading-relaxed max-w-sm">
              No worries! Enter your email address and we'll send you a secure link to reset your password instantly.
            </p>
          </div>
          <div className="p-5 bg-white/10 border border-white/20 rounded-2xl">
            <p className="text-indigo-200 text-sm font-medium">
              💡 <strong className="text-white">Tip:</strong> Check your spam/junk folder if you don't see the email within a few minutes.
            </p>
          </div>
        </div>

        <p className="relative z-10 text-indigo-300 text-sm font-medium">
          © {new Date().getFullYear()} NotesBazi · UIT Prayagraj Community
        </p>
      </div>
    </div>
  );
}
