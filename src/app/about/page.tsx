import { BookOpen, Users, Shield, Rocket, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
      {/* Header */}
      <section className="py-20 bg-indigo-50 dark:bg-indigo-900/10 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            The Story Behind <span className="text-indigo-600">NotesBazi</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing academic resource sharing at United Institute of Technology, Prayagraj.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Why I Built This</h2>
            <div className="space-y-6 text-lg text-slate-600 dark:text-slate-400">
              <p>
                In our college, notes were mostly shared via WhatsApp groups. While convenient for quick messages, this made academic resources incredibly hard to find and manage over time.
              </p>
              <p className="p-6 bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-600 italic rounded-r-2xl">
                "Finding a PDF from three months ago in a chat with 500 members was a nightmare. This platform solves that problem by centralizing everything in one searchable, organized space."
              </p>
              <p>
                NotesBazi isn't just a website; it's a movement to preserve the collective knowledge of our institution. From seniors sharing their well-crafted notes to juniors finding PYQs for their first sessional, we bridge the gap.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: BookOpen, title: "Centralized", color: "bg-blue-500", text: "No more scrolling through WhatsApp." },
              { icon: Shield, title: "Quality", color: "bg-emerald-500", text: "Verified resources by your peers." },
              { icon: Users, title: "Community", color: "bg-purple-500", text: "Built for UIT by UITians." },
              { icon: Rocket, title: "AI-Powered", color: "bg-amber-500", text: "Auto-summaries and keywords." },
            ].map((item, idx) => (
              <div key={idx} className="p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all">
                <div className={`h-12 w-12 ${item.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg text-white`}>
                  <item.icon size={24} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Developer */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Heart className="h-12 w-12 text-red-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Built with Passion</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            NotesBazi was designed and developed with the goal of making academic life a little easier for every student at UIT Prayagraj. 
            We hope this platform helps you excel in your studies!
          </p>
          <div className="flex justify-center gap-4">
            <div className="h-1 bg-indigo-600 w-24 rounded-full" />
            <div className="h-1 bg-violet-600 w-24 rounded-full" />
            <div className="h-1 bg-pink-600 w-24 rounded-full" />
          </div>
        </div>
      </section>
    </main>
  );
}
