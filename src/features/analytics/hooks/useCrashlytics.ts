import { useCallback } from 'react';
import { crashlyticsApi } from '../api/crashlyticsApi';
import type { ErrorContext } from '../types/analytics.types';

/**
 * Crashlytics Hook
 * 에러 리포팅 및 로깅
 */
export const useCrashlytics = () => {
  /**
   * 에러 기록
   */
  const recordError = useCallback(async (error: Error, context?: ErrorContext): Promise<void> => {
    await crashlyticsApi.recordError(error, context);
  }, []);

  /**
   * 로그 메시지 기록
   */
  const log = useCallback(async (message: string): Promise<void> => {
    await crashlyticsApi.log(message);
  }, []);

  /**
   * 사용자 ID 설정
   */
  const setUserId = useCallback(async (userId: string): Promise<void> => {
    await crashlyticsApi.setUserId(userId);
  }, []);

  /**
   * 사용자 속성 설정
   */
  const setAttribute = useCallback(async (key: string, value: string): Promise<void> => {
    await crashlyticsApi.setAttribute(key, value);
  }, []);

  /**
   * 여러 사용자 속성 설정
   */
  const setAttributes = useCallback(async (attributes: Record<string, string>): Promise<void> => {
    await crashlyticsApi.setAttributes(attributes);
  }, []);

  /**
   * Crashlytics 수집 활성화/비활성화
   */
  const setCrashlyticsCollectionEnabled = useCallback(async (enabled: boolean): Promise<void> => {
    await crashlyticsApi.setCrashlyticsCollectionEnabled(enabled);
  }, []);

  /**
   * Crashlytics 수집 활성화 상태 확인
   */
  const isCrashlyticsCollectionEnabled = useCallback(async (): Promise<boolean> => {
    return await crashlyticsApi.isCrashlyticsCollectionEnabled();
  }, []);

  /**
   * 크래시 테스트 (개발 중에만 사용)
   */
  const crash = useCallback((): void => {
    crashlyticsApi.crash();
  }, []);

  return {
    recordError,
    log,
    setUserId,
    setAttribute,
    setAttributes,
    setCrashlyticsCollectionEnabled,
    isCrashlyticsCollectionEnabled,
    crash,
  };
};
