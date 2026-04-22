import { useRoute, Link, useLocation } from "wouter";
import { useGetLessonByNumber, useUserStats, useGetCategoryById } from "@/hooks/use-supabase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { ArrowLeft, Loader2, BookOpen, Lock } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { QuizSection } from "@/components/ui/quiz-section";
import { useAuth } from "@/components/auth/auth-provider";
import { useStatsStore } from "@/store/use-stats";
import { useEffect } from "react";
import { isLessonUnlocked } from "@/lib/lesson-utils";

export default function LessonDetail() {
  const [, params] = useRoute("/lessons/:category/:lessonNumber");
  const categorySlug = params?.category || "";
  const lessonNumberParam = params?.lessonNumber || "intro";
  
  const lessonNumber = lessonNumberParam === "intro" ? 0 : parseInt(lessonNumberParam, 10);
  const [, setLocation] = useLocation();

  const { data: lesson, isLoading, error } = useGetLessonByNumber(categorySlug, lessonNumber);
  const { data: categoryData } = useGetCategoryById(categorySlug);
  const catIdToUse = categoryData?.id || categorySlug;

  const { user } = useAuth();
  const { data: supabaseStats } = useUserStats();
  const localCompleted = useStatsStore(state => state.completedLessons);

  const completedLessons = user ? supabaseStats?.completed_lessons || [] : localCompleted;

  const isUnlocked = lesson ? isLessonUnlocked(
    lesson.lesson_number,
    catIdToUse,
    completedLessons,
    !!user
  ) : (lessonNumber === 0); // Intro is always unlocked even if lesson data not loaded yet

  // Security check: if the lesson is locked, redirect or show lock screen
  if (!isLoading && lesson && !isUnlocked) {
    return (
      <AppLayout hideNav>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-10 h-10 text-destructive" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">Lesson Locked</h2>
          <p className="text-muted-foreground mb-8">
            {!user 
              ? "This lesson is reserved for signed-in members. Create an account to unlock the full curriculum!" 
              : "You need to complete the previous lesson in this category before you can start this one."}
          </p>
          <Link href={user ? "/categories" : "/auth"} className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
            {user ? "Back to Learning" : "Sign Up Now"}
          </Link>
        </div>
      </AppLayout>
    );
  }

  if (isLoading) {
    return (
      <AppLayout hideNav>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (error || !lesson) {
    return (
      <AppLayout hideNav>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Lesson not found</h2>
          <Link href="/" className="text-primary hover:underline">
            Return to Home
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout hideNav>
      <div className="animate-in slide-in-from-bottom-4 duration-500 pb-20">
        {/* Header Hero */}
        <div className="relative pt-6 px-4 md:px-8 pb-12 border-b border-white/5 bg-gradient-to-b from-card to-background">
          <button 
            onClick={() => window.history.length > 1 ? window.history.back() : setLocation(`/categories/${categorySlug}`)}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium text-sm">Back</span>
          </button>

          <div className="flex items-center gap-3 mb-4">
            {/* <span className="text-4xl bg-secondary/50 p-3 rounded-2xl">
              {lesson.icon}
            </span> */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {lesson.lesson_number === 0 ? "Introduction" : `Lesson ${lesson.lesson_number}`}
                </span>
                <span className="text-xs font-bold text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {lesson.difficulty}
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight mb-4 text-gradient">
            {lesson.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {lesson.short_description}
          </p>
        </div>

        {/* Content Body */}
        <div className="px-4 md:px-8 py-8 max-w-3xl mx-auto">
          <div className="prose dark:prose-invert prose-emerald max-w-none text-[1.1rem] leading-relaxed text-foreground/90 prose-headings:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-li:marker:text-foreground">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                p: ({ node, children }) => {
                  // Check AST to see if this paragraph contains an image
                  const hasImage = (node as any)?.children?.some((child: any) => child.tagName === 'img');
                  
                  if (hasImage) {
                    return <div className="mb-6">{children}</div>;
                  }
                  return <p className="mb-6 last:mb-0">{children}</p>;
                },
                img: ({ node, ...props }) => {
                  const alt = props.alt || "";
                  const hasFormat = alt.includes("|");
                  const [formatPart, caption] = hasFormat ? alt.split("|") : ["", alt];
                  
                  let containerClass = "my-10 clear-both flex flex-col";

                  if (formatPart.toLowerCase().includes("left")) {
                    containerClass = "md:float-left md:mr-8 md:mb-6 md:mt-2 md:max-w-[45%] w-full clear-none flex flex-col items-center";
                  } else if (formatPart.toLowerCase().includes("right")) {
                    containerClass = "md:float-right md:ml-8 md:mb-6 md:mt-2 md:max-w-[45%] w-full clear-none flex flex-col items-center";
                  } else if (formatPart.toLowerCase().includes("full")) {
                    containerClass = "w-full my-12 flex flex-col items-center";
                  } else {
                    containerClass = "my-10 flex flex-col items-center justify-center mx-auto";
                  }

                  return (
                    <figure className={containerClass}>
                      <img 
                        {...props} 
                        className="rounded-2xl shadow-xl border border-white/10 w-full object-cover max-h-[500px]" 
                        referrerPolicy="no-referrer"
                      />
                      {caption && caption.trim() && (
                        <figcaption className="mt-4 text-[0.9rem] text-muted-foreground text-center italic font-medium px-4 max-w-sm">
                          {caption.trim()}
                        </figcaption>
                      )}
                    </figure>
                  );
                }
              }}
            >
              {lesson.content}
            </ReactMarkdown>
          </div>

          {/* Examples Section */}
          {lesson.examples && lesson.examples.length > 0 && (
            <div className="my-12">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-5 h-5 text-accent" />
                <h3 className="text-2xl font-display font-bold">Examples</h3>
              </div>
              <div className="space-y-4">
                {lesson.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="bg-card p-6 rounded-2xl border-l-4 border-accent shadow-sm"
                  >
                    <p className="font-mono text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                      {ex}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quiz Section */}
          <QuizSection 
            lessonId={lesson.id} 
            lessonCategory={catIdToUse} 
            lessonNumber={lesson.lesson_number}
            quiz={lesson.quiz} 
          />
        </div>
      </div>
    </AppLayout>
  );
}
