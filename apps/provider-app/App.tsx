import { KeyboardProvider } from 'react-native-keyboard-controller';
import { LoadingProvider, queryClient } from '@repo/shared';
import { QueryClientProvider } from '@tanstack/react-query';
import { RootNavigator } from '@navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@repo/theme';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemeProvider>
          <KeyboardProvider>
            <LoadingProvider>
              <RootNavigator />
            </LoadingProvider>
          </KeyboardProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
