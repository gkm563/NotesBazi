"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useDebounce } from "@/hooks/use-debounce"; // Assuming this exists or I'll create it

export function AdminSearch({ placeholder = "Search...", defaultValue = "", baseUrl = "/admin/notes" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);
  const debouncedValue = useDebounce(value, 500);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedValue) {
      params.set("q", debouncedValue);
    } else {
      params.delete("q");
    }

    startTransition(() => {
      router.push(`${baseUrl}?${params.toString()}`, { scroll: false });
    });
  }, [debouncedValue, router, searchParams, baseUrl]);

  return (
    <div className="relative flex-grow md:w-80 group">
      <Search 
        className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
          isPending ? "text-indigo-500 animate-pulse" : "text-slate-400 group-focus-within:text-indigo-500"
        }`} 
        size={18} 
      />
      <input 
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder} 
        className="w-full pl-12 pr-10 h-14 rounded-2xl border-none bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/40 dark:shadow-none focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium px-4 transition-all"
      />
      {value && (
        <button 
          onClick={() => setValue("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
