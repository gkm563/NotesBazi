"use client";

import { useState } from "react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, ChevronDown, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is NotesBazi?",
      answer: "NotesBazi is a student-focused platform designed specifically for United Institute of Technology (UIT) students to share, find, and organize academic resources like notes, assignments, and previous year questions."
    },
    {
      question: "Is it free to use?",
      answer: "Yes! NotesBazi is completely free for all students. Our mission is to democratize academic resources and help everyone succeed together."
    },
    {
      question: "How can I upload my notes?",
      answer: "Simply sign in to your account, click on the 'Upload' button in the navigation bar, fill in the details about your resource (subject, year, type), and upload your file (PDF, DOCX, or PPTX)."
    },
    {
      question: "Are the notes verified?",
      answer: "Notes are uploaded by students. We encourage the community to rate and report resources. Highly-rated notes are featured on our 'Trending' and 'Explore' sections."
    },
    {
      question: "Can I delete my uploaded notes?",
      answer: "Yes, you can manage all your publications from your personal Dashboard. You have full control to edit or delete any resource you've uploaded."
    },
    {
      question: "How does the Leaderboard work?",
      answer: "The Leaderboard celebrates our top contributors. The more quality resources you share that help others, the higher you'll rank in our community excellence list."
    }
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] pb-24 pt-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4">
        <AnimatedSection direction="down" className="text-center mb-16">
          <Badge className="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border-none px-6 py-2 rounded-full font-black text-xs uppercase tracking-[0.2em] mb-4">
             Support Center
          </Badge>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
            Frequently Asked <span className="text-indigo-600">Questions</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about using NotesBazi. Dedicated to the students of UIT Prayagraj.
          </p>
        </AnimatedSection>

        <AnimatedSection direction="up" delay={0.2}>
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index}
                  className={cn(
                    "group rounded-[2rem] border transition-all duration-300 overflow-hidden",
                    isOpen 
                      ? "bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/50 shadow-xl shadow-indigo-500/5" 
                      : "bg-slate-50 dark:bg-slate-800/50 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  )}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                  >
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                        isOpen ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-800 text-indigo-600 shadow-sm"
                      )}>
                        <HelpCircle size={20} />
                      </div>
                      <span className={cn(
                        "text-lg md:text-xl font-black tracking-tight transition-colors",
                        isOpen ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"
                      )}>
                        {faq.question}
                      </span>
                    </div>
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center transition-all",
                      isOpen ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rotate-180" : "bg-white dark:bg-slate-800 text-slate-400"
                    )}>
                      <ChevronDown size={18} />
                    </div>
                  </button>
                  
                  <div className={cn(
                    "transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  )}>
                    <div className="px-6 md:px-8 pb-8 md:pb-10 ml-15 text-slate-500 dark:text-slate-400 text-base md:text-lg font-medium leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </AnimatedSection>

        <AnimatedSection direction="up" delay={0.4} className="mt-20">
           <div className="p-10 md:p-14 bg-indigo-600 rounded-[3rem] text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-110 duration-700">
                <HelpCircle size={180} />
              </div>
              <div className="relative z-10 max-w-xl">
                <h3 className="text-3xl font-black mb-4">Still have questions?</h3>
                <p className="text-indigo-100 text-lg font-medium mb-10 leading-relaxed">
                  We're here to help you with anything you need regarding the platform or your studies.
                </p>
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-10 py-5 bg-white text-indigo-600 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all text-lg"
                >
                  Reach Out to Us
                </a>
              </div>
           </div>
        </AnimatedSection>
      </div>
    </main>
  );
}
