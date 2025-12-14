import { useRef, useCallback } from 'react';
import { captureRef } from 'react-native-view-shot';
import type { View } from 'react-native';

import type { CaptureOptions } from '../types/share.types';

/**
 * Hook for capturing component as image
 * Uses react-native-view-shot to convert View to image
 */
export function useImageCapture() {
  const viewRef = useRef<View>(null);

  /**
   * Capture the referenced view as an image
   * @param options - Capture options (format, quality, result type)
   * @returns URI of the captured image
   */
  const capture = useCallback(
    async (options?: CaptureOptions): Promise<string> => {
      if (!viewRef.current) {
        throw new Error('View reference is not set');
      }

      try {
        const uri = await captureRef(viewRef, {
          format: options?.format || 'png',
          quality: options?.quality || 1,
          result: options?.result || 'tmpfile',
        });

        return uri;
      } catch (error) {
        console.error('[useImageCapture] Capture failed:', error);
        throw new Error('이미지 캡처에 실패했습니다');
      }
    },
    []
  );

  return {
    /** Ref to attach to the View component */
    viewRef,
    /** Capture function */
    capture,
  };
}
