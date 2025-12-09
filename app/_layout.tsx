import '../global.css';

import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import * as SystemUI from 'expo-system-ui';

import { useSettingsStore } from '@/features/habits/stores';

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const { settings } = useSettingsStore();

  // Determine effective theme
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
          presentation: 'modal',
          headerShown: true,
          headerTitle: '새 습관',
          headerBackTitle: '취소',
        }}
      />
      <Stack.Screen
        name="habit/[id]"
        options={{
          presentation: 'modal',
          headerShown: true,
          headerTitle: '습관 편집',
          headerBackTitle: '취소',
        }}
      />
    </Stack>
  );
}
