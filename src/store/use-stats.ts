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
  checkAndAwardBadges: () => void;
}

const BADGES_CONFIG = {
  FIRST_STEP: 'First Step',
  GETTING_STARTED: 'Getting Started',
  DEDICATED: 'Dedicated Learner',
  STREAK_3: '3-Day Streak',
  STREAK_7: 'Week Warrior',
};

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
        
        get().checkAndAwardBadges();
      },

      completeLesson: (lessonId: string) => {
        const { completedLessons, xp } = get();
        if (!completedLessons.includes(lessonId)) {
          set({ 
            completedLessons: [...completedLessons, lessonId],
            xp: xp + 10 // 10 XP per lesson
          });
          get().checkAndAwardBadges();
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

      checkAndAwardBadges: () => {
        const { completedLessons, streak, badges } = get();
        const newBadges = new Set(badges);
        let changed = false;

        const checkAward = (condition: boolean, badgeName: string) => {
          if (condition && !newBadges.has(badgeName)) {
            newBadges.add(badgeName);
            changed = true;
          }
        };

        checkAward(completedLessons.length >= 1, BADGES_CONFIG.FIRST_STEP);
        checkAward(completedLessons.length >= 5, BADGES_CONFIG.GETTING_STARTED);
        checkAward(completedLessons.length >= 10, BADGES_CONFIG.DEDICATED);
        checkAward(streak >= 3, BADGES_CONFIG.STREAK_3);
        checkAward(streak >= 7, BADGES_CONFIG.STREAK_7);

        if (changed) {
          set({ badges: Array.from(newBadges) });
        }
      }
    }),
    {
      name: 'ml-daily-storage',
    }
  )
);
