// External libraries
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Internal imports
import {
  checkAndUpdateMilestone,
  triggerAchievementNotification,
} from '@/services/notificationService';

// Relative imports
import type { HabitCheck } from '../types';
import { zustandStorage } from './storage';
import { useHabitStore } from './habitStore';
import { useSettingsStore } from './settingsStore';
import { calculateStreak } from '../utils/streakUtils';

interface HabitCheckStore {
  checks: Record<string, HabitCheck>;
  toggleCheck: (habitId: string, date: string) => void;
  getChecksByHabitId: (habitId: string) => HabitCheck[];
  getChecksByDate: (date: string) => HabitCheck[];
  deleteChecksByHabitId: (habitId: string) => void;
}

export const useHabitCheckStore = create<HabitCheckStore>()(
  persist(
    (set, get) => ({
      checks: {},

      toggleCheck: (habitId: string, date: string) => {
        set((state) => {
          const key = `${habitId}_${date}`;
          const existingCheck = state.checks[key];
          const newCompleted = existingCheck ? !existingCheck.completed : true;

          const newChecks = existingCheck
            ? {
                ...state.checks,
                [key]: {
                  ...existingCheck,
                  completed: newCompleted,
                  completedAt: newCompleted ? new Date().toISOString() : existingCheck.completedAt,
                },
              }
            : {
                ...state.checks,
                [key]: {
                  habitId,
                  date,
                  completed: true,
                  completedAt: new Date().toISOString(),
                },
              };

          // Check for achievement milestone when completing a check
          if (newCompleted) {
            const settings = useSettingsStore.getState().settings;
            if (settings.notificationsEnabled) {
              const habits = useHabitStore.getState().habits;
              const habit = habits.find((h) => h.id === habitId);

              if (habit) {
                // Get all checks for this habit
                const allChecks = Object.values(newChecks).filter((c) => c.habitId === habitId);
                const currentStreak = calculateStreak(habit, allChecks);

                // Check if a milestone was reached
                const milestone = checkAndUpdateMilestone(habitId, currentStreak);
                if (milestone) {
                  triggerAchievementNotification(habit.name, milestone).catch((error) => {
                    console.error('Failed to trigger achievement notification:', error);
                  });
                }
              }
            }
          }

          return { checks: newChecks };
        });
      },

      getChecksByHabitId: (habitId: string) => {
        const { checks } = get();
        return Object.values(checks).filter((check) => check.habitId === habitId);
      },

      getChecksByDate: (date: string) => {
        const { checks } = get();
        return Object.values(checks).filter((check) => check.date === date);
      },

      deleteChecksByHabitId: (habitId: string) => {
        set((state) => {
          const newChecks: Record<string, HabitCheck> = {};

          Object.entries(state.checks).forEach(([key, check]) => {
            if (check.habitId !== habitId) {
              newChecks[key] = check;
            }
          });

          return { checks: newChecks };
        });
      },
    }),
    {
      name: 'habit-check-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
