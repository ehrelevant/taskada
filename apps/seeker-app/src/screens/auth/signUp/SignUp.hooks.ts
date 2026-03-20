import { authClient } from '@lib/authClient';
import { AuthStackParamList } from '@navigation/AuthStack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { seekerClient } from '@lib/seekerClient';
import { useLoading } from '@repo/shared';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

type SignUpNavProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

export function useSignUpScreen() {
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

    const createSeekerResponse = await seekerClient.apiFetch('/seekers', 'POST');
    const newSeekerData = await createSeekerResponse.json();
    console.log(newSeekerData);

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
