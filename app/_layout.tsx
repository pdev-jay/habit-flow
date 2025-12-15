import '../global.css';

import { useEffect, useRef } from 'react';
import { LogBox, useColorScheme as rnUseColorScheme, AppState, AppStateStatus } from 'react-native';
import { Stack } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { I18nextProvider } from 'react-i18next';
import * as Notifications from 'expo-notifications';

import { useSettingsStore } from '@/features/habits/stores';
import i18n from '@/i18n';
import { useI18n } from '@/hooks';
import { useHabitStore } from '@/features/habits/stores/habitStore';
import { rescheduleAllHabits, shouldReschedule } from '@/services/notificationService';

// Ignore SafeAreaView deprecation warning from expo-router
LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

function RootLayoutContent() {
  const systemColorScheme = rnUseColorScheme();
  const { settings } = useSettingsStore();
  const { setColorScheme } = useColorScheme();
  const { t } = useI18n();
  const notificationListener = useRef<Notifications.Subscription | undefined>(undefined);
  const responseListener = useRef<Notifications.Subscription | undefined>(undefined);
  const appState = useRef<AppStateStatus>(AppState.currentState);

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
      </Stack>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <I18nextProvider i18n={i18n}>
      <RootLayoutContent />
    </I18nextProvider>
  );
}
