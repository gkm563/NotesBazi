"use client";

import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface AIInsightsProps {
  stats: {
    totalStudents: number;
    totalResources: number;
    openReports: number;
    totalDownloads: number;
  };
}

export function AIInsights({ stats }: AIInsightsProps) {
  const [insight, setInsight] = useState<string>("Analyzing system metrics...");
  const [suggestion, setSuggestion] = useState<string>("");

  useEffect(() => {
    // Simulate AI analysis logic
    // In a real app, this would call a Gemini Edge function
    setTimeout(() => {
      const insights = [
        "Student engagement is up 12% this week! PYQs are the most requested resource type right now.",
        "4th Year resources are currently under-represented. Encourage seniors to upload more project reports.",
        "System health is excellent. Database query times have dropped by 50ms since the last optimization."
      ];
      
      const suggestions = [
        "Suggestion: Verify the 15 pending assignments to clear the backlog before the weekend.",
        "Suggestion: Highlight the top contributor on the homepage to boost community motivation.",
        "Suggestion: Add a 'Most Downloaded' tag to the Top 5 resources to increase discovery."
      ];

      setInsight(insights[Math.floor(Math.random() * insights.length)]);
      setSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
    }, 1500);
  }, [stats]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10"
    >
      <Card className="border-none shadow-2xl shadow-indigo-500/10 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white rounded-[2.5rem] overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles size={120} />
        </div>
        
        <CardContent className="p-8 md:p-12 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="h-20 w-20 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center shrink-0 border border-white/10 shadow-xl">
              <Sparkles className="text-white animate-pulse" size={40} />
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">AI System Intelligence</span>
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight">
                {insight}
              </h2>
              <div className="flex items-center justify-center md:justify-start gap-3 text-indigo-100 font-bold bg-black/10 px-6 py-3 rounded-2xl border border-white/5 inline-flex">
                <TrendingUp size={20} className="text-emerald-400" />
                {suggestion}
              </div>
            </div>

            <div className="flex gap-4 md:flex-col shrink-0">
               <div className="p-4 bg-white/10 rounded-2xl border border-white/5 text-center min-w-[120px]">
                  <p className="text-[10px] font-black text-indigo-200 uppercase mb-1">Health Score</p>
                  <p className="text-2xl font-black">98%</p>
               </div>
               <div className="p-4 bg-white/10 rounded-2xl border border-white/5 text-center min-w-[120px]">
                  <p className="text-[10px] font-black text-indigo-200 uppercase mb-1">User Growth</p>
                  <p className="text-2xl font-black text-emerald-400">+5.2%</p>
               </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
