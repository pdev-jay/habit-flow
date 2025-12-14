import { useState, useEffect } from 'react';
import {
  requestNotificationPermissions,
  hasNotificationPermissions,
} from '@/services/notificationService';

export function useNotificationPermissions() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      setIsLoading(true);
      const granted = await hasNotificationPermissions();
      setHasPermission(granted);
    } catch (error) {
      console.error('Failed to check notification permission:', error);
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const granted = await requestNotificationPermissions();
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      setHasPermission(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    hasPermission,
    isLoading,
    requestPermission,
    checkPermission,
  };
}
