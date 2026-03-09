import { KeyboardProvider } from 'react-native-keyboard-controller';
import { LoadingProvider, queryClient } from '@repo/shared';
import { QueryClientProvider } from 'react-query';
import { RootNavigator } from '@navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  // Initialize push notifications
  // TODO: Re-add Push notifications
  // usePushNotifications(API_URL);

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
