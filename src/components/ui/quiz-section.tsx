import { useState } from 'react';
import { type QuizQuestion } from '@/types/database';
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStatsStore } from '@/store/use-stats';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/auth/auth-provider';
import { useUpdateUserStats, useUserStats, useGetLessonsByCategory } from '@/hooks/use-supabase';

interface QuizSectionProps {
  lessonId: string;
  lessonCategory?: string;
  quiz: QuizQuestion[];
}

export function QuizSection({ lessonId, lessonCategory, quiz }: QuizSectionProps) {
  const { user } = useAuth();
  const { data: supabaseStats } = useUserStats();
  const updateStats = useUpdateUserStats();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [, setLocation] = useLocation();
  const completeLesson = useStatsStore(state => state.completeLesson);
  const localCompleted = useStatsStore(state => state.completedLessons);

  const { data: categoryLessons } = useGetLessonsByCategory(lessonCategory || "");
  const completedLessons = user && supabaseStats ? supabaseStats.completed_lessons : localCompleted;
  const nextLesson = categoryLessons?.find(l => l.id !== lessonId && !completedLessons.includes(l.id));

  if (!quiz || quiz.length === 0) return null;

  const currentQ = quiz[currentIdx];
  const isCorrect = selectedId === currentQ.answer;

  const handleSubmit = () => {
    if (!selectedId) return;
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (currentIdx < quiz.length - 1) {
      setCurrentIdx(curr => curr + 1);
      setSelectedId(null);
      setIsSubmitted(false);
    } else {
      // Finished all questions
      completeLesson(lessonId);
      
      // Sync to Supabase if logged in
      if (user && supabaseStats) {
        const completedLessons = Array.from(new Set([...supabaseStats.completed_lessons, lessonId]));
        const xp = supabaseStats.xp + 10;
        updateStats.mutate({ completed_lessons: completedLessons, xp });
      }

      setIsFinished(true);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#3b82f6', '#10b981']
      });
    }
  };

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-3xl p-8 border border-primary/20 text-center shadow-2xl shadow-primary/10 my-8"
      >
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-3xl font-display font-bold mb-2">Lesson Completed!</h3>
        <p className="text-muted-foreground mb-8 text-lg">You earned +10 XP for your progress.</p>
        <div className="flex flex-col items-center gap-6">
          {nextLesson && (
            <button 
              onClick={() => {
                setIsFinished(false);
                setCurrentIdx(0);
                setSelectedId(null);
                setIsSubmitted(false);
                setLocation(`/lessons/${nextLesson.id}`);
              }}
              className="bg-primary text-primary-foreground font-bold px-8 py-4 rounded-xl w-full sm:w-auto hover:opacity-90 transition-opacity"
            >
              Next Lesson
            </button>
          )}
          
          <button 
            onClick={() => setLocation(lessonCategory ? `/categories/${lessonCategory.toLowerCase().replace(/\s+/g, "-")}` : '/')}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium text-sm">Go Back</span>
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-secondary/30 rounded-3xl p-6 md:p-8 border border-white/5 my-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-display font-bold">Knowledge Check</h3>
        <span className="text-sm font-bold text-muted-foreground">
          {currentIdx + 1} / {quiz.length}
        </span>
      </div>

      <div className="mb-8">
        <h4 className="text-lg mb-6 leading-relaxed">{currentQ.question}</h4>
        
        <div className="space-y-3">
          {currentQ.options.map((opt) => {
            const isSelected = selectedId === opt.id;
            const showCorrect = isSubmitted && opt.id === currentQ.answer;
            const showWrong = isSubmitted && isSelected && !isCorrect;

            let btnClass = "w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ";
            
            if (!isSubmitted) {
              btnClass += isSelected 
                ? "border-primary bg-primary/10 text-foreground shadow-sm shadow-primary/20" 
                : "border-white/5 bg-card hover:border-white/20 text-muted-foreground hover:text-foreground";
            } else {
              if (showCorrect) {
                btnClass += "border-emerald-500 bg-emerald-500/10 text-emerald-400";
              } else if (showWrong) {
                btnClass += "border-red-500 bg-red-500/10 text-red-400";
              } else {
                btnClass += "border-white/5 bg-card opacity-50";
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => !isSubmitted && setSelectedId(opt.id)}
                disabled={isSubmitted}
                className={btnClass}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{opt.text}</span>
                  {isSubmitted && showCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  {isSubmitted && showWrong && <XCircle className="w-5 h-5 text-red-500" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="submit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <button
              onClick={handleSubmit}
              disabled={!selectedId}
              className="w-full bg-foreground text-background font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90 transition-colors"
            >
              Check Answer
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="next"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 ${isCorrect ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}
          >
            <div className="flex flex-col text-center sm:text-left">
              <span className={`font-bold text-lg ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                {isCorrect ? 'Excellent!' : 'Not quite right.'}
              </span>
              <span className="text-sm text-muted-foreground">
                {isCorrect ? "You nailed it. Let's move on." : "Review the material and try again."}
              </span>
            </div>
            <button
              onClick={isCorrect ? handleNext : () => setIsSubmitted(false)}
              className={`flex items-center gap-2 font-bold px-6 py-3 rounded-lg text-white transition-colors ${
                isCorrect ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {isCorrect ? 'Continue' : 'Try Again'}
              {isCorrect && <ArrowRight className="w-4 h-4" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
