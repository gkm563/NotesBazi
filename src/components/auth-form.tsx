"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, Eye, EyeOff, ArrowRight, BookOpen, Mail, Lock, User, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface AuthFormProps {
  mode: "login" | "signup" | "forgot";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });
        if (error) throw error;
        setForgotSent(true);
        toast.success("Password reset link sent! Check your email.");
        setLoading(false);
        return;
      }

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        toast.success("Account created! Please check your email to verify.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
          toast.success("Welcome back!");
          router.push(profile?.role === "admin" ? "/admin" : "/dashboard");
          router.refresh();
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { access_type: "offline", prompt: "consent" },
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Google login failed");
      setGoogleLoading(false);
    }
  };

  const title = mode === "login" ? "Welcome back" : mode === "signup" ? "Join NotesBazi" : "Reset Password";
  const subtitle =
    mode === "login"
      ? "Sign in to access your notes and dashboard"
      : mode === "signup"
      ? "Create your free account and start sharing notes"
      : "Enter your email and we'll send you a reset link";

  if (forgotSent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 py-8"
      >
        <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
          <Mail size={40} className="text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Check your inbox</h2>
          <p className="text-slate-500 dark:text-slate-400">
            We've sent a password reset link to <span className="font-bold text-slate-700 dark:text-slate-200">{email}</span>
          </p>
        </div>
        <Button
          onClick={() => router.push("/login")}
          className="rounded-2xl px-8 py-6 bg-indigo-600 hover:bg-indigo-700 font-black"
        >
          Back to Login
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full space-y-8"
    >
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">{subtitle}</p>
      </div>

      {/* Google Button (not on forgot) */}
      {mode !== "forgot" && (
        <>
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full h-14 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all font-bold text-slate-700 dark:text-slate-200 flex items-center gap-3"
          >
            {googleLoading ? (
              <Loader className="animate-spin h-5 w-5" />
            ) : (
              <>
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-slate-950 px-4 text-slate-400 font-bold uppercase tracking-widest">Or</span>
            </div>
          </div>
        </>
      )}

      {/* Form */}
      <form onSubmit={handleAuth} className="space-y-5">
        {mode === "signup" && (
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Full Name</Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input
                type="text"
                placeholder="Gautam Kumar"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-14 pl-12 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-semibold focus:border-indigo-500 focus-visible:ring-0 transition-all"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 pl-12 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-semibold focus:border-indigo-500 focus-visible:ring-0 transition-all"
            />
          </div>
        </div>

        {mode !== "forgot" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Password</Label>
              {mode === "login" && (
                <Link href="/forgot-password" className="text-xs font-bold text-indigo-600 hover:underline">
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 pl-12 pr-14 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-semibold focus:border-indigo-500 focus-visible:ring-0 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        )}

        {mode === "signup" && (
          <div className="flex items-start gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
            <ShieldCheck size={18} className="text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300 leading-relaxed">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="font-bold underline">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="font-bold underline">Privacy Policy</Link>.
            </p>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
        >
          {loading ? (
            <Loader className="animate-spin h-5 w-5" />
          ) : (
            <>
              {mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
              <ArrowRight size={18} />
            </>
          )}
        </Button>
      </form>

      {/* Footer link */}
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        {mode === "login" ? (
          <>
            Don't have an account?{" "}
            <Link href="/signup" className="text-indigo-600 font-bold hover:underline">Create one free</Link>
          </>
        ) : mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-bold hover:underline">Sign in</Link>
          </>
        ) : (
          <>
            Remember your password?{" "}
            <Link href="/login" className="text-indigo-600 font-bold hover:underline">Sign in</Link>
          </>
        )}
      </p>
    </motion.div>
  );
}
