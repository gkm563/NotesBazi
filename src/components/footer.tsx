import Link from "next/link";
import { BookOpen, Globe, Mail, Link as LinkIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">NotesBazi</span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Empowering students of United Institute of Technology with organized, high-quality academic resources.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="/notes" className="text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400">Explore Notes</Link></li>
              <li><Link href="/upload" className="text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400">Upload Data</Link></li>
              <li><Link href="/trending" className="text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400">Trending</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400">Contact</Link></li>
              <li><Link href="/faq" className="text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400">FAQ</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} NotesBazi. Built with ❤️ for UIT Prayagraj.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Mail size={20} /></Link>
            <Link href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Globe size={20} /></Link>
            <Link href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><LinkIcon size={20} /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
