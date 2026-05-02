import Link from "next/link";
import { BookOpen, Mail, FileText, Upload, TrendingUp, HelpCircle, Link as LinkIcon, Code, Send } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { name: "1st Year", href: "/notes?year=1" },
      { name: "2nd Year", href: "/notes?year=2" },
      { name: "3rd Year", href: "/notes?year=3" },
      { name: "4th Year", href: "/notes?year=4" },
      { name: "B.Tech Notes", href: "/notes?q=B.Tech" },
      { name: "BCS / BCA", href: "/notes?q=BCS" },
    ],
    platform: [
      { name: "Explore All", href: "/notes", icon: FileText },
      { name: "Upload Data", href: "/upload", icon: Upload },
      { name: "Trending", href: "/notes?sort=downloads", icon: TrendingUp },
      { name: "Leaderboard", href: "/leaderboard" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "FAQ", href: "/faq", icon: HelpCircle },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms & Conditions", href: "/terms" },
    ]
  };

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 pt-16 pb-24 md:pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand & Credit */}
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">NotesBazi</span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-sm font-medium">
              The ultimate academic resource hub for students of <span className="text-indigo-600 dark:text-indigo-400 font-bold">United Institute of Technology (UIT)</span>. Created for students to share and grow together.
            </p>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-900">
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Created By</p>
               <Link 
                href="https://www.linkedin.com/in/gkm563" 
                target="_blank"
                className="inline-flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all group"
               >
                  <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-xs">GKM</div>
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">Gautam Kumar Maurya</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">@gkm563 • UIT Prayagraj</p>
                  </div>
                  <LinkIcon className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 ml-2" />
               </Link>
            </div>
          </div>

          {/* Explore Links */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Explore Notes</h3>
            <ul className="space-y-4">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform & Company */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Platform</h3>
            <ul className="space-y-4">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors flex items-center gap-2">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-4">
               <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-4">Company</h3>
               <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Legal & Social */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Legal</h3>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-4">
               <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-4">Connect</h3>
               <div className="flex gap-4">
                <Link href="mailto:contact@notesbazi.com" className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"><Mail size={18} /></Link>
                <Link href="#" className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"><Send size={18} /></Link>
                <Link href="#" className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"><Code size={18} /></Link>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            © {currentYear} NotesBazi • Dedicated to UIT Academic Excellence
          </p>
          <div className="flex items-center gap-2 text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            <div className="h-1 w-1 bg-indigo-600 rounded-full animate-pulse" />
            Designed & Built for Students
          </div>
        </div>
      </div>
    </footer>
  );
}
