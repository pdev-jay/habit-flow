/**
 * streakUtils 테스트
 * 실제 테스트 러너 없이도 타입 안전성과 로직 검증용
 */
import { calculateStreak, calculateStreaksForHabits } from './streakUtils';
import type { Habit, HabitCheck } from '../types/habit.types';

/**
 * 테스트용 습관 생성 헬퍼
 */
function createTestHabit(overrides?: Partial<Habit>): Habit {
  return {
    id: 'test-habit',
    name: 'Test Habit',
    icon: 'water',
    color: '#3B82F6',
    frequency: 'daily',
    reminderEnabled: false,
    createdAt: '2024-01-01',
    order: 0,
    ...overrides,
  };
}

/**
 * 테스트용 체크 생성 헬퍼
 */
function createTestCheck(habitId: string, date: string, completed: boolean = true): HabitCheck {
  return {
    habitId,
    date,
    completed,
  };
}

/**
 * 어설션 헬퍼
 */
function assertEqual(actual: number, expected: number, testName: string) {
  if (actual === expected) {
    console.log(`✓ ${testName}: ${actual}`);
  } else {
    console.error(`✗ ${testName}: 예상 ${expected}, 실제 ${actual}`);
  }
}

// ===== 테스트 케이스 =====

function testDailyHabitStreak() {
  console.log('\n=== 매일 습관 (daily) 테스트 ===');

  // 케이스 1: 연속 3일 완료
  const habit1 = createTestHabit({
    frequency: 'daily',
    createdAt: '2024-01-01',
  });
  const checks1: HabitCheck[] = [
    createTestCheck('test-habit', '2024-01-10'),
    createTestCheck('test-habit', '2024-01-09'),
    createTestCheck('test-habit', '2024-01-08'),
  ];
  assertEqual(calculateStreak(habit1, checks1), 3, '연속 3일 완료');

  // 케이스 2: 중간에 하루 빠짐
  const habit2 = createTestHabit({
    frequency: 'daily',
    createdAt: '2024-01-01',
  });
  const checks2: HabitCheck[] = [
    createTestCheck('test-habit', '2024-01-10'),
    createTestCheck('test-habit', '2024-01-09'),
    // 2024-01-08 빠짐
    createTestCheck('test-habit', '2024-01-07'),
  ];
  assertEqual(calculateStreak(habit2, checks2), 2, '중간에 하루 빠지면 리셋');

  // 케이스 3: 완료 기록 없음
  const habit3 = createTestHabit({
    frequency: 'daily',
    createdAt: '2024-01-01',
  });
  assertEqual(calculateStreak(habit3, []), 0, '완료 기록 없음');
}

function testCustomDaysStreak() {
  console.log('\n=== 커스텀 요일 습관 (월/수/금) 테스트 ===');

  // 케이스 1: 월수금 연속 완료
  const habit1 = createTestHabit({
    frequency: 'custom',
    customDays: [1, 3, 5], // 월, 수, 금
    createdAt: '2024-01-01',
  });
  const checks1: HabitCheck[] = [
    createTestCheck('test-habit', '2024-01-12'), // 금
    createTestCheck('test-habit', '2024-01-10'), // 수
    createTestCheck('test-habit', '2024-01-08'), // 월
  ];
  assertEqual(calculateStreak(habit1, checks1), 3, '월수금 연속 완료');

  // 케이스 2: 비활성 요일은 건너뛰고 카운트
  const habit2 = createTestHabit({
    frequency: 'custom',
    customDays: [1, 3, 5],
    createdAt: '2024-01-01',
  });
  const checks2: HabitCheck[] = [
    createTestCheck('test-habit', '2024-01-12'), // 금 ✓
    // 2024-01-11 (목) - 비활성 요일
    createTestCheck('test-habit', '2024-01-10'), // 수 ✓
    // 2024-01-09 (화) - 비활성 요일
    createTestCheck('test-habit', '2024-01-08'), // 월 ✓
  ];
  assertEqual(calculateStreak(habit2, checks2), 3, '비활성 요일(화목) 건너뜀');

  // 케이스 3: 활성 요일을 하루라도 빠지면 리셋
  const habit3 = createTestHabit({
    frequency: 'custom',
    customDays: [1, 3, 5],
    createdAt: '2024-01-01',
  });
  const checks3: HabitCheck[] = [
    createTestCheck('test-habit', '2024-01-12'), // 금 ✓
    createTestCheck('test-habit', '2024-01-10'), // 수 ✓
    // 2024-01-08 (월) - 활성 요일인데 빠짐
    createTestCheck('test-habit', '2024-01-05'), // 금 (이전 주)
  ];
  assertEqual(calculateStreak(habit3, checks3), 2, '활성 요일을 빠지면 리셋');
}

function testWeekdaysStreak() {
  console.log('\n=== 평일 습관 (weekdays) 테스트 ===');

  // 케이스 1: 평일 연속 완료
  const habit1 = createTestHabit({
    frequency: 'weekdays',
    createdAt: '2024-01-01',
  });
  const checks1: HabitCheck[] = [
    createTestCheck('test-habit', '2024-01-12'), // 금
    createTestCheck('test-habit', '2024-01-11'), // 목
    createTestCheck('test-habit', '2024-01-10'), // 수
  ];
  assertEqual(calculateStreak(habit1, checks1), 3, '평일 연속 완료');

  // 케이스 2: 주말은 건너뛰고 카운트
  const habit2 = createTestHabit({
    frequency: 'weekdays',
    createdAt: '2024-01-01',
  });
  const checks2: HabitCheck[] = [
    createTestCheck('test-habit', '2024-01-15'), // 월
    // 2024-01-14 (일) - 비활성
    // 2024-01-13 (토) - 비활성
    createTestCheck('test-habit', '2024-01-12'), // 금
  ];
  assertEqual(calculateStreak(habit2, checks2), 2, '주말은 건너뜀');
}

function testWeekendsStreak() {
  console.log('\n=== 주말 습관 (weekends) 테스트 ===');

  const habit = createTestHabit({
    frequency: 'weekends',
    createdAt: '2024-01-01',
  });
  const checks: HabitCheck[] = [
    createTestCheck('test-habit', '2024-01-14'), // 일
    createTestCheck('test-habit', '2024-01-13'), // 토
    createTestCheck('test-habit', '2024-01-07'), // 일 (이전 주)
  ];
  assertEqual(calculateStreak(habit, checks), 3, '주말 연속 완료');
}

function testCreatedAtBoundary() {
  console.log('\n=== 습관 생성일 체크 테스트 ===');

  const habit = createTestHabit({
    frequency: 'daily',
    createdAt: '2024-01-10',
  });
  const checks: HabitCheck[] = [
    createTestCheck('test-habit', '2024-01-12'), // 생성 후
    createTestCheck('test-habit', '2024-01-11'), // 생성 후
    createTestCheck('test-habit', '2024-01-10'), // 생성일
    createTestCheck('test-habit', '2024-01-09'), // 생성 전 (무시됨)
  ];
  assertEqual(calculateStreak(habit, checks), 3, '생성일 이전은 카운트 안 함');
}

function testCompletedFalse() {
  console.log('\n=== completed: false 테스트 ===');

  const habit = createTestHabit({
    frequency: 'daily',
    createdAt: '2024-01-01',
  });
  const checks: HabitCheck[] = [
    createTestCheck('test-habit', '2024-01-12', true),
    createTestCheck('test-habit', '2024-01-11', false), // 미완료
    createTestCheck('test-habit', '2024-01-10', true),
  ];
  assertEqual(calculateStreak(habit, checks), 1, 'completed: false는 카운트 안 함');
}

function testCalculateStreaksForHabits() {
  console.log('\n=== 여러 습관 일괄 계산 테스트 ===');

  const habit1 = createTestHabit({
    id: 'habit-1',
    frequency: 'daily',
    createdAt: '2024-01-01',
  });

  const habit2 = createTestHabit({
    id: 'habit-2',
    frequency: 'custom',
    customDays: [1, 3, 5],
    createdAt: '2024-01-01',
  });

  const allChecks = {
    'habit-1': [createTestCheck('habit-1', '2024-01-12'), createTestCheck('habit-1', '2024-01-11')],
    'habit-2': [
      createTestCheck('habit-2', '2024-01-12'), // 금
      createTestCheck('habit-2', '2024-01-10'), // 수
      createTestCheck('habit-2', '2024-01-08'), // 월
    ],
  };

  const streaks = calculateStreaksForHabits([habit1, habit2], allChecks);

  assertEqual(streaks['habit-1'], 2, 'habit-1 스트릭');
  assertEqual(streaks['habit-2'], 3, 'habit-2 스트릭');

  // 체크 기록이 없는 습관
  const habit3 = createTestHabit({
    id: 'habit-3',
    frequency: 'daily',
    createdAt: '2024-01-01',
  });
  const streaks2 = calculateStreaksForHabits([habit3], {});
  assertEqual(streaks2['habit-3'], 0, '체크 기록 없는 습관');
}

// 실행 (주석 해제해서 테스트 가능)
// testDailyHabitStreak();
// testCustomDaysStreak();
// testWeekdaysStreak();
// testWeekendsStreak();
// testCreatedAtBoundary();
// testCompletedFalse();
// testCalculateStreaksForHabits();
