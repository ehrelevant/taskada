import { authClient } from '@lib/authClient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OptionsStackParamList } from '@navigation/OptionsStack';
import { providerClient } from '@lib/providerClient';
import { useEffect, useState } from 'react';
import { useLoading } from '@repo/shared';
import { useNavigation } from '@react-navigation/native';

type OptionsNavProp = NativeStackNavigationProp<OptionsStackParamList, 'Options'>;

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
}

export function useOptionsScreen() {
  const { setLoading } = useLoading();
  const navigation = useNavigation<OptionsNavProp>();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const { data: userSession } = authClient.useSession();

  const signOut = async () => {
    setLoading(true);
    await authClient.signOut();
    setLoading(false);
  };

  useEffect(() => {
    if (userSession) {
      providerClient
        .apiFetch('/users/profile', 'GET')
        .then(res => res.json())
        .then(data => setProfile(data))
        .catch(console.error);
    }
  }, [userSession]);

  return {
    userSession,
    profile,
    signOut,
    navigation,
  };
}
