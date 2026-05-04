"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { GraduationCap, ChevronRight, ArrowLeft, BookOpen, Book, GraduationCap as Cap, Award, Sparkles, ShieldCheck, Presentation, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const INSTITUTES = [
  { id: "UIT", label: "United Institute of Technology", short: "UIT", icon: GraduationCap },
  { id: "UCER", label: "United College of Engg & Research", short: "UCER", icon: ShieldCheck },
  { id: "UIP", label: "United Institute of Pharmacy", short: "UIP", icon: Heart },
  { id: "UIM", label: "United Institute of Management", short: "UIM", icon: Presentation },
];

const YEARS = [
  { id: "1st", label: "1st Year", icon: BookOpen, semesters: [1, 2], description: "Foundational concepts & Basic Engineering" },
  { id: "2nd", label: "2nd Year", icon: Book, semesters: [3, 4], description: "Core Departmental subjects & Labs" },
  { id: "3rd", label: "3rd Year", icon: Cap, semesters: [5, 6], description: "Advanced specialization & Electives" },
  { id: "4th", label: "4th Year", icon: Award, semesters: [7, 8], description: "Projects, Internship & Final subjects" },
];

export function ResourceNavigator() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0: Institute, 1: Year, 2: Semester
  const [selectedInstitute, setSelectedInstitute] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  
  // Cursor glow logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const handleInstituteSelect = (instId: string) => {
    setSelectedInstitute(instId);
    setStep(1);
  };

  const handleYearSelect = (yearId: string) => {
    setSelectedYear(yearId);
    setStep(2);
  };

  const handleSemesterSelect = (semester: number) => {
    router.push(`/notes?year=${selectedYear}&semester=${semester}`);
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    else if (step === 1) setStep(0);
  };

  const currentYearData = YEARS.find(y => y.id === selectedYear);

  return (
    <div 
      className="w-full max-w-6xl mx-auto px-4 py-24 relative group/navigator"
      onMouseMove={handleMouseMove}
    >
      {/* Background Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[4rem] opacity-0 group-hover/navigator:opacity-100 transition duration-500"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(79, 70, 229, 0.08),
              transparent 80%
            )
          `,
        }}
      />

      <div className="flex flex-col items-center text-center mb-16 relative z-10">
         <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] mb-6 border border-indigo-500/10 backdrop-blur-md"
         >
            <Sparkles size={14} className="animate-pulse" /> UGI Smart Navigation
         </motion.div>
         <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">
           {step === 0 ? "Select Your Institute" : step === 1 ? "Select Academic Year" : "Choose Your Semester"}
         </h2>
         <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl opacity-70">
           {step === 0 
             ? "Choose your college within the United Group of Institutions." 
             : step === 1 
               ? `Tailoring resources for ${selectedInstitute} students.` 
               : `Explore premium resources for ${selectedYear} Year.`}
         </p>
      </div>

      <div className="relative min-h-[500px] md:min-h-[450px] z-10">
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div 
              key="step0"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
            >
              {INSTITUTES.map((inst) => (
                <button
                  key={inst.id}
                  onClick={() => handleInstituteSelect(inst.id)}
                  className="group relative p-12 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[3rem] border border-slate-200/50 dark:border-slate-800/50 hover:border-indigo-500 shadow-2xl transition-all duration-500 overflow-hidden flex flex-col items-center"
                >
                  <div className="h-20 w-20 bg-indigo-600/10 dark:bg-indigo-400/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-500">
                    <inst.icon className="h-10 w-10 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">{inst.short}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-bold text-center opacity-70">{inst.label}</p>
                </button>
              ))}
            </motion.div>
          ) : step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {YEARS.map((year) => (
                <button
                  key={year.id}
                  onClick={() => handleYearSelect(year.id)}
                  className="group relative text-left p-8 md:p-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[3rem] border border-slate-200/50 dark:border-slate-800/50 shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
                    <year.icon size={140} />
                  </div>
                  
                  <div className="h-16 w-16 bg-indigo-600/10 dark:bg-indigo-400/10 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-500">
                    <year.icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors duration-500" />
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-3 tracking-tight">
                    {year.label}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-bold leading-relaxed mb-8 opacity-70">
                    {year.description}
                  </p>
                  
                  <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-[0.2em] mt-auto">
                    Select Sem <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
                  </div>
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center w-full"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {currentYearData?.semesters.map((sem) => (
                  <button
                    key={sem}
                    onClick={() => handleSemesterSelect(sem)}
                    className="group relative p-12 bg-white/50 dark:bg-slate-900/50 backdrop-blur-2xl rounded-[4rem] border border-slate-200/50 dark:border-slate-800/50 hover:border-indigo-500/50 shadow-2xl transition-all duration-500 overflow-hidden flex flex-col items-center"
                  >
                    <div className="h-24 w-24 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center mb-8 text-4xl font-black shadow-2xl shadow-indigo-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      {sem}
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3 text-center tracking-tighter">
                      Semester {sem}
                    </h3>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] text-center mb-10">
                      {sem % 2 === 0 ? "Even" : "Odd"} Semester
                    </p>
                    
                    <div className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-indigo-500/20 group-hover:scale-105 active:scale-95 transition-all duration-300">
                      Explore Resources
                    </div>
                  </button>
                ))}
              </div>
              
              <button 
                onClick={handleBack}
                className="mt-16 flex items-center gap-3 text-slate-400 hover:text-indigo-600 font-black text-sm uppercase tracking-[0.2em] transition-all group"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" /> Back to Years
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
