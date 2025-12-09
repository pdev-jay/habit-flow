import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';
import type { HabitCheck } from '../types';

interface HabitCheckStore {
  checks: Record<string, HabitCheck>;
  toggleCheck: (habitId: string, date: string) => void;
  getChecksByHabitId: (habitId: string) => HabitCheck[];
  getChecksByDate: (date: string) => HabitCheck[];
}

export const useHabitCheckStore = create<HabitCheckStore>()(
  persist(
    (set, get) => ({
      checks: {},

      toggleCheck: (habitId: string, date: string) => {
        set((state) => {
          const key = `${habitId}_${date}`;
          const existingCheck = state.checks[key];

          if (existingCheck) {
            // 기존 체크가 있으면 completed 토글
            return {
              checks: {
                ...state.checks,
                [key]: {
                  ...existingCheck,
                  completed: !existingCheck.completed,
                },
              },
            };
          } else {
            // 새로운 체크 생성
            return {
              checks: {
                ...state.checks,
                [key]: {
                  habitId,
                  date,
                  completed: true,
                },
              },
            };
          }
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
    }),
    {
      name: 'habit-check-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
