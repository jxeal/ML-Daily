import { useRoute, Link } from "wouter";
import { useGetLessonById } from "@workspace/api-client-react";
import { ArrowLeft, Loader2, BookOpen } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { QuizSection } from "@/components/ui/quiz-section";

export default function LessonDetail() {
  const [, params] = useRoute("/lessons/:id");
  const id = params?.id;

  const {
    data: lesson,
    isLoading,
    error,
  } = useGetLessonById(id || "", {
    query: {
      queryKey: ["lesson", id], // Add this line
      enabled: !!id,
    },
  });

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
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium text-sm">Back</span>
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl bg-secondary/50 p-3 rounded-2xl">
              {lesson.icon}
            </span>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {lesson.category}
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
            {lesson.shortDescription}
          </p>
        </div>

        {/* Content Body */}
        <div className="px-4 md:px-8 py-8 max-w-3xl mx-auto">
          <div className="prose prose-invert prose-emerald max-w-none">
            {/* 
               In a real app, we'd use a Markdown parser here. 
               For this demo, we simulate the rendering of paragraphs.
            */}
            {lesson.content.split("\n\n").map((paragraph, idx) => (
              <p
                key={idx}
                className="text-[1.1rem] leading-relaxed text-foreground/90 mb-6"
              >
                {paragraph}
              </p>
            ))}
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
                    <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                      {ex}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quiz Section */}
          <QuizSection lessonId={lesson.id} quiz={lesson.quiz} />
        </div>
      </div>
    </AppLayout>
  );
}
