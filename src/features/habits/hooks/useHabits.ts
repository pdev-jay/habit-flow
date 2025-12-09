import { useCallback } from 'react';
import { useHabitStore } from '../stores';
import type { Habit } from '../types';

/**
 * Habits CRUD 훅
 * - Zustand 스토어를 감싸서 컴포넌트에서 사용하기 쉽게 제공
 */
export function useHabits() {
  const habits = useHabitStore((state) => state.habits);
  const addHabit = useHabitStore((state) => state.addHabit);
  const updateHabit = useHabitStore((state) => state.updateHabit);
  const deleteHabit = useHabitStore((state) => state.deleteHabit);
  const reorderHabits = useHabitStore((state) => state.reorderHabits);

  /**
   * 정렬된 습관 목록 반환 (order 기준)
   */
  const sortedHabits = useCallback(() => {
    return [...habits].sort((a, b) => a.order - b.order);
  }, [habits]);

  /**
   * 특정 ID의 습관 조회
   */
  const getHabitById = useCallback(
    (id: string): Habit | undefined => {
      return habits.find((habit) => habit.id === id);
    },
    [habits]
  );

  /**
   * 특정 날짜에 활성화된 습관 목록
   */
  const getActiveHabitsForDate = useCallback(
    (date: Date): Habit[] => {
      const dayOfWeek = date.getDay(); // 0 = 일요일, 6 = 토요일

      return sortedHabits().filter((habit) => {
        switch (habit.frequency) {
          case 'daily':
            return true;
          case 'weekdays':
            return dayOfWeek >= 1 && dayOfWeek <= 5;
          case 'weekends':
            return dayOfWeek === 0 || dayOfWeek === 6;
          case 'custom':
            return habit.customDays?.includes(dayOfWeek) ?? false;
          default:
            return false;
        }
      });
    },
    [sortedHabits]
  );

  return {
    habits: sortedHabits(),
    addHabit,
    updateHabit,
    deleteHabit,
    reorderHabits,
    getHabitById,
    getActiveHabitsForDate,
    // Aliases for frontend compatibility
    create: addHabit,
    update: updateHabit,
    remove: deleteHabit,
  };
}
