import { authClient } from '@lib/authClient';
import { AuthStackParamList } from '@navigation/AuthStack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { seekerClient } from '@lib/seekerClient';
import { useLoading } from '@repo/shared';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

type SignInNavProp = NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;

export function useSignIn() {
  const navigation = useNavigation<SignInNavProp>();
  const { withLoading } = useLoading();
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = withLoading(async () => {
    setErrorMessage('');

    const { data: userData, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error !== null || userData === null) {
      setErrorMessage(error.message ?? '');
      return;
    }

    const seekerResponse = await seekerClient.apiFetch(`/seekers`);

    if (seekerResponse.status === 404) {
      await seekerClient.apiFetch('/seekers', 'POST');
    }
  });

  return {
    email,
    setEmail,
    password,
    setPassword,
    errorMessage,
    handleSignIn,
    navigation,
  };
}
