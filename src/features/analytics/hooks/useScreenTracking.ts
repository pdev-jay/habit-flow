import { useEffect, useRef } from 'react';
import { usePathname, useSegments } from 'expo-router';
import { analyticsApi } from '../api/analyticsApi';

/**
 * Screen Tracking Hook
 * Expo Router와 통합하여 자동으로 화면 전환 추적
 */
export const useScreenTracking = () => {
  const pathname = usePathname();
  const segments = useSegments();
  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    // 같은 경로면 무시
    if (pathname === previousPathname.current) {
      return;
    }

    // 화면 이름 생성
    const screenName = getScreenName(pathname, segments);

    // 디버깅 로그 (개발 모드에서만)
    if (__DEV__) {
      console.log('[Analytics] Screen view:', {
        pathname,
        segments,
        screenName,
      });
    }

    // Analytics에 화면 뷰 기록
    if (screenName) {
      analyticsApi.logScreenView(screenName, screenName);
    }

    // 이전 경로 저장
    previousPathname.current = pathname;
  }, [pathname, segments]);
};

/**
 * 경로에서 화면 이름 추출
 * @param pathname 현재 경로
 * @param segments 경로 세그먼트
 * @returns 화면 이름
 */
const getScreenName = (pathname: string, segments: string[]): string => {
  // 세그먼트가 비어있거나 루트 경로면 홈 화면
  if (segments.length === 0 || pathname === '/') {
    return 'Home';
  }

  // 괄호로 감싸진 그룹은 제거 (e.g., (tabs), (auth))
  // index도 제거
  const cleanSegments = segments.filter(
    (segment) =>
      !(segment.startsWith('(') && segment.endsWith(')')) &&
      segment !== 'index' &&
      segment !== '_sitemap'
  );

  // 세그먼트를 조합하여 화면 이름 생성
  if (cleanSegments.length > 0) {
    return cleanSegments
      .map((segment) => {
        // [id] 같은 동적 세그먼트 처리
        if (segment.startsWith('[') && segment.endsWith(']')) {
          return segment.slice(1, -1).charAt(0).toUpperCase() + segment.slice(2, -1);
        }
        return segment.charAt(0).toUpperCase() + segment.slice(1);
      })
      .join('_');
  }

  // pathname에서 추출 (마지막 시도)
  const pathParts = pathname
    .split('/')
    .filter((part) => part && part !== 'index');

  if (pathParts.length > 0) {
    return pathParts
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('_');
  }

  return 'Home'; // Unknown 대신 Home으로
};
