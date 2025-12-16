import crashlytics, { FirebaseCrashlyticsTypes } from '@react-native-firebase/crashlytics';
import type { ErrorContext } from '../types/analytics.types';

// Crashlytics singleton instance (v22+ modular API)
const crashlyticsInstance: FirebaseCrashlyticsTypes.Module = crashlytics();

/**
 * Crashlytics API
 * Firebase Crashlytics를 래핑하여 타입 안전성 제공
 */
export const crashlyticsApi = {
  /**
   * 에러 기록
   * @param error 에러 객체
   * @param context 추가 컨텍스트 정보
   */
  recordError: async (error: Error, context?: ErrorContext): Promise<void> => {
    try {
      // 컨텍스트 정보가 있으면 먼저 기록
      if (context) {
        const entries = Object.entries(context);
        for (const [key, value] of entries) {
          if (value !== undefined) {
            await crashlyticsInstance.setAttribute(key, String(value));
          }
        }
      }

      // 에러 기록
      await crashlyticsInstance.recordError(error);
    } catch (crashError) {
      if (__DEV__) {
        console.error('Crashlytics recordError failed:', crashError);
      }
    }
  },

  /**
   * 로그 메시지 기록
   * @param message 로그 메시지
   */
  log: async (message: string): Promise<void> => {
    try {
      await crashlyticsInstance.log(message);
    } catch (_error) {
      if (__DEV__) {
        console.error('Crashlytics log failed');
      }
    }
  },

  /**
   * 사용자 ID 설정
   * @param userId 사용자 고유 ID
   */
  setUserId: async (userId: string): Promise<void> => {
    try {
      await crashlyticsInstance.setUserId(userId);
    } catch (_error) {
      if (__DEV__) {
        console.error('Crashlytics setUserId failed');
      }
    }
  },

  /**
   * 사용자 속성 설정
   * @param key 속성 키
   * @param value 속성 값
   */
  setAttribute: async (key: string, value: string): Promise<void> => {
    try {
      await crashlyticsInstance.setAttribute(key, value);
    } catch (_error) {
      if (__DEV__) {
        console.error('Crashlytics setAttribute failed:', key);
      }
    }
  },

  /**
   * 여러 사용자 속성 설정
   * @param attributes 속성 객체
   */
  setAttributes: async (attributes: Record<string, string>): Promise<void> => {
    try {
      await crashlyticsInstance.setAttributes(attributes);
    } catch (_error) {
      if (__DEV__) {
        console.error('Crashlytics setAttributes failed');
      }
    }
  },

  /**
   * Crashlytics 수집 활성화/비활성화
   * @param enabled 활성화 여부
   */
  setCrashlyticsCollectionEnabled: async (enabled: boolean): Promise<void> => {
    try {
      await crashlyticsInstance.setCrashlyticsCollectionEnabled(enabled);
    } catch (_error) {
      if (__DEV__) {
        console.error('Crashlytics setCrashlyticsCollectionEnabled failed');
      }
    }
  },

  /**
   * 크래시 테스트 (개발 중에만 사용)
   */
  crash: (): void => {
    if (__DEV__) {
      crashlyticsInstance.crash();
    }
  },

  /**
   * Crashlytics 초기화 확인
   * @returns 초기화 여부
   */
  isCrashlyticsCollectionEnabled: async (): Promise<boolean> => {
    try {
      return crashlyticsInstance.isCrashlyticsCollectionEnabled;
    } catch (_error) {
      if (__DEV__) {
        console.error('Crashlytics isCrashlyticsCollectionEnabled failed');
      }
      return false;
    }
  },

  /**
   * Crashlytics 초기화 (앱 시작 시 호출)
   */
  initialize: async (): Promise<void> => {
    try {
      // 개발 모드에서는 자동으로 비활성화
      if (__DEV__) {
        await crashlyticsInstance.setCrashlyticsCollectionEnabled(false);
        console.log('Crashlytics disabled in development mode');
      } else {
        await crashlyticsInstance.setCrashlyticsCollectionEnabled(true);
        console.log('Crashlytics initialized');
      }
    } catch (_error) {
      if (__DEV__) {
        console.error('Crashlytics initialization failed');
      }
    }
  },
};
