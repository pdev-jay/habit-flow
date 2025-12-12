import type { Habit, HabitCheck } from '../../types/habit.types';

/**
 * useHabitDetailStats 훅 테스트용 유틸리티
 *
 * 이 파일은 실제 테스트가 아닌, 로직 검증용 참고 파일입니다.
 * 실제 테스트는 Jest + React Testing Library를 사용해야 합니다.
 */

/**
 * 테스트 케이스 1: 완료 기록이 없는 경우
 *
 * 예상 결과:
 * - currentStreak: 0
 * - totalCompletions: 0
 * - longestStreakEver: 0
 * - overallCompletionRate: 0
 */
export const testCase1_NoCompletions = (): void => {
  const habit: Habit = {
    id: '1',
    name: '물 마시기',
    icon: 'water',
    color: '#3B82F6',
    frequency: 'daily',
    reminderEnabled: false,
    createdAt: '2024-01-01',
    order: 0,
  };

  const checks: HabitCheck[] = [];

  // 예상: 모든 값 0
  console.log('Test Case 1: No Completions');
  console.log('Expected: all zeros');
};

/**
 * 테스트 케이스 2: 오늘만 완료한 경우
 *
 * 예상 결과:
 * - currentStreak: 1
 * - totalCompletions: 1
 * - longestStreakEver: 1
 * - overallCompletionRate: depends on days since creation
 */
export const testCase2_OnlyToday = (): void => {
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  const habit: Habit = {
    id: '2',
    name: '운동하기',
    icon: 'run',
    color: '#10B981',
    frequency: 'daily',
    reminderEnabled: false,
    createdAt: todayString,
    order: 0,
  };

  const checks: HabitCheck[] = [
    {
      habitId: '2',
      date: todayString,
      completed: true,
    },
  ];

  // 예상: currentStreak: 1, totalCompletions: 1, longestStreakEver: 1, overallCompletionRate: 100
  console.log('Test Case 2: Only Today');
  console.log('Expected: currentStreak=1, totalCompletions=1, longestStreakEver=1, rate=100');
};

/**
 * 테스트 케이스 3: 연속 기록이 중간에 끊긴 경우
 *
 * 날짜: 2024-01-01 ~ 2024-01-10 (10일)
 * 완료: 1/1, 1/2, 1/3, (1/4 빠짐), 1/5, 1/6
 *
 * 예상 결과:
 * - currentStreak: 2 (1/5, 1/6)
 * - totalCompletions: 5
 * - longestStreakEver: 3 (1/1, 1/2, 1/3)
 * - overallCompletionRate: 50% (5/10)
 */
export const testCase3_BrokenStreak = (): void => {
  const habit: Habit = {
    id: '3',
    name: '독서하기',
    icon: 'book-open-variant',
    color: '#F59E0B',
    frequency: 'daily',
    reminderEnabled: false,
    createdAt: '2024-01-01',
    order: 0,
  };

  const checks: HabitCheck[] = [
    { habitId: '3', date: '2024-01-01', completed: true },
    { habitId: '3', date: '2024-01-02', completed: true },
    { habitId: '3', date: '2024-01-03', completed: true },
    // 2024-01-04 빠짐
    { habitId: '3', date: '2024-01-05', completed: true },
    { habitId: '3', date: '2024-01-06', completed: true },
  ];

  // 예상: currentStreak=2, totalCompletions=5, longestStreakEver=3
  console.log('Test Case 3: Broken Streak');
  console.log('Expected: currentStreak=2, totalCompletions=5, longestStreakEver=3');
};

/**
 * 테스트 케이스 4: 평일만 활성화된 습관
 *
 * 날짜: 2024-01-01 (월) ~ 2024-01-07 (일)
 * 완료: 월, 화, 수, 목, 금 (주말 제외)
 *
 * 예상 결과:
 * - currentStreak: 5 (월~금)
 * - totalCompletions: 5
 * - longestStreakEver: 5
 * - overallCompletionRate: 100% (5/5, 주말은 카운트 안 됨)
 */
export const testCase4_Weekdays = (): void => {
  const habit: Habit = {
    id: '4',
    name: '출근 전 스트레칭',
    icon: 'yoga',
    color: '#8B5CF6',
    frequency: 'weekdays',
    reminderEnabled: false,
    createdAt: '2024-01-01', // 2024-01-01은 월요일
    order: 0,
  };

  const checks: HabitCheck[] = [
    { habitId: '4', date: '2024-01-01', completed: true }, // 월
    { habitId: '4', date: '2024-01-02', completed: true }, // 화
    { habitId: '4', date: '2024-01-03', completed: true }, // 수
    { habitId: '4', date: '2024-01-04', completed: true }, // 목
    { habitId: '4', date: '2024-01-05', completed: true }, // 금
    // 주말(토, 일)은 활성화되지 않음
  ];

  // 예상: currentStreak=5, totalCompletions=5, longestStreakEver=5, rate=100
  console.log('Test Case 4: Weekdays Only');
  console.log('Expected: currentStreak=5, totalCompletions=5, longestStreakEver=5, rate=100');
};

/**
 * 테스트 케이스 5: 커스텀 요일 (월, 수, 금)
 *
 * 날짜: 2024-01-01 (월) ~ 2024-01-07 (일)
 * 완료: 월, 수 (금요일 빠짐)
 *
 * 예상 결과:
 * - currentStreak: 0 (금요일을 빠뜨림)
 * - totalCompletions: 2
 * - longestStreakEver: 2 (월, 수)
 * - overallCompletionRate: 66% (2/3)
 */
export const testCase5_CustomDays = (): void => {
  const habit: Habit = {
    id: '5',
    name: '헬스장 가기',
    icon: 'dumbbell',
    color: '#EF4444',
    frequency: 'custom',
    customDays: [1, 3, 5], // 월, 수, 금
    reminderEnabled: false,
    createdAt: '2024-01-01',
    order: 0,
  };

  const checks: HabitCheck[] = [
    { habitId: '5', date: '2024-01-01', completed: true }, // 월
    { habitId: '5', date: '2024-01-03', completed: true }, // 수
    // 2024-01-05 (금) 빠짐
  ];

  // 예상: currentStreak=0, totalCompletions=2, longestStreakEver=2, rate=66
  console.log('Test Case 5: Custom Days (Mon, Wed, Fri)');
  console.log('Expected: currentStreak=0, totalCompletions=2, longestStreakEver=2, rate=66');
};
