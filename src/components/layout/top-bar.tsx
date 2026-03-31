import { Flame, Brain, User as UserIcon, LogOut, Settings, User as ProfileIcon } from 'lucide-react';
import { useStatsStore } from '@/store/use-stats';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useUserStats, useUpdateUserStats } from '@/hooks/use-supabase';
import { Link, useLocation } from 'wouter';
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export function TopBar() {
  const { user, signOut } = useAuth();
  const [, setLocation] = useLocation();
  const { data: supabaseStats } = useUserStats();
  const updateStats = useUpdateUserStats();
  const localStreak = useStatsStore(state => state.streak);
  const recordVisit = useStatsStore(state => state.recordVisit);

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const streak = user ? (supabaseStats?.streak || 0) : localStreak;

  useEffect(() => {
    recordVisit();
  }, [recordVisit]);

  // Sync streak to Supabase if logged in and local is higher
  useEffect(() => {
    if (user && localStreak > (supabaseStats?.streak || 0)) {
      updateStats.mutate({ streak: localStreak });
    }
  }, [user, localStreak, supabaseStats?.streak]);

  const handleLogout = async () => {
    await signOut();
    setIsLogoutOpen(false);
    setLocation('/auth');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b-0 pb-4 pt-6 px-4 md:px-6">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-display font-bold tracking-tight group-hover:text-primary transition-colors">ML Daily</h1>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="flex items-center gap-1.5 bg-secondary/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
            <Flame 
              className={`w-4 h-4 ${streak > 0 ? 'text-warning fill-warning' : 'text-muted-foreground'}`} 
            />
            <span className="font-bold text-sm">
              {streak} <span className="text-muted-foreground font-medium">Day{streak !== 1 ? 's' : ''}</span>
            </span>
          </div>

          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="w-10 h-10 rounded-full bg-secondary border border-white/5 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/50 transition-colors">
                    {user?.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Learner'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLocation('/profile')}>
                    <ProfileIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation('/progress')}>
                    <Flame className="mr-2 h-4 w-4" />
                    <span>Progress</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsLogoutOpen(true)} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
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
            </>
          ) : (
            <Link href="/auth">
              <Button variant="ghost" size="icon" className="rounded-full w-10 h-10">
                <UserIcon className="w-5 h-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
