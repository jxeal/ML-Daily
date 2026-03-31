import { AppLayout } from "@/components/layout/app-layout";
import { useStatsStore } from "@/store/use-stats";
import { useUserStats, useUserProfile, useGetBadges } from "@/hooks/use-supabase";
import { useAuth } from "@/components/auth/auth-provider";
import { Award, Flame, BookOpen, ChevronLeft, Zap, Star, Trophy, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge as BadgeType } from "@/types/database";

export default function Badges({ params }: { params?: { username?: string } }) {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  const { data: publicStats, isLoading: publicStatsLoading } = useUserProfile(params?.username || "");
  const { data: supabaseStats, isLoading: statsLoading } = useUserStats();
  const { data: allBadges, isLoading: allBadgesLoading } = useGetBadges();

  const isOwnProfile = user && (
    !params?.username || 
    params.username === user.user_metadata?.username || 
    params.username === supabaseStats?.username || 
    params.username === user.id
  );
  const isPublicView = !!params?.username && !isOwnProfile;
  
  const localStats = useStatsStore();

  const isLoading = authLoading || statsLoading || publicStatsLoading || allBadgesLoading;

  let stats: { badges: any[] };
  let displayUser;

  if (isPublicView) {
    stats = {
      badges: Array.isArray(publicStats?.badges) ? publicStats.badges : [],
    };
    displayUser = {
      full_name: publicStats?.full_name || params?.username,
    };
  } else {
    stats = user ? {
      badges: Array.isArray(supabaseStats?.badges) ? supabaseStats.badges : [],
    } : {
      badges: Array.isArray(localStats.badges) ? localStats.badges : [],
    };
    displayUser = {
      full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || "ML Explorer",
    };
  }

  const getBadgeIcon = (iconName: string, className: string = "w-8 h-8") => {
    switch (iconName) {
      case 'Flame': return <Flame className={`${className} text-orange-500`} />;
      case 'BookOpen': return <BookOpen className={`${className} text-blue-500`} />;
      case 'Zap': return <Zap className={`${className} text-yellow-500`} />;
      case 'Star': return <Star className={`${className} text-yellow-400`} />;
      case 'Trophy': return <Trophy className={`${className} text-yellow-600`} />;
      case 'Target': return <Target className={`${className} text-red-500`} />;
      default: return <Award className={`${className} text-accent`} />;
    }
  };

  // Resolve badge details
  const resolvedBadges = stats.badges.slice().reverse().map((b: any) => {
    // Handle both string (localStats/old format) and object (new format)
    const badgeIdOrName = typeof b === 'string' ? b : (b.id || b.name);
    
    // Find badge details from DB if available
    const dbBadge = allBadges?.find(dbB => dbB.id === badgeIdOrName || dbB.name === badgeIdOrName);
    
    if (dbBadge) {
      return {
        id: dbBadge.id,
        name: dbBadge.name,
        description: dbBadge.description,
        quote: dbBadge.quote,
        icon_name: dbBadge.icon_name,
        image_url: dbBadge.image_url,
        earned_at: typeof b === 'object' ? b.earned_at : null
      };
    }
    
    return null;
  }).filter(Boolean) as any[];

  const isCatalogEmpty = !allBadgesLoading && (!allBadges || allBadges.length === 0);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-4 md:px-6 py-4 space-y-8 animate-in fade-in pb-12 max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold">Achievements</h1>
            <p className="text-sm text-muted-foreground">{displayUser.full_name}'s Collection</p>
          </div>
        </div>

        <div className="space-y-6">
          {isCatalogEmpty ? (
            <div className="p-12 text-center border border-dashed border-border rounded-[2rem] text-muted-foreground bg-card/30">
              <Award className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium text-foreground mb-1">No achievements found</p>
              <p>The achievement catalog is currently empty. Check back later!</p>
            </div>
          ) : resolvedBadges.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-border rounded-[2rem] text-muted-foreground bg-card/30">
              <Award className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium text-foreground mb-1">No badges earned yet</p>
              <p>{isPublicView ? "This user hasn't earned any badges yet." : "Keep learning to earn your first badge!"}</p>
            </div>
          ) : (
            resolvedBadges.map((badge, idx: number) => (
              <motion.div 
                key={badge.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                className="group relative overflow-hidden bg-card dark:bg-[#111111] border border-border rounded-[2rem] flex flex-col sm:flex-row items-stretch shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Left Side - Badge Icon (1/3) */}
                <div className="sm:w-1/3 p-8 flex flex-col items-center justify-center bg-gradient-to-br from-secondary/50 to-secondary/10 dark:from-white/5 dark:to-transparent border-b sm:border-b-0 sm:border-r border-border relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
                  <div className="w-24 h-24 rounded-full bg-background shadow-inner flex items-center justify-center border border-border/50 relative z-10 group-hover:scale-110 transition-transform duration-500 ease-out overflow-hidden">
                    {badge.image_url ? (
                      <img src={badge.image_url} alt={badge.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      getBadgeIcon(badge.icon_name, "w-12 h-12")
                    )}
                  </div>
                  {badge.earned_at && (
                    <span className="mt-4 text-[11px] font-medium text-muted-foreground uppercase tracking-widest relative z-10">
                      {new Date(badge.earned_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>

                {/* Right Side - Details (2/3) */}
                <div className="sm:w-2/3 p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-display font-bold mb-2">{badge.name}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {badge.description}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-border/50 relative">
                    <span className="absolute -top-3 left-4 bg-card dark:bg-[#111111] px-2 text-4xl text-primary/20 font-serif leading-none">"</span>
                    <p className="text-sm font-medium italic text-foreground/80 pl-6 pr-2">
                      {badge.quote}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
