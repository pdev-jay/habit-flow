/**
 * frequencyUtils 테스트
 * 실제 테스트 러너 없이도 타입 안전성과 로직 검증용
 */
import { Habit } from '../types/habit.types';
import { getFrequencyLabel, groupHabitsByWeekday, getTodayHabits } from './frequencyUtils';

// 테스트 데이터
const testHabits: Habit[] = [
  {
    id: '1',
    name: '물 마시기',
    icon: 'water',
    color: '#3B82F6',
    frequency: 'custom',
    customDays: [0, 1, 2, 3, 4, 5, 6], // 매일
    reminderEnabled: false,
    createdAt: '2025-01-01T00:00:00Z',
    order: 0,
  },
  {
    id: '2',
    name: '운동하기',
    icon: 'run',
    color: '#EF4444',
    frequency: 'custom',
    customDays: [1, 2, 3, 4, 5], // 평일
    reminderEnabled: false,
    createdAt: '2025-01-01T00:00:00Z',
    order: 1,
  },
  {
    id: '3',
    name: '독서',
    icon: 'book-open-variant',
    color: '#10B981',
    frequency: 'custom',
    customDays: [0, 6], // 주말
    reminderEnabled: false,
    createdAt: '2025-01-01T00:00:00Z',
    order: 2,
  },
  {
    id: '4',
    name: '요가',
    icon: 'yoga',
    color: '#8B5CF6',
    frequency: 'custom',
    customDays: [1, 3, 5], // 월수금
    reminderEnabled: false,
    createdAt: '2025-01-01T00:00:00Z',
    order: 3,
  },
  {
    id: '5',
    name: '명상',
    icon: 'meditation',
    color: '#F59E0B',
    frequency: 'custom',
    customDays: [1], // 월요일만
    reminderEnabled: false,
    createdAt: '2025-01-01T00:00:00Z',
    order: 4,
  },
];

// 테스트 함수들
function testGetFrequencyLabel() {
  console.log('=== getFrequencyLabel 테스트 (Korean) ===');

  const testsKo = [
    { input: [0, 1, 2, 3, 4, 5, 6], expected: '매일' },
    { input: [1, 2, 3, 4, 5], expected: '평일' },
    { input: [0, 6], expected: '주말' },
    { input: [1, 3, 5], expected: '월·수·금' },
    { input: [1], expected: '월' },
    { input: [0, 3], expected: '일·수' },
  ];

  testsKo.forEach(({ input, expected }) => {
    const result = getFrequencyLabel(input, 'ko');
    console.log(`${JSON.stringify(input)} → "${result}" (예상: "${expected}")`);
  });

  console.log('\n=== getFrequencyLabel 테스트 (English) ===');

  const testsEn = [
    { input: [0, 1, 2, 3, 4, 5, 6], expected: 'Daily' },
    { input: [1, 2, 3, 4, 5], expected: 'Weekdays' },
    { input: [0, 6], expected: 'Weekends' },
    { input: [1, 3, 5], expected: 'Mon·Wed·Fri' },
    { input: [1], expected: 'Mon' },
    { input: [0, 3], expected: 'Sun·Wed' },
  ];

  testsEn.forEach(({ input, expected }) => {
    const result = getFrequencyLabel(input, 'en');
    console.log(`${JSON.stringify(input)} → "${result}" (expected: "${expected}")`);
  });
}

function testGroupHabitsByWeekday() {
  console.log('\n=== groupHabitsByWeekday 테스트 (Korean) ===');

  const groupsKo = groupHabitsByWeekday(testHabits, 'ko');

  console.log(`총 ${groupsKo.length}개 그룹 생성됨\n`);

  groupsKo.forEach((group) => {
    console.log(`[${group.weekday}]`);
    console.log(`  습관 수: ${group.habits.length}개`);
    group.habits.forEach((habit) => {
      console.log(`  - ${habit.name} (${getFrequencyLabel(habit.customDays || [], 'ko')})`);
    });
    console.log('');
  });

  console.log('\n=== groupHabitsByWeekday 테스트 (English) ===');

  const groupsEn = groupHabitsByWeekday(testHabits, 'en');

  console.log(`Total ${groupsEn.length} groups created\n`);

  groupsEn.forEach((group) => {
    console.log(`[${group.weekday}]`);
    console.log(`  Habits: ${group.habits.length}`);
    group.habits.forEach((habit) => {
      console.log(`  - ${habit.name} (${getFrequencyLabel(habit.customDays || [], 'en')})`);
    });
    console.log('');
  });
}

function testGetTodayHabits() {
  console.log('=== getTodayHabits 테스트 ===');

  const todayHabits = getTodayHabits(testHabits);
  const todayName = ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()];

  console.log(`오늘(${todayName}요일)의 습관: ${todayHabits.length}개`);
  todayHabits.forEach((habit) => {
    console.log(`  - ${habit.name}`);
  });
}

// 실행 (주석 해제해서 테스트 가능)
// testGetFrequencyLabel();
// testGroupHabitsByWeekday();
// testGetTodayHabits();
