import '../global.css';

import { useEffect, useRef, useState, useCallback } from 'react';
import { LogBox, useColorScheme as rnUseColorScheme, AppState, AppStateStatus } from 'react-native';
import { Stack } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { I18nextProvider } from 'react-i18next';
import * as Notifications from 'expo-notifications';
import crashlytics from '@react-native-firebase/crashlytics';
import Constants from 'expo-constants';
import mobileAds from 'react-native-google-mobile-ads';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

import { useSettingsStore } from '@/features/habits/api';
import i18n from '@/i18n';
import { useI18n } from '@/hooks';
import { useHabitStore } from '@/features/habits/api/habitStore';
import { rescheduleAllHabits, shouldReschedule } from '@/services/notificationService';
import { useScreenTracking } from '@/features/analytics/hooks/useScreenTracking';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { initializeDummyData } from '@/utils/dummyData';
import '@/utils/forceDummyData'; // Global function registration

// Crashlytics singleton instance (v22+ modular API)
const crashlyticsInstance = crashlytics();

// Ignore deprecation warnings
LogBox.ignoreLogs([
  'SafeAreaView has been deprecated',
  'This method is deprecated', // Firebase v22 migration warnings
  'React Native Firebase', // All Firebase deprecation warnings
]);

function RootLayoutContent() {
  const systemColorScheme = rnUseColorScheme();
  const { settings } = useSettingsStore();
  const { setColorScheme } = useColorScheme();
  const { t } = useI18n();
  const notificationListener = useRef<Notifications.Subscription | undefined>(undefined);
  const responseListener = useRef<Notifications.Subscription | undefined>(undefined);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const [appIsReady, setAppIsReady] = useState(false);

  // Initialize screen tracking
  useScreenTracking();

  // Initialize Crashlytics (disabled in development)
  useEffect(() => {
    const initCrashlytics = async () => {
      try {
        const isDev = __DEV__ || Constants.appOwnership === 'expo';
        await crashlyticsInstance.setCrashlyticsCollectionEnabled(!isDev);

        if (!isDev) {
          console.log('[Crashlytics] Enabled for production');
        } else {
          console.log('[Crashlytics] Disabled in development mode');
        }
      } catch (error) {
        console.error('[Crashlytics] Initialization failed:', error);
      }
    };

    initCrashlytics();
  }, []);

  // Initialize AdMob
  useEffect(() => {
    const initAdMob = async () => {
      try {
        await mobileAds().initialize();
        if (__DEV__) {
          console.log('[AdMob] Initialized successfully');
        }
      } catch (error) {
        console.error('[AdMob] Initialization failed:', error);
      }
    };

    initAdMob();
  }, []);

  // Initialize Dummy Data (dev mode only)
  useEffect(() => {
    const initDummyData = async () => {
      try {
        await initializeDummyData();
      } catch (error) {
        console.error('[DummyData] Initialization failed:', error);
        // Error is handled gracefully, app continues to run
      }
    };

    initDummyData();
  }, []);

  // NativeWind dark mode 동기화
  useEffect(() => {
    if (settings.theme === 'system') {
      setColorScheme('system');
    } else {
      setColorScheme(settings.theme as 'light' | 'dark');
    }
  }, [settings.theme, setColorScheme]);

  // Determine effective theme for UI
  const theme = settings.theme === 'system' ? systemColorScheme : settings.theme;

  // Set system UI colors
  useEffect(() => {
    if (theme === 'dark') {
      SystemUI.setBackgroundColorAsync('#111827'); // gray-900
    } else {
      SystemUI.setBackgroundColorAsync('#FFFFFF');
    }
  }, [theme]);

  // Notification listeners: foreground and user interactions
  useEffect(() => {
    // Listen for notifications while app is in foreground
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('[App] Notification received:', notification);
    });

    // Listen for user interactions with notifications
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('[App] Notification tapped:', response);

      // Log analytics when user taps notification
      const data = response.notification.request.content.data;
      if (data?.type === 'HABIT_REMINDER' && data?.habitId) {
        import('@/features/analytics/api/analyticsApi').then(({ analyticsApi }) => {
          analyticsApi.logEvent('reminder_triggered', {
            habit_id: String(data.habitId),
          });
        });
      }

      // Navigation logic can be added here based on notification data
      // Example: if (response.notification.request.content.data.type === 'HABIT_REMINDER') { ... }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  // App state change listener for rescheduling notifications
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App came to foreground
        console.log('[App] App foregrounded');

        const settings = useSettingsStore.getState().settings;
        const habits = useHabitStore.getState().habits;

        if (settings.notificationsEnabled && shouldReschedule()) {
          console.log('[App] Rescheduling notifications');
          await rescheduleAllHabits(habits);
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Prepare app and hide splash screen when ready
  useEffect(() => {
    async function prepare() {
      try {
        // Wait for minimum splash screen display time (1.5 seconds)
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // Hide splash screen with fade animation when app is ready
  useEffect(() => {
    if (appIsReady) {
      const hideSplash = async () => {
        // Small delay to ensure UI is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        // This will trigger native fade out animation
        await SplashScreen.hideAsync();
      };
      hideSplash();
    }
  }, [appIsReady]);

  // Don't render anything until app is ready
  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme === 'dark' ? '#111827' : '#FFFFFF',
          },
          headerStyle: {
            backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
          },
          headerTintColor: theme === 'dark' ? '#60A5FA' : '#3B82F6',
          headerTitleStyle: {
            color: theme === 'dark' ? '#FFFFFF' : '#000000',
          },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="habit/new"
          options={{
            presentation: 'card',
            headerShown: true,
            headerTitle: t('navigation:screens.newHabit'),
            headerBackTitle: t('common:back'),
          }}
        />
        <Stack.Screen
          name="habit/[id]/index"
          options={{
            presentation: 'card',
            headerShown: true,
            headerTitle: t('navigation:screens.habitDetail'),
            headerBackTitle: t('common:back'),
          }}
        />
        <Stack.Screen
          name="habit/[id]/edit"
          options={{
            presentation: 'card',
            headerShown: true,
            headerTitle: t('navigation:screens.editHabit'),
            headerBackTitle: t('common:back'),
          }}
        />
        <Stack.Screen
          name="share"
          options={{
            presentation: 'card',
            headerShown: true,
            headerTitle: t('common:share'),
            headerBackTitle: t('common:back'),
          }}
        />
        <Stack.Screen
          name="analytics"
          options={{
            presentation: 'card',
            headerShown: true,
            headerTitle: t('navigation:screens.detailedAnalytics'),
            headerBackTitle: t('common:back'),
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <RootLayoutContent />
      </I18nextProvider>
    </ErrorBoundary>
  );
}
