import { authClient } from '@lib/authClient';
import { LoadingView } from '@repo/components';
import { NavigationContainer } from '@react-navigation/native';

import { AuthStack } from './AuthStack';
import { DashboardTabs } from './DashboardTabs';

export function RootNavigator() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <LoadingView />;
  }

  return <NavigationContainer>{session ? <DashboardTabs /> : <AuthStack />}</NavigationContainer>;
}
