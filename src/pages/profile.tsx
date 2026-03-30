import { AppLayout } from "@/components/layout/app-layout";
import { useStatsStore } from "@/store/use-stats";
import { useUserStats } from "@/hooks/use-supabase";
import { useAuth } from "@/components/auth/auth-provider";
import { Award, Flame, User as UserIcon, Zap, BookOpen, Share2, LogOut, LogIn, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Profile() {
  const { user, signOut, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { data: supabaseStats, isLoading: statsLoading } = useUserStats();
  const localStats = useStatsStore();

  const isLoading = authLoading || statsLoading;

  // Use Supabase stats if logged in, otherwise use local store
  const stats = user ? {
    streak: supabaseStats?.streak || 0,
    xp: supabaseStats?.xp || 0,
    badges: supabaseStats?.badges || [],
  } : localStats;

  const getBadgeIcon = (badge: string) => {
    if (badge.includes('Streak')) return <Flame className="w-6 h-6 text-orange-500" />;
    if (badge.includes('Learner')) return <BookOpen className="w-6 h-6 text-blue-500" />;
    return <Award className="w-6 h-6 text-accent" />;
  };

  if (!user && !authLoading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center space-y-6">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary">
            <UserIcon className="w-10 h-10" />
          </div>
          <div className="max-w-md space-y-2">
            <h1 className="text-3xl font-display font-bold">Your Profile</h1>
            <p className="text-muted-foreground">
              Sign in to see your achievements, track your learning streak, and customize your profile.
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
      <div className="px-4 md:px-6 py-4 space-y-8 animate-in fade-in pb-12">
        
        {/* Profile Header */}
        <section className="flex flex-col items-center text-center mt-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-accent to-primary p-1 mb-4">
            <div className="w-full h-full bg-card rounded-full flex items-center justify-center overflow-hidden">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
          </div>
          <h1 className="text-3xl font-display font-bold mb-1">
            {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "ML Explorer"}
          </h1>
          <p className="text-muted-foreground flex items-center gap-1">
            <Zap className="w-4 h-4 text-warning fill-warning" />
            Level {Math.floor(stats.xp / 100) + 1} Scholar
          </p>
        </section>

        {/* Quick Stats Grid */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-3xl p-5 border border-white/5 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-3">
              <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
            </div>
            <span className="text-3xl font-bold font-display">{stats.streak}</span>
            <span className="text-sm font-medium text-muted-foreground">Day Streak</span>
          </div>

          <div className="bg-card rounded-3xl p-5 border border-white/5 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Zap className="w-6 h-6 text-primary fill-primary" />
            </div>
            <span className="text-3xl font-bold font-display">{stats.xp}</span>
            <span className="text-sm font-medium text-muted-foreground">Total XP</span>
          </div>
        </section>

        {/* Badges Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              <h2 className="text-2xl font-display font-bold">Badges</h2>
            </div>
            <span className="text-sm text-muted-foreground">{stats.badges.length} Earned</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.badges.length === 0 ? (
              <div className="col-span-full p-8 text-center border border-dashed border-white/10 rounded-3xl text-muted-foreground">
                Keep learning to earn your first badge!
              </div>
            ) : (
              stats.badges.map((badge, idx) => (
                <motion.div 
                  key={badge}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-secondary/40 border border-white/5 rounded-3xl p-6 flex flex-col items-center text-center gap-3 hover:bg-secondary/60 transition-colors"
                >
                  <div className="w-14 h-14 rounded-full bg-card shadow-inner flex items-center justify-center">
                    {getBadgeIcon(badge)}
                  </div>
                  <span className="font-bold text-sm">{badge}</span>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Actions */}
        <div className="space-y-3">
          <button className="w-full bg-card hover:bg-secondary border border-white/5 text-foreground font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Profile
          </button>
          
          <button className="w-full bg-card hover:bg-secondary border border-white/5 text-foreground font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
            <Settings className="w-5 h-5" />
            Account Settings
          </button>

          <button 
            onClick={() => signOut()}
            className="w-full bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 text-destructive font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

      </div>
    </AppLayout>
  );
}
