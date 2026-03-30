import { AppLayout } from "@/components/layout/app-layout";
import { useStatsStore } from "@/store/use-stats";
import { useGetLessons } from "@/hooks/use-supabase";
import { CheckCircle2, Shield, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function Progress() {
  const { data: lessons, isLoading } = useGetLessons();
  const completedIds = useStatsStore(state => state.completedLessons);
  
  const total = lessons?.length || 1; // avoid /0
  const completedCount = completedIds.length;
  const percent = Math.round((completedCount / total) * 100) || 0;

  return (
    <AppLayout>
      <div className="px-4 md:px-6 py-4 space-y-8 animate-in fade-in pb-8">
        
        <header className="mb-6">
          <h1 className="text-3xl font-display font-bold mb-2">Learning Journey</h1>
          <p className="text-muted-foreground">Track your progress and mastery.</p>
        </header>

        {/* Big Progress Card */}
        <section className="bg-card border border-white/5 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            {/* Circular Progress */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  className="text-secondary stroke-current" 
                  strokeWidth="8" 
                  cx="50" cy="50" r="40" 
                  fill="transparent" 
                />
                <motion.circle 
                  className="text-primary stroke-current" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                  cx="50" cy="50" r="40" 
                  fill="transparent"
                  initial={{ strokeDasharray: "0 251.2" }}
                  animate={{ strokeDasharray: `${(percent / 100) * 251.2} 251.2` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-display">{percent}%</span>
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <h3 className="text-2xl font-bold mb-2">Course Completion</h3>
              <p className="text-muted-foreground mb-4">
                You've completed <span className="text-foreground font-bold">{completedCount}</span> out of {total} lessons.
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> {completedCount} Done
                </div>
                <div className="bg-secondary text-muted-foreground px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5">
                  <Target className="w-4 h-4" /> {total - completedCount} Remaining
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Milestone Path / Timeline */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-accent" />
            <h2 className="text-2xl font-display font-bold">Recent Achievements</h2>
          </div>
          
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
            {isLoading ? (
               <div className="h-20 bg-card rounded-2xl animate-pulse" />
            ) : completedIds.length === 0 ? (
               <div className="bg-card p-6 rounded-2xl text-center border border-white/5">
                 <p className="text-muted-foreground">Complete a lesson to see it here.</p>
               </div>
            ) : (
              lessons?.filter(l => completedIds.includes(l.id)).map((lesson, idx) => (
                <div key={lesson.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Timeline Dot */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-emerald-500 text-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-card border border-white/5 shadow-sm">
                    <div className="text-xs font-bold text-emerald-400 mb-1">{lesson.category}</div>
                    <h4 className="font-bold text-lg">{lesson.title}</h4>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </AppLayout>
  );
}
