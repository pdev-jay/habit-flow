import '../global.css';

import { useEffect } from 'react';
import { LogBox, useColorScheme as rnUseColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';

import { useSettingsStore } from '@/features/habits/stores';

// Ignore SafeAreaView deprecation warning from expo-router
LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

export default function RootLayout() {
  const systemColorScheme = rnUseColorScheme();
  const { settings } = useSettingsStore();
  const { setColorScheme } = useColorScheme();

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
