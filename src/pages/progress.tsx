import { AppLayout } from "@/components/layout/app-layout";
import { useStatsStore } from "@/store/use-stats";
import { useGetLessons, useUserStats, useGetCategories } from "@/hooks/use-supabase";
import { useAuth } from "@/components/auth/auth-provider";
import { CheckCircle2, Shield, Target, Lock, LogIn, BarChart } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

export default function Progress() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { data: lessons, isLoading: lessonsLoading } = useGetLessons();
  const { data: categories, isLoading: categoriesLoading } = useGetCategories();
  const { data: supabaseStats, isLoading: statsLoading } = useUserStats();
  const localCompletedIds = useStatsStore(state => state.completedLessons);
  
  const isLoading = lessonsLoading || statsLoading || authLoading || categoriesLoading;

  // Use Supabase stats if logged in, otherwise use local store
  const completedIds = user ? (supabaseStats?.completed_lessons || []) : localCompletedIds;
  const xp = user ? (supabaseStats?.xp || 0) : useStatsStore.getState().xp;
  const streak = user ? (supabaseStats?.streak || 0) : useStatsStore.getState().streak;
  
  const total = lessons?.length || 1;
  const completedCount = completedIds.length;
  const percent = Math.round((completedCount / total) * 100) || 0;

  // Calculate mastery by category
  const masteryData = categories?.map(cat => {
    const catLessons = lessons?.filter(l => l.category === cat.name) || [];
    const catCompleted = catLessons.filter(l => completedIds.includes(l.id)).length;
    const catPercent = catLessons.length > 0 ? Math.round((catCompleted / catLessons.length) * 100) : 0;
    return {
      name: cat.name,
      percent: catPercent,
      color: cat.color || "#a855f7"
    };
  }) || [];

  if (!user && !authLoading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center space-y-6">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary">
            <Lock className="w-10 h-10" />
          </div>
          <div className="max-w-md space-y-2">
            <h1 className="text-3xl font-display font-bold">Sign in to track progress</h1>
            <p className="text-muted-foreground">
              Create an account to sync your learning journey across devices and compete on the leaderboard.
            </p>
          </div>
          <Button size="lg" className="rounded-2xl px-8" onClick={() => setLocation("/auth")}>
            <LogIn className="w-4 h-4 mr-2" /> Sign In / Sign Up
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-4 md:px-6 py-4 space-y-8 animate-in fade-in pb-8">
        
        <header className="mb-6">
          <h1 className="text-3xl font-display font-bold mb-2">Learning Journey</h1>
          <p className="text-muted-foreground">Track your progress and mastery.</p>
        </header>

        {/* Big Progress Card */}
        <section className="bg-card border border-white/5 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            {/* Circular Progress */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  className="text-secondary stroke-current" 
                  strokeWidth="8" 
                  cx="50" cy="50" r="40" 
                  fill="transparent" 
                />
                <motion.circle 
                  className="text-primary stroke-current" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                  cx="50" cy="50" r="40" 
                  fill="transparent"
                  initial={{ strokeDasharray: "0 251.2" }}
                  animate={{ strokeDasharray: `${(percent / 100) * 251.2} 251.2` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-display">{percent}%</span>
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <h3 className="text-2xl font-bold mb-2">Course Completion</h3>
              <p className="text-muted-foreground mb-4">
                You've completed <span className="text-foreground font-bold">{completedCount}</span> out of {total} lessons.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> {completedCount} Done
                </div>
                <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> {xp} XP
                </div>
                <div className="bg-orange-500/10 text-orange-400 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5">
                  🔥 {streak} Day Streak
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mastery Chart */}
        <section className="bg-card border border-white/5 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-display font-bold">Mastery by Category</h2>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={masteryData} layout="vertical" margin={{ left: 0, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100} 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="percent" radius={[0, 4, 4, 0]} barSize={20}>
                  {masteryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Milestone Path / Timeline */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-accent" />
            <h2 className="text-2xl font-display font-bold">Recent Achievements</h2>
          </div>
          
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
            {isLoading ? (
               <div className="h-20 bg-card rounded-2xl animate-pulse" />
            ) : completedIds.length === 0 ? (
               <div className="bg-card p-6 rounded-2xl text-center border border-white/5">
                 <p className="text-muted-foreground">Complete a lesson to see it here.</p>
               </div>
            ) : (
              lessons?.filter(l => completedIds.includes(l.id)).map((lesson, idx) => (
                <div key={lesson.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Timeline Dot */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-emerald-500 text-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-card border border-white/5 shadow-sm">
                    <div className="text-xs font-bold text-emerald-400 mb-1">{lesson.category}</div>
                    <h4 className="font-bold text-lg">{lesson.title}</h4>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </AppLayout>
  );
}
