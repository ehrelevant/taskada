import { authClient } from '@lib/authClient';
import { AuthStackParamList } from '@navigation/AuthStack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { providerClient } from '@lib/providerClient';
import { useLoading } from '@repo/shared';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

type SignUpNavProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

export function useSignUp() {
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

    const { data: newUserData, error } = await authClient.signUp.email({
      name: firstName,
      middleName,
      lastName,
      email,
      password,
      phoneNumber,
    });

    if (newUserData !== null) {
      // success
    } else if (error !== null) {
      setErrorMessage(error.message ?? '');
    }

    await providerClient.apiFetch('/providers', 'POST');

    setLoading(false);
  };

  return {
    firstName,
    setFirstName,
    middleName,
    setMiddleName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    phoneNumber,
    setPhoneNumber,
    errorMessage,
    handleSignUp,
    navigation,
  };
}
