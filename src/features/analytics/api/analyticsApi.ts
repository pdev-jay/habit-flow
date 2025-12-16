import analytics, { FirebaseAnalyticsTypes } from '@react-native-firebase/analytics';
import type { AnalyticsEventName, AnalyticsParams, UserProperties } from '../types/analytics.types';

// Analytics singleton instance (v22+ modular API)
const analyticsInstance: FirebaseAnalyticsTypes.Module = analytics();

/**
 * Analytics API
 * Firebase Analytics를 래핑하여 타입 안전성 제공
 */
export const analyticsApi = {
  /**
   * 이벤트 로깅
   * @param eventName 이벤트 이름
   * @param params 이벤트 파라미터
   */
  logEvent: async <T extends AnalyticsEventName>(
    eventName: T,
    params: AnalyticsParams[T]
  ): Promise<void> => {
    try {
      await analyticsInstance.logEvent(eventName, params as Record<string, unknown>);
    } catch (_error) {
      if (__DEV__) {
        console.error('Analytics logEvent failed:', eventName);
      }
    }
  },

  /**
   * 화면 뷰 로깅 (screen_view 이벤트 사용)
   * @param screenName 화면 이름
   * @param screenClass 화면 클래스 (선택)
   */
  logScreenView: async (screenName: string, screenClass?: string): Promise<void> => {
    try {
      // logScreenView() is deprecated, use logEvent() instead
      await analyticsInstance.logEvent('screen_view', {
        screen_name: screenName,
        screen_class: screenClass || screenName,
      });
    } catch (_error) {
      if (__DEV__) {
        console.error('Analytics screen_view event failed:', screenName);
      }
    }
  },

  /**
   * 사용자 속성 설정
   * @param properties 사용자 속성
   */
  setUserProperties: async (properties: UserProperties): Promise<void> => {
    try {
      const entries = Object.entries(properties);
      for (const [key, value] of entries) {
        if (value !== undefined) {
          await analyticsInstance.setUserProperty(key, String(value));
        }
      }
    } catch (_error) {
      if (__DEV__) {
        console.error('Analytics setUserProperties failed');
      }
    }
  },

  /**
   * 사용자 ID 설정
   * @param userId 사용자 고유 ID
   */
  setUserId: async (userId: string | null): Promise<void> => {
    try {
      await analyticsInstance.setUserId(userId);
    } catch (_error) {
      if (__DEV__) {
        console.error('Analytics setUserId failed');
      }
    }
  },

  /**
   * Analytics 데이터 수집 활성화/비활성화
   * @param enabled 활성화 여부
   */
  setAnalyticsCollectionEnabled: async (enabled: boolean): Promise<void> => {
    try {
      await analyticsInstance.setAnalyticsCollectionEnabled(enabled);
    } catch (_error) {
      if (__DEV__) {
        console.error('Analytics setAnalyticsCollectionEnabled failed');
      }
    }
  },

  /**
   * 현재 세션 ID 가져오기
   * @returns 세션 ID
   */
  getSessionId: async (): Promise<number | null> => {
    try {
      return await analyticsInstance.getSessionId();
    } catch (_error) {
      if (__DEV__) {
        console.error('Analytics getSessionId failed');
      }
      return null;
    }
  },

  /**
   * 앱 인스턴스 ID 가져오기
   * @returns 앱 인스턴스 ID
   */
  getAppInstanceId: async (): Promise<string | null> => {
    try {
      return await analyticsInstance.getAppInstanceId();
    } catch (_error) {
      if (__DEV__) {
        console.error('Analytics getAppInstanceId failed');
      }
      return null;
    }
  },

  /**
   * Analytics 초기화 (앱 시작 시 호출)
   */
  initialize: async (): Promise<void> => {
    try {
      // Firebase Analytics는 자동으로 초기화됨
      // 필요시 추가 설정
      if (__DEV__) {
        console.log('Analytics initialized');
      }
    } catch (_error) {
      if (__DEV__) {
        console.error('Analytics initialization failed');
      }
    }
  },
};
