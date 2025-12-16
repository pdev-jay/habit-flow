import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Pressable } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import Constants from 'expo-constants';

import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * Catches unhandled errors and reports them to Crashlytics
 * Shows fallback UI when errors occur
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);

    // Report to Crashlytics (only in production)
    const isDev = __DEV__ || Constants.appOwnership === 'expo';
    if (!isDev) {
      crashlytics().recordError(error);
      crashlytics().log(`Error boundary caught: ${error.message}`);
      crashlytics().setAttribute('componentStack', errorInfo.componentStack || 'N/A');
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center bg-white px-6 dark:bg-gray-900">
          <View className="items-center">
            <Text className="mb-4 text-6xl">⚠️</Text>
            <Text className="mb-2 text-center text-2xl font-bold text-gray-900 dark:text-white">
              문제가 발생했습니다
            </Text>
            <Text className="mb-8 text-center text-base text-gray-600 dark:text-gray-400">
              앱을 다시 시작해주세요
            </Text>

            {__DEV__ && this.state.error && (
              <View className="mb-6 w-full rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                <Text className="font-mono text-sm text-red-600 dark:text-red-400">
                  {this.state.error.message}
                </Text>
              </View>
            )}

            <Pressable
              onPress={this.handleReset}
              className={cn(
                'h-12 rounded-lg bg-blue-500 px-6 active:bg-blue-600',
                'min-w-[200px] items-center justify-center'
              )}>
              <Text className="text-base font-semibold text-white">다시 시도</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
