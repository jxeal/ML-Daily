import { AppLayout } from "@/components/layout/app-layout";
import { LessonCard } from "@/components/ui/lesson-card";
import { useGetLessonsByCategory, useGetCategoryById, useUserStats } from "@/hooks/use-supabase";
import { useStatsStore } from "@/store/use-stats";
import { useAuth } from "@/components/auth/auth-provider";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link, useRoute, useLocation } from "wouter";

export default function ProgressCategory() {
  const [, params] = useRoute("/progress/:id");
  const [, setLocation] = useLocation();
  const categoryId = params?.id || "";
  
  const { data: category, isLoading: isLoadingCategory } = useGetCategoryById(categoryId);
  
  // Use the name from the category object if found, otherwise fallback to the ID from the URL
  const categoryName = category?.name || (!isLoadingCategory && !category ? categoryId : "");
  const { data: lessons, isLoading: isLoadingLessons } = useGetLessonsByCategory(categoryName, categoryId);

  const { user } = useAuth();
  const { data: supabaseStats } = useUserStats();
  const localCompletedIds = useStatsStore(state => state.completedLessons);
  const completedIds = user ? (supabaseStats?.completed_lessons || []) : localCompletedIds;

  const completedLessons = lessons?.filter(l => completedIds.includes(l.id)) || [];

  return (
    <AppLayout>
      <div className="px-4 md:px-6 py-4 space-y-8 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Link href="/progress" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Progress</span>
          </Link>
          
          {isLoadingCategory ? (
            <div className="h-10 w-48 bg-card animate-pulse rounded-lg" />
          ) : (
            <div className="flex items-center gap-4">
              <div className="text-4xl">{category?.icon || "📚"}</div>
              <div>
                <h1 className="text-3xl font-display font-bold">{category?.name || categoryId}</h1>
                <p className="text-muted-foreground">Completed lessons in this category.</p>
              </div>
            </div>
          )}
        </div>

        {/* Lessons Feed */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold">Completed Lessons</h2>
            <span className="text-sm text-muted-foreground font-medium bg-secondary px-3 py-1 rounded-full">
              {completedLessons.length} Lessons
            </span>
          </div>

          {isLoadingLessons ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-card h-16 rounded-xl border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : completedLessons.length > 0 ? (
            <div className="bg-card border border-white/5 rounded-2xl overflow-hidden">
              <div className="flex flex-col divide-y divide-white/5">
                {completedLessons.map((lesson, idx) => (
                  <div 
                    key={lesson.id}
                    className="w-full p-4 cursor-pointer hover:bg-white/5 transition-colors flex items-center justify-between"
                    onClick={() => setLocation(`/lessons/${lesson.id}`)}
                  >
                    <div>
                      <h4 className="font-bold text-base">{lesson.title}</h4>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{lesson.short_description || "Completed lesson"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-card p-12 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-muted-foreground opacity-20" />
              </div>
              <h3 className="text-lg font-bold mb-1">No completed lessons</h3>
              <p className="text-muted-foreground max-w-xs">
                You haven't completed any lessons in this category yet.
              </p>
            </div>
          )}
        </section>

      </div>
    </AppLayout>
  );
}
