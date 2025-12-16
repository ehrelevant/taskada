import { Alert, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { authClient } from '@lib/authClient';
import { AuthStackParamList } from '@navigation/AuthStack';
import { Button, Input, Typography } from '@repo/components';
import { colors, spacing } from '@repo/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLoading } from '@contexts/LoadingContext';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

type SignUpNavProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

export function SignUpScreen() {
  const navigation = useNavigation<SignUpNavProp>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const { withLoading } = useLoading();

  const handleSignUp = withLoading(async () => {
    const { error } = await authClient.signUp.email({
      email,
      password,
      name: `${firstName} ${lastName}`,
      phoneNumber: phone,
      lastName, // Passing custom fields required by your auth schema
    });

    if (error) {
      Alert.alert('Sign Up Failed', error.message);
    } else {
      Alert.alert('Success', 'Account created successfully!');
    }
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Typography variant="h4" style={styles.title}>Create Account</Typography>

      <Input label="First Name" value={firstName} onChangeText={setFirstName} containerStyle={styles.input} />
      <Input label="Last Name" value={lastName} onChangeText={setLastName} containerStyle={styles.input} />
      <Input label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" containerStyle={styles.input} />
      <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" containerStyle={styles.input} />
      <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry containerStyle={styles.input} />

      <Button title="Sign Up" onPress={handleSignUp} style={styles.button} />

      <Pressable onPress={() => navigation.replace('SignIn')}>
        <Typography variant="subtitle1">
          Already have an account? <Text style={{ textDecorationLine: 'underline' }}>Sign In</Text>
        </Typography>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.l,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.l,
    color: colors.actionPrimary,
  },
  input: {
    marginBottom: spacing.m,
  },
  button: {
    marginTop: spacing.m,
  }
});