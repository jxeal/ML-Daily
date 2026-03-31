import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { differenceInCalendarDays, format, parseISO } from 'date-fns';

export interface UserStatsState {
  streak: number;
  lastVisit: string | null;
  completedLessons: string[];
  xp: number;
  dailyChallengeDone: string | null;
  badges: string[];
  
  // Actions
  recordVisit: () => void;
  completeLesson: (lessonId: string) => void;
  completeDailyChallenge: (xpReward: number) => void;
}

export const useStatsStore = create<UserStatsState>()(
  persist(
    (set, get) => ({
      streak: 0,
      lastVisit: null,
      completedLessons: [],
      xp: 0,
      dailyChallengeDone: null,
      badges: [],

      recordVisit: () => {
        const now = new Date();
        const todayStr = format(now, 'yyyy-MM-dd');
        const { lastVisit, streak } = get();

        if (!lastVisit) {
          set({ streak: 1, lastVisit: todayStr });
          return;
        }

        const lastDate = parseISO(lastVisit);
        const diff = differenceInCalendarDays(now, lastDate);

        if (diff === 1) {
          set({ streak: streak + 1, lastVisit: todayStr });
        } else if (diff > 1) {
          set({ streak: 1, lastVisit: todayStr });
        }
      },

      completeLesson: (lessonId: string) => {
        const { completedLessons, xp } = get();
        if (!completedLessons.includes(lessonId)) {
          set({ 
            completedLessons: [...completedLessons, lessonId],
            xp: xp + 10 // 10 XP per lesson
          });
        }
      },

      completeDailyChallenge: (xpReward: number) => {
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const { dailyChallengeDone, xp } = get();
        
        if (dailyChallengeDone !== todayStr) {
          set({ 
            dailyChallengeDone: todayStr,
            xp: xp + xpReward 
          });
        }
      },
    }),
    {
      name: 'ml-daily-storage',
    }
  )
);
