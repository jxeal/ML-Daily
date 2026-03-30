import { AppLayout } from "@/components/layout/app-layout";
import { useStatsStore } from "@/store/use-stats";
import { useUserStats, useUserProfile, useUpdateUserStats } from "@/hooks/use-supabase";
import { useAuth } from "@/components/auth/auth-provider";
import { Award, Flame, User as UserIcon, Zap, BookOpen, Share2, LogOut, LogIn, Settings, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export default function Profile({ params }: { params?: { username?: string } }) {
  const { user, signOut, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  const isPublicView = !!params?.username;
  const { data: publicStats, isLoading: publicStatsLoading } = useUserProfile(params?.username || "");
  const { data: supabaseStats, isLoading: statsLoading } = useUserStats();
  const { mutateAsync: updateStats } = useUpdateUserStats();
  
  const localStats = useStatsStore();
  const { toast } = useToast();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const isGoogleAuth = user?.app_metadata?.providers?.includes('google') || user?.app_metadata?.provider === 'google';

  useEffect(() => {
    if (user && !isPublicView) {
      setDisplayName(user.user_metadata?.full_name || "");
      setUsername(user.user_metadata?.username || "");
    }
  }, [user, isPublicView]);

  const handleShareProfile = async () => {
    // Share using username if available, otherwise fallback to id
    const shareId = user?.user_metadata?.username || user?.id || 'guest';
    const profileUrl = `${window.location.origin}/profile/${shareId}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My ML Daily Profile',
          text: `Check out my machine learning progress on ML Daily!`,
          url: profileUrl,
        });
      } else {
        await navigator.clipboard.writeText(profileUrl);
        toast({
          title: "Link copied!",
          description: "Profile link copied to clipboard.",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const updates: any = {
        data: {
          full_name: displayName,
          username: username,
        }
      };
      
      if (password) {
        updates.password = password;
      }
      
      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;
      
      // Also update the public user_stats table so others can find the profile
      await updateStats({
        username: username,
        full_name: displayName,
      });
      
      toast({
        title: "Profile updated",
        description: "Your account settings have been saved.",
      });
      
      setIsSettingsOpen(false);
      setPassword(""); // Clear password field
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setIsLogoutOpen(false);
    setLocation("/");
  };

  const isLoading = isPublicView ? publicStatsLoading : (authLoading || statsLoading);

  // Determine which stats to show
  let stats;
  let displayUser;

  if (isPublicView) {
    stats = {
      streak: publicStats?.streak || 0,
      xp: publicStats?.xp || 0,
      badges: publicStats?.badges || [],
    };
    displayUser = {
      full_name: publicStats?.full_name || params.username,
      avatar_url: publicStats?.avatar_url,
    };
  } else {
    stats = user ? {
      streak: supabaseStats?.streak || 0,
      xp: supabaseStats?.xp || 0,
      badges: supabaseStats?.badges || [],
    } : localStats;
    displayUser = {
      full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || "ML Explorer",
      avatar_url: user?.user_metadata?.avatar_url,
    };
  }

  const getBadgeIcon = (badge: string) => {
    if (badge.includes('Streak')) return <Flame className="w-6 h-6 text-orange-500" />;
    if (badge.includes('Learner')) return <BookOpen className="w-6 h-6 text-blue-500" />;
    return <Award className="w-6 h-6 text-accent" />;
  };

  if (!user && !authLoading && !isPublicView) {
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

  if (isPublicView && !publicStats && !publicStatsLoading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center space-y-6">
          <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center text-muted-foreground">
            <UserIcon className="w-10 h-10" />
          </div>
          <div className="max-w-md space-y-2">
            <h1 className="text-3xl font-display font-bold">Profile Not Found</h1>
            <p className="text-muted-foreground">
              We couldn't find a user with the username "@{params.username}".
            </p>
          </div>
          <Button size="lg" className="rounded-2xl px-8" onClick={() => setLocation("/")}>
            Go Home
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
              {displayUser.avatar_url ? (
                <img src={displayUser.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
          </div>
          <h1 className="text-3xl font-display font-bold mb-1">
            {displayUser.full_name}
          </h1>
          {isPublicView && params?.username && (
            <p className="text-sm text-muted-foreground mb-2">@{params.username}</p>
          )}
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
                {isPublicView ? "This user hasn't earned any badges yet." : "Keep learning to earn your first badge!"}
              </div>
            ) : (
              stats.badges.map((badge: string, idx: number) => (
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
        {!isPublicView && (
          <div className="space-y-3">
            <button 
              onClick={handleShareProfile}
              className="w-full bg-card hover:bg-secondary border border-white/5 text-foreground font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Share Profile
            </button>
            
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <button className="w-full bg-card hover:bg-secondary border border-white/5 text-foreground font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                  <Settings className="w-5 h-5" />
                  Account Settings
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-white/10 p-0 overflow-hidden rounded-3xl">
                <div className="p-6 pb-0">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-display">Account Settings</DialogTitle>
                    <DialogDescription className="text-muted-foreground mt-1.5">
                      Update your profile details below. You only need to fill out the fields you want to change.
                    </DialogDescription>
                  </DialogHeader>
                </div>
                
                <form onSubmit={handleUpdateProfile} className="p-6 pt-4 space-y-6">
                  
                  {/* Profile Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                      <UserIcon className="w-4 h-4 text-primary" />
                      <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Public Profile</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="displayName" className="text-foreground/80 text-sm font-medium">Display Name</Label>
                        <Input 
                          id="displayName" 
                          value={displayName} 
                          onChange={(e) => setDisplayName(e.target.value)} 
                          placeholder={user?.user_metadata?.full_name || "e.g. ML Explorer"}
                          className="bg-secondary/30 border-white/10 focus-visible:ring-primary h-11 rounded-xl"
                        />
                        <p className="text-[11px] text-muted-foreground">This is your public-facing name.</p>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="username" className="text-foreground/80 text-sm font-medium">Username</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                          <Input 
                            id="username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            placeholder={user?.user_metadata?.username || "mlexplorer123"}
                            className="pl-8 bg-secondary/30 border-white/10 focus-visible:ring-primary h-11 rounded-xl"
                          />
                        </div>
                        <p className="text-[11px] text-muted-foreground">Unique identifier for your profile URL.</p>
                      </div>
                    </div>
                  </div>

                  {/* Security Section */}
                  {!isGoogleAuth && (
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                        <Shield className="w-4 h-4 text-primary" />
                        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Security</h4>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-foreground/80 text-sm font-medium">New Password</Label>
                        <Input 
                          id="password" 
                          type="password" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          placeholder="Leave blank to keep current"
                          className="bg-secondary/30 border-white/10 focus-visible:ring-primary h-11 rounded-xl"
                        />
                        <p className="text-[11px] text-muted-foreground">Only fill this if you want to change your password.</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-6 flex justify-end gap-3 border-t border-white/5 mt-6">
                    <Button type="button" variant="ghost" onClick={() => setIsSettingsOpen(false)} className="rounded-xl">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUpdating} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6">
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
              <DialogTrigger asChild>
                <button className="w-full bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 text-destructive font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px] bg-card/95 backdrop-blur-xl border-white/10 rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-display">Confirm Logout</DialogTitle>
                  <DialogDescription className="text-muted-foreground mt-2">
                    Are you sure you want to log out? You will need to sign in again to track your progress.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6 flex gap-3 sm:justify-end">
                  <Button variant="ghost" onClick={() => setIsLogoutOpen(false)} className="rounded-xl">
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleLogout} className="rounded-xl px-6">
                    Log Out
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
