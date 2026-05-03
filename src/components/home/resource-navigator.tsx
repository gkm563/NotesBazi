"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ChevronRight, ArrowLeft, BookOpen, Book, GraduationCap as Cap, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const YEARS = [
  { id: "1st", label: "1st Year", icon: BookOpen, semesters: [1, 2], description: "Foundational concepts & Basic Engineering" },
  { id: "2nd", label: "2nd Year", icon: Book, semesters: [3, 4], description: "Core Departmental subjects & Labs" },
  { id: "3rd", label: "3rd Year", icon: Cap, semesters: [5, 6], description: "Advanced specialization & Electives" },
  { id: "4th", label: "4th Year", icon: Award, semesters: [7, 8], description: "Projects, Internship & Final subjects" },
];

export function ResourceNavigator() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const handleYearSelect = (yearId: string) => {
    setSelectedYear(yearId);
    setStep(2);
  };

  const handleSemesterSelect = (semester: number) => {
    router.push(`/notes?year=${selectedYear}&semester=${semester}`);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedYear(null);
  };

  const currentYearData = YEARS.find(y => y.id === selectedYear);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 relative">
      <div className="flex flex-col items-center text-center mb-12">
         <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-[0.2em] mb-4 border border-indigo-100 dark:border-indigo-800/50">
            <Sparkles size={14} /> Smart Navigation
         </div>
         <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
           {step === 1 ? "Select Your Academic Year" : "Choose Your Semester"}
         </h2>
         <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
           {step === 1 
             ? "Quickly jump to resources tailored for your current progress." 
             : `Explore resources for ${selectedYear} Year subjects.`}
         </p>
      </div>

      <div className="relative min-h-[500px] md:min-h-[400px]">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {YEARS.map((year) => (
                <button
                  key={year.id}
                  onClick={() => handleYearSelect(year.id)}
                  className="group relative text-left p-6 md:p-8 bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 md:p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <year.icon size={80} className="md:size-[120px]" />
                  </div>
                  
                  <div className="h-12 w-12 md:h-16 md:w-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 group-hover:bg-indigo-600 transition-all">
                    <year.icon className="h-6 w-6 md:h-8 md:w-8 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                    {year.label}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-bold leading-relaxed mb-4 md:mb-6 line-clamp-2">
                    {year.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-xs md:text-sm uppercase tracking-widest">
                    Select Sem <ChevronRight size={14} className="md:size-[16px] group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center w-full"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full max-w-4xl">
                {currentYearData?.semesters.map((sem) => (
                  <button
                    key={sem}
                    onClick={() => handleSemesterSelect(sem)}
                    className="group relative p-6 md:p-10 bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[3rem] border-2 border-slate-100 dark:border-slate-800 hover:border-indigo-600 shadow-2xl transition-all overflow-hidden flex flex-col items-center"
                  >
                    <div className="h-16 w-16 md:h-24 md:w-24 bg-indigo-600 text-white rounded-2xl md:rounded-3xl flex items-center justify-center mb-4 md:mb-6 text-2xl md:text-4xl font-black shadow-xl shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                      {sem}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2 text-center">
                      Semester {sem}
                    </h3>
                    <p className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-widest text-center">
                      {sem % 2 === 0 ? "Even" : "Odd"} Semester Resources
                    </p>
                    
                    <div className="mt-6 md:mt-8 px-6 md:px-8 py-3 md:py-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl md:rounded-2xl font-black text-xs md:text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      View All Notes
                    </div>
                  </button>
                ))}
              </div>
              
              <button 
                onClick={handleBack}
                className="mt-8 md:mt-12 flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black text-sm md:text-base transition-colors"
              >
                <ArrowLeft size={18} /> Back to Year Selection
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
