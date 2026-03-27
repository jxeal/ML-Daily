import { AppLayout } from "@/components/layout/app-layout";
import { useStatsStore } from "@/store/use-stats";
import { Award, Flame, User as UserIcon, Zap, BookOpen, Share2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Profile() {
  const stats = useStatsStore();

  const getBadgeIcon = (badge: string) => {
    if (badge.includes('Streak')) return <Flame className="w-6 h-6 text-orange-500" />;
    if (badge.includes('Learner')) return <BookOpen className="w-6 h-6 text-blue-500" />;
    return <Award className="w-6 h-6 text-accent" />;
  };

  return (
    <AppLayout>
      <div className="px-4 md:px-6 py-4 space-y-8 animate-in fade-in pb-12">
        
        {/* Profile Header */}
        <section className="flex flex-col items-center text-center mt-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-accent to-primary p-1 mb-4">
            <div className="w-full h-full bg-card rounded-full flex items-center justify-center">
              <UserIcon className="w-10 h-10 text-muted-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-display font-bold mb-1">ML Explorer</h1>
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

        {/* Share Action */}
        <button className="w-full bg-card hover:bg-secondary border border-white/5 text-foreground font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
          <Share2 className="w-5 h-5" />
          Share Profile
        </button>

      </div>
    </AppLayout>
  );
}
