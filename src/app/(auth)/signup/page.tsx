import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 dark:opacity-5 pointer-events-none" />
      <div className="w-full max-w-md relative z-10">
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}
