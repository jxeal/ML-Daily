import { Link } from "wouter";
import { ArrowRight, CheckCircle2, PlayCircle, Lock } from "lucide-react";
import { type Lesson } from "@/types/database";
import { useStatsStore } from "@/store/use-stats";
import { useAuth } from "@/components/auth/auth-provider";
import { useUserStats } from "@/hooks/use-supabase";
import { memo } from "react";
import { isLessonUnlocked, isLessonCompleted } from "@/lib/lesson-utils";
import { toast } from "@/hooks/use-toast";

export const LessonCard = memo(function LessonCard({
  lesson,
  index = 0,
  variant = "card",
  categoryId,
  categoryName
}: {
  lesson: Lesson;
  index?: number;
  variant?: "card" | "list";
  categoryId?: string;
  categoryName?: string;
}) {
  const { user } = useAuth();
  const { data: supabaseStats } = useUserStats();
  const localCompletedLessons = useStatsStore(
    (state) => state.completedLessons
  );

  const completedLessons = user 
    ? supabaseStats?.completed_lessons || [] 
    : localCompletedLessons;

  // Use the explicitly passed categoryName, or lesson.category if it's likely a name
  const isUuid = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  const isNumeric = (str: string) => /^\d+$/.test(str);
  
  // Prioritize categoryName (passed prop), then lesson.category_name (joined name), then lesson.category
  const displayCategory = categoryName || lesson.category_name ||
    (!isNumeric(lesson.category) && !isUuid(lesson.category) ? lesson.category : (categoryId && !isNumeric(categoryId) && !isUuid(categoryId) ? categoryId : "topic"));
    
  const categorySlug = displayCategory.toLowerCase().replace(/\s+/g, '-');
  const lessonNumSlug = lesson.lesson_number === 0 ? 'intro' : lesson.lesson_number;
  const lessonHref = `/lessons/${categorySlug}/${lessonNumSlug}`;

  // For logic, we prefer the actual ID (UUID or numeric ID) 
  const catIdForLogic = categoryId || lesson.category;

  const isCompleted = isLessonCompleted(
    lesson.id,
    lesson.lesson_number,
    catIdForLogic,
    completedLessons
  );
  
  const isUnlocked = isLessonUnlocked(
    lesson.lesson_number,
    catIdForLogic,
    completedLessons,
    !!user
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "text-emerald-400";
      case "Intermediate":
        return "text-warning";
      case "Advanced":
        return "text-destructive";
      default:
        return "text-primary";
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

  if (variant === "list") {
    return (
      <Link 
        href={isUnlocked ? lessonHref : "#"} 
        onClick={handleLockedClick}
        className={`block group ${!isUnlocked ? "cursor-not-allowed" : ""}`}
      >
        <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
          isUnlocked 
            ? "bg-card/50 border-white/5 hover:bg-card hover:border-primary/30" 
            : "bg-card/30 border-white/5 opacity-60"
        }`}>
          {/* Left: Number/Status */}
          <div className="flex-shrink-0 w-8 flex justify-center items-center">
            {isCompleted ? (
              <div className="w-6 h-6 rounded-full border-2 border-emerald-700 flex items-center justify-center text-[11px] font-bold text-emerald-700">
                {lesson.lesson_number}
              </div>
            ) : !isUnlocked ? (
              <Lock className="w-4 h-4 text-muted-foreground" />
            ) : (
              <span className="text-sm font-mono text-muted-foreground font-bold">
                {lesson.lesson_number === 0 ? "Intro." : `${lesson.lesson_number}.`}
              </span>
            )}
          </div>

          {/* Middle: Title */}
          <div className="flex-grow min-w-0">
            <h4 className={`text-base font-medium truncate ${isUnlocked ? "group-hover:text-primary" : "text-muted-foreground"}`}>
              {lesson.title}
            </h4>
          </div>

          {/* Right: Difficulty & Action */}
          <div className="flex-shrink-0 flex items-center gap-4">
            <span className={`hidden sm:block text-xs font-bold ${getDifficultyColor(lesson.difficulty)}`}>
              {lesson.difficulty}
            </span>
            
            <div className={`flex items-center gap-1 text-xs font-bold py-1.5 px-3 rounded-lg transition-colors ${
              !isUnlocked 
                ? "text-muted-foreground bg-secondary/50" 
                : isCompleted
                  ? "text-white bg-emerald-700 group-hover:bg-emerald-800"
                  : "text-primary-foreground bg-primary group-hover:bg-primary/90"
            }`}>
              {!isUnlocked ? (
                "Locked"
              ) : isCompleted ? (
                "Review"
              ) : (
                <>
                  Learn
                  <ArrowRight className="w-3 h-3" />
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      href={isUnlocked ? lessonHref : "#"} 
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
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
              lesson.difficulty === "Beginner" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
              lesson.difficulty === "Intermediate" ? "bg-warning/10 text-warning border-warning/20" :
              lesson.difficulty === "Advanced" ? "bg-destructive/10 text-destructive border-destructive/20" :
              "bg-primary/10 text-primary border-primary/20"
            }`}
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
