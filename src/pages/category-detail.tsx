import { AppLayout } from "@/components/layout/app-layout";
import { LessonCard } from "@/components/ui/lesson-card";
import { useGetLessonsByCategory, useGetCategoryById } from "@/hooks/use-supabase";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";

export default function CategoryDetail() {
  const [, params] = useRoute("/categories/:id");
  const categoryId = params?.id || "";
  
  const { data: category, isLoading: isLoadingCategory } = useGetCategoryById(categoryId);
  
  // Use the name from the category object if found, otherwise fallback to the ID from the URL
  // (in case the ID is actually the name)
  const categoryName = category?.name || (!isLoadingCategory && !category ? categoryId : "");
  const { data: lessons, isLoading: isLoadingLessons } = useGetLessonsByCategory(categoryName, categoryId);

  return (
    <AppLayout>
      <div className="px-4 md:px-6 py-4 space-y-8 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Link href="/categories" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Explore</span>
          </Link>
          
          {isLoadingCategory ? (
            <div className="h-10 w-48 bg-card animate-pulse rounded-lg" />
          ) : (
            <div className="flex items-center gap-4">
              <div className="text-4xl">{category?.icon || "📚"}</div>
              <div>
                <h1 className="text-3xl font-display font-bold">{category?.name || categoryId}</h1>
                <p className="text-muted-foreground">{category?.description || "Explore lessons in this concept."}</p>
              </div>
            </div>
          )}
        </div>

        {/* Lessons Feed */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold">Lessons in this Concept</h2>
            <span className="text-sm text-muted-foreground font-medium bg-secondary px-3 py-1 rounded-full">
              {lessons?.length || 0} Lessons
            </span>
          </div>

          {isLoadingLessons ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-card h-48 rounded-3xl border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : lessons && lessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lessons.map((lesson, idx) => (
                <LessonCard key={lesson.id} lesson={lesson} index={idx} />
              ))}
            </div>
          ) : (
            <div className="bg-card p-12 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Loader2 className="w-8 h-8 text-muted-foreground opacity-20" />
              </div>
              <h3 className="text-lg font-bold mb-1">No lessons found</h3>
              <p className="text-muted-foreground max-w-xs">
                We haven't added any lessons to this concept yet. Check back soon!
              </p>
            </div>
          )}
        </section>

      </div>
    </AppLayout>
  );
}
