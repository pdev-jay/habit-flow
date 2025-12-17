import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';
import type { Habit, CreateHabitInput } from '../types';
import {
  scheduleHabitReminders,
  cancelHabitNotifications,
  clearHabitMilestone,
} from '@/services/notificationService';

interface HabitStore {
  habits: Habit[];
  addHabit: (habit: CreateHabitInput) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  reorderHabits: (habitIds: string[]) => void;
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set) => ({
      habits: [],

      addHabit: (habitInput: CreateHabitInput) => {
        set((state) => {
          const newHabit: Habit = {
            ...habitInput,
            id: generateUUID(),
            createdAt: new Date().toISOString(),
            order: state.habits.length,
          };

          // Schedule notifications if habit reminder is enabled
          // Global setting is checked at notification delivery time
          if (newHabit.reminderEnabled) {
            scheduleHabitReminders(newHabit).catch((error) => {
              console.error('Failed to schedule habit reminders:', error);
            });
          }

          return {
            habits: [...state.habits, newHabit],
          };
        });
      },

      updateHabit: (id: string, updates: Partial<Habit>) => {
        set((state) => {
          const updatedHabits = state.habits.map((habit) =>
            habit.id === id ? { ...habit, ...updates } : habit
          );

          // Always update notifications based on habit's reminder setting
          // Global setting is checked at notification delivery time
          const updatedHabit = updatedHabits.find((h) => h.id === id);
          if (updatedHabit) {
            cancelHabitNotifications(id)
              .then(() => {
                if (updatedHabit.reminderEnabled) {
                  return scheduleHabitReminders(updatedHabit);
                }
              })
              .catch((error) => {
                console.error('Failed to update habit notifications:', error);
              });
          }

          return { habits: updatedHabits };
        });
      },

      deleteHabit: (id: string) => {
        set((state) => {
          // Cancel notifications for deleted habit
          cancelHabitNotifications(id).catch((error) => {
            console.error('Failed to cancel habit notifications:', error);
          });

          // Clear achievement milestone data
          clearHabitMilestone(id);

          const filteredHabits = state.habits.filter((habit) => habit.id !== id);
          // 삭제 후 order 재정렬
          return {
            habits: filteredHabits.map((habit, index) => ({
              ...habit,
              order: index,
            })),
          };
        });
      },

      reorderHabits: (habitIds: string[]) => {
        set((state) => {
          const habitMap = new Map(state.habits.map((h) => [h.id, h]));
          const reorderedHabits = habitIds
            .map((id) => habitMap.get(id))
            .filter((h): h is Habit => h !== undefined)
            .map((habit, index) => ({
              ...habit,
              order: index,
            }));
          return { habits: reorderedHabits };
        });
      },
    }),
    {
      name: 'habit-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

/**
 * UUID v4 생성 (간단한 구현)
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
