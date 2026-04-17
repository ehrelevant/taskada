import { authClient } from '@lib/authClient';
import { LoadingView } from '@repo/components';
import { NavigationContainer } from '@react-navigation/native';
import { providerClient } from '@lib/providerClient';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useTheme } from '@repo/theme';

import { AuthStack } from './AuthStack';
import { DashboardTabs } from './DashboardTabs';

export function RootNavigator() {
  const { data: session, isPending } = authClient.useSession();
  const { colorScheme } = useTheme();

  useEffect(() => {
    let isMounted = true;

    const syncSocketSession = async () => {
      const userId = session?.user?.id;

      if (!userId) {
        providerClient.disconnectMatching();
        providerClient.disconnectChat();
        return;
      }

      try {
        await providerClient.connectMatching(authClient.getCookie(), userId, 'provider');
        await providerClient.connectChat(authClient.getCookie(), userId, 'provider');
      } catch (error) {
        if (isMounted) {
          console.error('Failed to initialize provider sockets:', error);
        }
      }
    };

    void syncSocketSession();

    return () => {
      isMounted = false;
      providerClient.disconnectMatching();
      providerClient.disconnectChat();
    };
  }, [session?.user?.id]);

  if (isPending) {
    return <LoadingView />;
  }

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <NavigationContainer>{session ? <DashboardTabs /> : <AuthStack />}</NavigationContainer>
    </>
  );
}
