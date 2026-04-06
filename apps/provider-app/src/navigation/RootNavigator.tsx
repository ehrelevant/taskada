import { authClient } from '@lib/authClient';
import { LoadingView } from '@repo/components';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@repo/theme';

import { AuthStack } from './AuthStack';
import { DashboardTabs } from './DashboardTabs';

export function RootNavigator() {
  const { data: session, isPending } = authClient.useSession();
  const { colorScheme } = useTheme();

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
