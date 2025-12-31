import { apiFetch } from '@lib/helpers';
import { authClient } from '@lib/authClient';
import { AuthStackParamList } from '@navigation/AuthStack';
import { Button, Input, Typography } from '@repo/components';
import { colors } from '@repo/theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useLoading } from '@contexts/LoadingContext';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

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
    <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
      <Input label="Email" placeholder="Email" autoComplete="email" value={email} onChangeText={setEmail} />
      <Input
        label="Password"
        placeholder="Password"
        autoComplete="new-password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {errorMessage !== '' && (
        <Typography variant="body1" color={colors.error}>
          {errorMessage}
        </Typography>
      )}

      <Button title="Sign In" onPress={handleSignIn} />

      <Pressable onPress={() => navigation.replace('SignUp')}>
        <Typography variant="subtitle1">
          Don&apos;t have an account? <Text style={{ textDecorationLine: 'underline' }}>Sign Up</Text>
        </Typography>
      </Pressable>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
  },
});
