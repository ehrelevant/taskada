import { KeyboardProvider } from 'react-native-keyboard-controller';
import { LoadingProvider } from '@contexts/LoadingContext';
import { queryClient } from '@lib/queryClient';
import { QueryClientProvider } from 'react-query';
import { RootNavigator } from '@navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <LoadingProvider>
            <RootNavigator />
          </LoadingProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
