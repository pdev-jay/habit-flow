import '../global.css';

import { useEffect } from 'react';
import { LogBox, useColorScheme as rnUseColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colorScheme } from 'nativewind';

import { useSettingsStore } from '@/features/habits/stores';

// Ignore SafeAreaView deprecation warning from expo-router
LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

export default function RootLayout() {
  const systemColorScheme = rnUseColorScheme();
  const { settings } = useSettingsStore();

  // Determine effective theme
  const theme = settings.theme === 'system' ? systemColorScheme : settings.theme;

  // NativeWind dark mode 동기화 - React Navigation theme context 문제 해결
  useEffect(() => {
    colorScheme.set(theme === 'dark' ? 'dark' : 'light');
  }, [theme]);

  // Set system UI colors
  useEffect(() => {
    if (theme === 'dark') {
      SystemUI.setBackgroundColorAsync('#111827'); // gray-900
    } else {
      SystemUI.setBackgroundColorAsync('#FFFFFF');
    }
  }, [theme]);

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme === 'dark' ? '#111827' : '#FFFFFF',
          },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="habit/new"
          options={{
            presentation: 'card',
            headerShown: true,
            headerTitle: '새 습관',
            headerBackTitle: '뒤로가기',
          }}
        />
        <Stack.Screen
          name="habit/[id]"
          options={{
            presentation: 'card',
            headerShown: true,
            headerTitle: '습관 편집',
            headerBackTitle: '뒤로가기',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
