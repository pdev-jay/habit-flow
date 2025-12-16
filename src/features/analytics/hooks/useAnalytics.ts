import { useCallback } from 'react';
import { analyticsApi } from '../api/analyticsApi';
import type { AnalyticsEventName, AnalyticsParams, UserProperties } from '../types/analytics.types';

/**
 * Analytics Hook
 * 이벤트 로깅 및 사용자 속성 관리
 */
export const useAnalytics = () => {
  /**
   * 이벤트 로깅
   */
  const logEvent = useCallback(
    async <T extends AnalyticsEventName>(
      eventName: T,
      params: AnalyticsParams[T]
    ): Promise<void> => {
      await analyticsApi.logEvent(eventName, params);
    },
    []
  );

  /**
   * 화면 뷰 로깅
   */
  const logScreenView = useCallback(
    async (screenName: string, screenClass?: string): Promise<void> => {
      await analyticsApi.logScreenView(screenName, screenClass);
    },
    []
  );

  /**
   * 사용자 속성 설정
   */
  const setUserProperties = useCallback(async (properties: UserProperties): Promise<void> => {
    await analyticsApi.setUserProperties(properties);
  }, []);

  /**
   * 사용자 ID 설정
   */
  const setUserId = useCallback(async (userId: string | null): Promise<void> => {
    await analyticsApi.setUserId(userId);
  }, []);

  /**
   * Analytics 수집 활성화/비활성화
   */
  const setAnalyticsCollectionEnabled = useCallback(async (enabled: boolean): Promise<void> => {
    await analyticsApi.setAnalyticsCollectionEnabled(enabled);
  }, []);

  /**
   * 세션 ID 가져오기
   */
  const getSessionId = useCallback(async (): Promise<number | null> => {
    return await analyticsApi.getSessionId();
  }, []);

  /**
   * 앱 인스턴스 ID 가져오기
   */
  const getAppInstanceId = useCallback(async (): Promise<string | null> => {
    return await analyticsApi.getAppInstanceId();
  }, []);

  return {
    logEvent,
    logScreenView,
    setUserProperties,
    setUserId,
    setAnalyticsCollectionEnabled,
    getSessionId,
    getAppInstanceId,
  };
};
