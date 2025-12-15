import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

import type { ShareAction, ShareImageResult } from '../types/share.types';

/**
 * Hook for sharing and saving images
 * Handles permissions, saving to gallery, and sharing via system share sheet
 */
export function useShareImage() {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Request media library write permission
   * @returns true if permission granted
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('권한 필요', '이미지를 저장하려면 사진 라이브러리 접근 권한이 필요합니다.', [
          { text: '확인' },
        ]);
        return false;
      }

      return true;
    } catch (error) {
      console.error('[useShareImage] Permission request failed:', error);
      return false;
    }
  }, []);

  /**
   * Save image to device gallery
   * @param uri - Image URI
   * @returns true if saved successfully
   */
  const saveToGallery = useCallback(
    async (uri: string): Promise<boolean> => {
      try {
        const hasPermission = await requestPermission();
        if (!hasPermission) return false;

        await MediaLibrary.saveToLibraryAsync(uri);
        return true;
      } catch (error) {
        console.error('[useShareImage] Save to gallery failed:', error);
        Alert.alert('저장 실패', '이미지 저장에 실패했습니다.');
        return false;
      }
    },
    [requestPermission]
  );

  /**
   * Share image via system share sheet
   * @param uri - Image URI
   * @returns true if shared successfully
   */
  const shareImage = useCallback(async (uri: string): Promise<boolean> => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('공유 불가', '이 기기에서는 공유 기능을 사용할 수 없습니다.');
        return false;
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'HabitFlow 습관 공유',
        UTI: 'public.png',
      });

      return true;
    } catch (error) {
      console.error('[useShareImage] Share failed:', error);
      Alert.alert('공유 실패', '이미지 공유에 실패했습니다.');
      return false;
    }
  }, []);

  /**
   * Execute share action (save, share, or both)
   * @param uri - Image URI
   * @param action - Share action type
   * @returns Share result
   */
  const execute = useCallback(
    async (uri: string, action: ShareAction): Promise<ShareImageResult> => {
      setIsLoading(true);

      try {
        let success = false;

        switch (action) {
          case 'save':
            success = await saveToGallery(uri);
            if (success) {
              Alert.alert('저장 완료', '이미지가 갤러리에 저장되었습니다.');
            }
            break;

          case 'share':
            success = await shareImage(uri);
            break;

          case 'both':
            const saved = await saveToGallery(uri);
            const shared = await shareImage(uri);
            success = saved || shared;
            if (saved && !shared) {
              Alert.alert('저장 완료', '이미지가 갤러리에 저장되었습니다.');
            }
            break;
        }

        return { success, uri: success ? uri : undefined };
      } catch (error) {
        console.error('[useShareImage] Execute failed:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다',
        };
      } finally {
        setIsLoading(false);
      }
    },
    [saveToGallery, shareImage]
  );

  return {
    /** Whether share operation is in progress */
    isLoading,
    /** Execute share action */
    execute,
    /** Save image to gallery */
    saveToGallery,
    /** Share image via share sheet */
    shareImage,
  };
}
