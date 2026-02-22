import { apiFetch } from '@lib/helpers';
import { authClient } from '@lib/authClient';
import { AuthStackParamList } from '@navigation/AuthStack';
import { Button, Input, ScreenContainer, Typography } from '@repo/components';
import { colors } from '@repo/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, Text } from 'react-native';
import { useLoading } from '@contexts/LoadingContext';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

import { styles } from './SignInScreen.styles';

type SignInNavProp = NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;

export function SignInScreen() {
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

    console.log(userData);

    if (error !== null || userData === null) {
      console.log(error);
      setErrorMessage(error.message ?? '');
      return;
    }

    const seekerResponse = await apiFetch(`/seekers`);

    if (seekerResponse.status === 404) {
      // Means seeker does not exist, create one
      const createSeekerResponse = await apiFetch('/seekers', 'POST');
      const newSeekerData = await createSeekerResponse.json();
      console.log(newSeekerData);
    }
  });

  return (
    <ScreenContainer scrollable padding="l" style={styles.container}>
      <Typography variant="h3" weight="bold" style={styles.title}>
        Welcome Back
      </Typography>
      <Typography variant="body1" color="textSecondary" style={styles.subtitle}>
        Sign in to continue
      </Typography>

      <Input
        label="Email"
        placeholder="Enter your email"
        autoComplete="email"
        value={email}
        onChangeText={setEmail}
        containerStyle={styles.input}
      />
      <Input
        label="Password"
        placeholder="Enter your password"
        autoComplete="password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        containerStyle={styles.input}
      />

      {errorMessage !== '' && (
        <Typography variant="body2" color={colors.error.base} style={styles.error}>
          {errorMessage}
        </Typography>
      )}

      <Button title="Sign In" onPress={handleSignIn} style={styles.button} />

      <Pressable onPress={() => navigation.replace('SignUp')} style={styles.footer}>
        <Typography variant="body2" color="textSecondary">
          Don&apos;t have an account? <Text style={styles.link}>Sign Up</Text>
        </Typography>
      </Pressable>
    </ScreenContainer>
  );
}
