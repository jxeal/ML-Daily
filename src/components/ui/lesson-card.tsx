import { Link } from "wouter";
import { ArrowRight, CheckCircle2, PlayCircle } from "lucide-react";
import { type Lesson } from "@/types/database";
import { useStatsStore } from "@/store/use-stats";
import { motion } from "framer-motion";

export function LessonCard({ lesson, index = 0 }: { lesson: Lesson, index?: number }) {
  const completedLessons = useStatsStore(state => state.completedLessons);
  const isCompleted = completedLessons.includes(lesson.id);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Intermediate': return 'bg-warning/10 text-warning border-warning/20';
      case 'Advanced': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
    >
      <Link href={`/lessons/${lesson.id}`} className="block group">
        <div className="bg-card rounded-3xl p-5 border border-white/5 relative overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
          
          {/* subtle background glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getDifficultyColor(lesson.difficulty)}`}>
              {lesson.difficulty}
            </div>
            
            {isCompleted ? (
              <div className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Done
              </div>
            ) : (
              <div className="text-muted-foreground bg-secondary px-2.5 py-1 rounded-full text-xs font-semibold">
                {lesson.category}
              </div>
            )}
          </div>

          <div className="relative z-10">
            <h3 className="text-xl font-display font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {lesson.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-6">
              {lesson.shortDescription}
            </p>
          </div>

          <div className="flex items-center justify-between relative z-10">
            <span className="text-2xl">{lesson.icon}</span>
            <div className="flex items-center gap-2 text-sm font-bold text-foreground group-hover:text-primary transition-colors bg-secondary/50 py-2 px-4 rounded-xl group-hover:bg-primary/10">
              {isCompleted ? 'Review Lesson' : 'Learn Now'}
              {isCompleted ? <ArrowRight className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
