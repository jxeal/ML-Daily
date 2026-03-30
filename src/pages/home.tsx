import { AppLayout } from "@/components/layout/app-layout";
import { LessonCard } from "@/components/ui/lesson-card";
import { useGetLessons, useGetDailyChallenge } from "@/hooks/use-supabase";
import { Sparkles, Trophy, Loader2, Zap } from "lucide-react";
import { Link } from "wouter";
import { useStatsStore } from "@/store/use-stats";
import { format } from "date-fns";

export default function Home() {
  const { data: lessons, isLoading: isLoadingLessons } = useGetLessons();
  const { data: challenge, isLoading: isLoadingChallenge } = useGetDailyChallenge();
  
  const dailyChallengeDone = useStatsStore(state => state.dailyChallengeDone);
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const isChallengeDone = dailyChallengeDone === todayStr;

  return (
    <AppLayout>
      <div className="px-4 md:px-6 py-4 space-y-8 animate-in fade-in duration-500">
        
        {/* Daily Challenge Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-display font-bold">Daily Challenge</h2>
          </div>
          
          {isLoadingChallenge ? (
            <div className="bg-card h-40 rounded-3xl border border-white/5 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : challenge ? (
            <Link href={isChallengeDone ? "#" : `/challenge/${challenge.id}`} className={isChallengeDone ? "pointer-events-none opacity-80" : ""}>
              <div className="relative overflow-hidden rounded-3xl p-6 border border-accent/20 bg-gradient-to-br from-card to-accent/5 shadow-lg shadow-accent/5 transition-transform hover:-translate-y-1">
                
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <Zap className="w-32 h-32 text-accent" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-accent/20 text-accent text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {isChallengeDone ? 'Completed' : 'Active Now'}
                    </span>
                    <div className="flex items-center gap-1 font-bold text-warning bg-warning/10 px-3 py-1 rounded-full text-sm">
                      <Trophy className="w-3.5 h-3.5" />
                      +{challenge.xpReward} XP
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-display font-bold mt-2 mb-1">
                    {isChallengeDone ? "Awesome work today!" : challenge.question}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {isChallengeDone 
                      ? "Come back tomorrow for a new machine learning challenge." 
                      : "Test your knowledge and earn extra XP to level up."}
                  </p>
                  
                  {!isChallengeDone && (
                    <button className="self-start mt-auto bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-accent/20">
                      Solve Challenge
                    </button>
                  )}
                </div>
              </div>
            </Link>
          ) : null}
        </section>

        {/* Daily Feed */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-display font-bold">Your Feed</h2>
            <Link href="/categories" className="text-primary text-sm font-bold hover:underline">
              View All
            </Link>
          </div>

          {isLoadingLessons ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-card h-48 rounded-3xl border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lessons?.map((lesson, idx) => (
                <LessonCard key={lesson.id} lesson={lesson} index={idx} />
              ))}
            </div>
          )}
        </section>

      </div>
    </AppLayout>
  );
}
