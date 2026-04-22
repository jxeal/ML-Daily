import { Link } from "wouter";
import { ArrowRight, CheckCircle2, PlayCircle, Lock } from "lucide-react";
import { type Lesson } from "@/types/database";
import { useStatsStore } from "@/store/use-stats";
import { useAuth } from "@/components/auth/auth-provider";
import { useUserStats } from "@/hooks/use-supabase";
import { memo } from "react";
import { isLessonUnlocked } from "@/lib/lesson-utils";
import { toast } from "@/hooks/use-toast";

export const LessonCard = memo(function LessonCard({
  lesson,
  index = 0,
}: {
  lesson: Lesson;
  index?: number;
}) {
  const { user } = useAuth();
  const { data: supabaseStats } = useUserStats();
  const localCompletedLessons = useStatsStore(
    (state) => state.completedLessons
  );

  const completedLessons = user 
    ? supabaseStats?.completed_lessons || [] 
    : localCompletedLessons;

  const isCompleted = completedLessons.includes(lesson.id);
  
  const isUnlocked = isLessonUnlocked(
    lesson.lesson_number,
    lesson.category,
    completedLessons,
    !!user
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Intermediate":
        return "bg-warning/10 text-warning border-warning/20";
      case "Advanced":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  const handleLockedClick = (e: React.MouseEvent) => {
    if (!isUnlocked) {
      e.preventDefault();
      toast({
        title: "Lesson Locked",
        description: !user 
          ? "Sign in to unlock more lessons!" 
          : "Complete the previous lesson to unlock this one.",
        variant: "destructive"
      });
    }
  };

  return (
    <Link 
      href={isUnlocked ? `/lessons/${lesson.id}` : "#"} 
      onClick={handleLockedClick}
      className={`block group ${!isUnlocked ? "cursor-not-allowed" : ""}`}
    >
      <div className={`bg-card rounded-3xl p-5 border relative overflow-hidden transition-all duration-300 ${
        isUnlocked 
          ? "border-white/5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1" 
          : "border-white/10 opacity-75 grayscale-[0.5]"
      }`}>
        {/* subtle background glow */}
        {isUnlocked && (
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
        )}

        <div className="flex justify-between items-start mb-4 relative z-10">
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getDifficultyColor(lesson.difficulty)}`}
          >
            {lesson.difficulty}
          </div>

          {!isUnlocked ? (
            <div className="flex items-center gap-1 text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-full text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              Locked
            </div>
          ) : isCompleted ? (
            <div className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Done
            </div>
          ) : (
            <div className="text-muted-foreground bg-secondary px-2.5 py-1 rounded-full text-xs font-semibold">
              {lesson.lesson_number === 0 ? "Introduction" : `Lesson ${lesson.lesson_number}`}
            </div>
          )}
        </div>

        <div className="relative z-10">
          <h3 className={`text-xl font-display font-bold mb-2 transition-colors line-clamp-2 ${isUnlocked ? "group-hover:text-primary" : "text-muted-foreground"}`}>
            {lesson.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-6">
            {lesson.short_description}
          </p>
        </div>

        <div className="flex items-center justify-between relative z-10">
          <div className={`flex items-center gap-2 text-sm font-bold py-2 px-4 rounded-xl ml-auto transition-colors ${
            isUnlocked 
              ? "text-foreground group-hover:text-primary bg-secondary/50 group-hover:bg-primary/10" 
              : "text-muted-foreground bg-secondary/30"
          }`}>
            {!isUnlocked ? (
              <>
                Locked
                <Lock className="w-4 h-4" />
              </>
            ) : isCompleted ? (
              <>
                Review Lesson
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Learn Now
                <PlayCircle className="w-4 h-4" />
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
});
