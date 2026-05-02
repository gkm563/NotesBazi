"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  FileText, 
  User, 
  Settings, 
  LayoutDashboard, 
  Trophy, 
  Upload,
  Command,
  ArrowRight,
  TrendingUp,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  // Smart keyword dictionary for instant suggestions
  const keywordDictionary = [
    "Python", "PyCharm", "PyGame", "Physics", "Physical Chemistry",
    "C Programming", "C++", "Java", "JavaScript", "React",
    "Data Structures", "DBMS", "Database Management", "Data Science",
    "Mathematics", "Machine Learning", "Mechanics",
    "Operating Systems", "Object Oriented Programming",
    "Networking", "Network Security", "Numerical Methods",
    "Artificial Intelligence", "Algorithms", "Automata Theory",
    "Software Engineering", "System Design", "Statistics",
    "Electronics", "Embedded Systems", "Engineering Drawing",
    "Computer Architecture", "Computer Networks", "Chemistry",
    "Biology", "Business Communication", "Big Data",
    "Web Development", "Web Design", "Wireless Communication",
    "Linear Algebra", "Logic Design", "Linux",
    "Thermodynamics", "Theory of Computation",
    "Fluid Mechanics", "Functional Programming",
    "Information Security", "Image Processing",
    "Signals & Systems", "SQL",
  ];

  const getKeywordSuggestions = (q: string) => {
    if (!q || q.length < 2) return [];
    return keywordDictionary.filter(k =>
      k.toLowerCase().startsWith(q.toLowerCase()) ||
      k.toLowerCase().includes(q.toLowerCase())
    ).slice(0, 4);
  };

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery) {
      setResults([]);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("notes")
      .select("id, title, subject, type")
      .or(`title.ilike.%${searchQuery}%,subject.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      .limit(6);
    
    setResults(data || []);
    setLoading(false);
    setSelectedIndex(0);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("keydown", down);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  const navigate = (path: string) => {
    router.push(path);
    setOpen(false);
    setQuery("");
  };

  const quickLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Upload Notes", path: "/upload", icon: Upload },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-transparent hover:border-slate-300 dark:hover:border-slate-600"
      >
        <Search size={16} />
        <span className="text-sm">Search...</span>
        <kbd className="text-[10px] bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 flex items-center gap-1 font-sans">
          <Command size={10} /> K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[500] flex items-start justify-center pt-[10vh] px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center px-8 h-20 border-b border-slate-100 dark:border-slate-800">
                <Search className="text-indigo-600 mr-4" size={24} />
                <input 
                  autoFocus
                  placeholder="What are you looking for?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-grow bg-transparent border-none outline-none text-xl font-bold text-slate-900 dark:text-white placeholder:text-slate-400"
                />
                <button onClick={() => setOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {query ? (
                  <div className="space-y-4 p-4">
                    {/* Smart keyword suggestions */}
                    {getKeywordSuggestions(query).length > 0 && (
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-3 ml-2">Suggestions</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {getKeywordSuggestions(query).map(keyword => (
                            <button
                              key={keyword}
                              onClick={() => { navigate(`/notes?q=${encodeURIComponent(keyword)}`); }}
                              className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-all border border-indigo-100 dark:border-indigo-800/50 flex items-center gap-2"
                            >
                              <Search size={12} />{keyword}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* DB Results */}
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-3 ml-2">Notes Found</p>
                      <div className="space-y-2">
                        {loading ? (
                          <div className="p-8 text-center"><Loader className="animate-spin mx-auto text-indigo-500" /></div>
                        ) : results.length > 0 ? results.map((item, i) => (
                          <button
                            key={item.id}
                            onClick={() => navigate(`/notes/${item.id}`)}
                            className="w-full text-left p-4 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group flex items-center justify-between transition-all"
                          >
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-700 group-hover:border-indigo-200 transition-colors">
                                <FileText className="text-slate-400 group-hover:text-indigo-500" size={24} />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.subject} • {item.type}</p>
                              </div>
                            </div>
                            <ArrowRight size={18} className="text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                          </button>
                        )) : (
                          <div className="p-12 text-center">
                            <TrendingUp size={40} className="mx-auto text-slate-200 mb-4" />
                            <p className="text-slate-400 font-bold">No notes found for "{query}"</p>
                            <button
                              onClick={() => navigate(`/notes?q=${encodeURIComponent(query)}`)}
                              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors"
                            >
                              Search All Notes →
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 ml-2">Popular Subjects</p>
                    <div className="flex flex-wrap gap-2">
                      {["Mathematics", "Physics", "Python", "DBMS", "Operating Systems", "Networking", "Machine Learning", "AI", "C Programming", "Data Structures"].map(subject => (
                        <button
                          key={subject}
                          onClick={() => navigate(`/notes?q=${subject}`)}
                          className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100 dark:border-slate-700"
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center px-8">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                    <kbd className="bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 shadow-sm">Enter</kbd> to select
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                    <kbd className="bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 shadow-sm">↑↓</kbd> to navigate
                  </div>
                </div>
                <div className="text-[10px] font-black text-indigo-600 tracking-widest uppercase">
                  NotesBazi Search
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function Loader({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg 
      className={cn("animate-spin", className)} 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
