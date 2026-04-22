import { useRoute, Link, useLocation } from "wouter";
import { useGetDailyChallenge, useUserStats, useUpdateUserStats } from "@/hooks/use-supabase";
import { ArrowLeft, Loader2, Zap } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { useState } from "react";
import { useStatsStore } from "@/store/use-stats";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/auth-provider";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

export default function DailyChallenge() {
  const { user } = useAuth();
  const { data: supabaseStats } = useUserStats();
  const updateStats = useUpdateUserStats();
  const [, params] = useRoute("/challenge/:id");
  const { data: challenge, isLoading } = useGetDailyChallenge();
  const [, setLocation] = useLocation();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const completeDailyChallenge = useStatsStore(state => state.completeDailyChallenge);

  // Custom Markdown components shared for consistent rendering and fixing hydration errors
  const MarkdownComponents = {
    p: ({ node, children }: any) => {
      const hasImage = node?.children?.some((child: any) => child.tagName === 'img');
      
      if (hasImage) {
        return <div className="mb-6">{children}</div>;
      }
      return <p className="mb-6 last:mb-0">{children}</p>;
    },
    img: ({ node, ...props }: any) => {
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
  };

  if (isLoading) return (
    <AppLayout hideNav>
      <div className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
    </AppLayout>
  );

  if (!challenge) return (
    <AppLayout hideNav>
      <div className="flex-1 flex items-center justify-center p-6 text-center">
        <h2 className="text-xl">Challenge not found</h2>
      </div>
    </AppLayout>
  );

  const isCorrect = selectedId === challenge.answer;

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (isCorrect) {
      completeDailyChallenge(challenge.xpReward);
      
      // Sync to Supabase if logged in
      if (user && supabaseStats) {
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        if (supabaseStats.daily_challenge_done !== todayStr) {
          updateStats.mutate({ 
            daily_challenge_done: todayStr, 
            xp: supabaseStats.xp + challenge.xpReward 
          });
        }
      }

      setIsSuccess(true);
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#a855f7', '#d946ef', '#fcd34d']
      });
    }
  };

  return (
    <AppLayout hideNav>
      <div className="animate-in slide-in-from-bottom-4 duration-500 pb-20 px-4 md:px-8 pt-6 max-w-2xl mx-auto w-full">
        
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" /> <span className="font-medium text-sm">Back</span>
        </Link>

        {isSuccess ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-12 h-12 text-accent fill-accent" />
            </div>
            <h1 className="text-4xl font-display font-bold mb-4">Challenge Conquered!</h1>
            <p className="text-xl text-muted-foreground mb-8">You earned +{challenge.xpReward} XP.</p>
            
            <div className="bg-card p-6 rounded-2xl border border-white/5 mb-8 text-left">
              <h4 className="font-bold text-accent mb-2">Explanation</h4>
              <div className="prose dark:prose-invert prose-emerald max-w-none text-foreground/80 leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={MarkdownComponents}>
                  {challenge.explanation}
                </ReactMarkdown>
              </div>
            </div>

            <Link href="/">
              <button className="bg-accent text-accent-foreground font-bold px-8 py-4 rounded-xl w-full sm:w-auto hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20">
                Return to Home
              </button>
            </Link>
          </motion.div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-6 text-accent">
              <Zap className="w-6 h-6 fill-current" />
              <h1 className="text-2xl font-display font-bold">Daily Challenge</h1>
            </div>

            <div className="prose dark:prose-invert prose-emerald max-w-none mb-8">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={MarkdownComponents}>
                {challenge.question}
              </ReactMarkdown>
            </div>

            <div className="space-y-4 mb-8">
              {challenge.options.map(opt => {
                const isSelected = selectedId === opt.id;
                const showCorrect = isSubmitted && opt.id === challenge.answer;
                const showWrong = isSubmitted && isSelected && !isCorrect;

                let btnClass = "w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 text-lg ";
                
                if (!isSubmitted) {
                  btnClass += isSelected 
                    ? "border-accent bg-accent/10 text-foreground" 
                    : "border-white/5 bg-card hover:border-white/20 text-muted-foreground hover:text-foreground";
                } else {
                  if (showCorrect) btnClass += "border-emerald-500 bg-emerald-500/10 text-emerald-400";
                  else if (showWrong) btnClass += "border-red-500 bg-red-500/10 text-red-400";
                  else btnClass += "border-white/5 bg-card opacity-50";
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => !isSubmitted && setSelectedId(opt.id)}
                    disabled={isSubmitted}
                    className={btnClass}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div key="submit" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedId}
                    className="w-full bg-accent text-accent-foreground font-bold py-4 rounded-xl disabled:opacity-50 text-lg hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
                  >
                    Lock Answer
                  </button>
                </motion.div>
              ) : (
                !isCorrect && (
                  <motion.div key="wrong" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl mb-6">
                      <h4 className="font-bold text-red-400 mb-2">Incorrect</h4>
                      <div className="prose dark:prose-invert prose-emerald max-w-none text-sm text-foreground/80">
                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={MarkdownComponents}>
                          {challenge.explanation}
                        </ReactMarkdown>
                      </div>
                    </div>
                    <button
                      onClick={() => { setIsSubmitted(false); setSelectedId(null); }}
                      className="w-full bg-secondary hover:bg-secondary/80 font-bold py-4 rounded-xl transition-colors"
                    >
                      Try Again
                    </button>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
