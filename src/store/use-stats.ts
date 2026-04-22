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
  completeLesson: (lessonId: string, categoryId: string, lessonNumber: number) => void;
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

      completeLesson: (lessonId, categoryId, lessonNumber) => {
        const { completedLessons, xp } = get();
        
        // Always try to update formatted progress
        const categoryPrefix = `${categoryId}:`;
        const existingEntryIndex = completedLessons.findIndex(entry => 
          entry.startsWith(categoryPrefix)
        );

        const newFormattedEntry = `${categoryPrefix}${lessonNumber}`;
        const newCompletedLessons = [...completedLessons];

        let updated = false;

        if (existingEntryIndex === -1) {
          newCompletedLessons.push(newFormattedEntry);
          updated = true;
        } else {
          const parts = newCompletedLessons[existingEntryIndex].split(":");
          if (parts.length === 2) {
            const lastNum = parseInt(parts[1], 10);
            if (lessonNumber > lastNum) {
              newCompletedLessons[existingEntryIndex] = newFormattedEntry;
              updated = true;
            }
          }
        }

        if (updated) {
          set({ 
            completedLessons: newCompletedLessons,
            xp: xp + 10 
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
