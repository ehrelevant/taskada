import { authClient } from '@lib/authClient';
import { LoadingView } from '@repo/components';
import { NavigationContainer } from '@react-navigation/native';
import { seekerClient } from '@lib/seekerClient';
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
        seekerClient.disconnectMatching();
        seekerClient.disconnectChat();
        return;
      }

      try {
        await seekerClient.connectMatching(authClient.getCookie(), userId, 'seeker');
        await seekerClient.connectChat(authClient.getCookie(), userId, 'seeker');
      } catch (error) {
        if (isMounted) {
          console.error('Failed to initialize seeker sockets:', error);
        }
      }
    };

    void syncSocketSession();

    return () => {
      isMounted = false;
      seekerClient.disconnectMatching();
      seekerClient.disconnectChat();
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
