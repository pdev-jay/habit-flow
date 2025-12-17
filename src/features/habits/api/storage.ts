import { createMMKV } from 'react-native-mmkv';

/**
 * MMKV 스토리지 인스턴스
 * - 로컬 데이터 저장에 사용
 * - AsyncStorage보다 빠르고 동기적
 */
export const storage = createMMKV({
  id: 'routimeter-storage',
});

/**
 * Zustand persist middleware용 스토리지 어댑터
 */
export const zustandStorage = {
  setItem: (name: string, value: string) => {
    return storage.set(name, value);
  },
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    return storage.remove(name);
  },
};
