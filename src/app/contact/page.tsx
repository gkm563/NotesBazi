import { Mail, MessageSquare, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] transition-colors py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <Badge className="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border-none px-6 py-2 rounded-full font-black text-xs uppercase tracking-[0.2em] mb-4">
             Get in Touch
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            How can we <span className="text-indigo-600">help?</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Have questions about NotesBazi? Want to report a bug or suggest a feature? 
            The team is here to support the <span className="text-slate-900 dark:text-white font-bold">UIT Prayagraj</span> community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <Mail size={120} />
               </div>
               <h3 className="text-2xl font-black mb-6 relative z-10">Direct Support</h3>
               <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center">
                        <Mail size={22} />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Email Address</p>
                        <p className="text-lg font-black">support@notesbazi.com</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center">
                        <MapPin size={22} />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Campus</p>
                        <p className="text-lg font-black">UIT Prayagraj, UP</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
               <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Talk to the Founder</h3>
               <Link 
                href="https://www.linkedin.com/in/gkm563" 
                target="_blank"
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all group"
               >
                  <div className="h-14 w-14 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-black">GKM</div>
                  <div className="flex-grow">
                    <p className="font-black text-slate-900 dark:text-white group-hover:text-indigo-600">Gautam Kumar Maurya</p>
                    <p className="text-xs font-bold text-slate-400">Linkedln: @gkm563</p>
                  </div>
                  <Linkedin className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
               </Link>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-slate-800">
               <form className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="first-name" className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">First Name</Label>
                      <Input id="first-name" placeholder="Gautam" className="h-14 rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white transition-all px-6" />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="last-name" className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</Label>
                      <Input id="last-name" placeholder="Kumar" className="h-14 rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white transition-all px-6" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
                    <Input id="email" type="email" placeholder="gautam@uit.com" className="h-14 rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white transition-all px-6" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="message" className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Message</Label>
                    <Textarea id="message" placeholder="How can we help you today?" className="rounded-[1.5rem] min-h-[160px] border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white transition-all p-6 text-lg" />
                  </div>
                  <Button className="w-full py-8 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-black shadow-xl shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-95">
                    Send Message <Send size={22} className="ml-3" />
                  </Button>
               </form>
            </div>
          </div>
        </div>
      </div>
    </main>
    </main>
  );
}
