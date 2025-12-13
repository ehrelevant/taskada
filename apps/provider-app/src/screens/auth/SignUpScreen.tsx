import { apiFetch } from '@lib/helpers';
import { authClient } from '@lib/authClient';
import { AuthStackParamList } from '@navigation/AuthStack';
import { Button, Input, Typography } from '@repo/components';
import { colors } from '@repo/theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text } from 'react-native';
import { type Provider } from '@repo/database';
import { useLoading } from '@contexts/LoadingContext';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

type SignUpNavProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

export function SignUpScreen() {
  const navigation = useNavigation<SignUpNavProp>();

  const { setLoading } = useLoading();

  const [errorMessage, setErrorMessage] = useState('');

  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSignUp = async () => {
    setLoading(true);
    setErrorMessage('');

    console.log('Requesting...');
    const { data: newUserData, error } = await authClient.signUp.email({
      name: firstName,
      middleName,
      lastName,
      email,
      password,
      phoneNumber,
    });

    if (newUserData !== null) {
      console.log(newUserData);
    } else if (error !== null) {
      console.log(error);
      setErrorMessage(error.message ?? '');
    }

    const createProviderResponse = await apiFetch('/providers', { method: 'POST' });
    const newProviderData: Provider | null = await createProviderResponse.json();
    console.log(newProviderData)

    setLoading(false);
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer} bottomOffset={50}>
      <Input
        label="First Name*"
        placeholder="First Name"
        autoComplete="name-given"
        value={firstName}
        onChangeText={setFirstName}
      />
      <Input
        label="Middle Name"
        placeholder="Middle Name"
        autoComplete="name-middle"
        value={middleName}
        onChangeText={setMiddleName}
      />
      <Input
        label="Last Name*"
        placeholder="Last Name"
        autoComplete="name-family"
        value={lastName}
        onChangeText={setLastName}
      />
      <Input label="Email*" placeholder="Email" autoComplete="email" value={email} onChangeText={setEmail} />
      <Input
        label="Password*"
        placeholder="Password"
        autoComplete="new-password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Input label="Phone Number*" placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} />

      {errorMessage !== '' && (
        <Typography variant="body1" color={colors.error}>
          {errorMessage}
        </Typography>
      )}

      <Button title="Sign Up" onPress={handleSignUp} />

      <Pressable onPress={() => navigation.replace('SignIn')}>
        <Typography variant="subtitle1">
          Already have an account? <Text style={{ textDecorationLine: 'underline' }}>Sign In</Text>
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
