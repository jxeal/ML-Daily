import { Flame, Brain } from 'lucide-react';
import { useStatsStore } from '@/store/use-stats';
import { useEffect } from 'react';

export function TopBar() {
  const streak = useStatsStore(state => state.streak);
  const recordVisit = useStatsStore(state => state.recordVisit);

  useEffect(() => {
    recordVisit();
  }, [recordVisit]);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b-0 pb-4 pt-6 px-4 md:px-6">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center shadow-lg shadow-primary/20">
            <Brain className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-display font-bold tracking-tight">ML Daily</h1>
        </div>

        <div className="flex items-center gap-1.5 bg-secondary/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
          <Flame 
            className={`w-4 h-4 ${streak > 0 ? 'text-warning fill-warning' : 'text-muted-foreground'}`} 
          />
          <span className="font-bold text-sm">
            {streak} <span className="text-muted-foreground font-medium">Day{streak !== 1 ? 's' : ''}</span>
          </span>
        </div>
      </div>
    </header>
  );
}
