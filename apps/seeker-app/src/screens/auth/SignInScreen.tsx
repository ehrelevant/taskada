import { Alert, StyleSheet, View } from 'react-native';
import { authClient } from '@lib/authClient';
import { AuthStackParamList } from '@navigation/AuthStack';
import { Button, Input, Typography } from '@repo/components';
import { colors, spacing } from '@repo/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLoading } from '@contexts/LoadingContext';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

type SignInNavProp = NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;

export function SignInScreen() {
  const navigation = useNavigation<SignInNavProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { withLoading } = useLoading();

  const handleSignIn = withLoading(async () => {
    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      Alert.alert('Sign In Failed', error.message);
    }
  });

  return (
    <View style={styles.container}>
      <Typography variant="h3" style={styles.title}>
        Welcome Back!
      </Typography>

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        containerStyle={styles.input}
      />
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        containerStyle={styles.input}
      />

      <Button title="Sign In" onPress={handleSignIn} style={styles.button} />

      <Button
        title="Create an account"
        variant="text"
        onPress={() => navigation.navigate('SignUp')}
        style={styles.link}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.l,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.xl,
    color: colors.actionPrimary,
  },
  input: {
    marginBottom: spacing.m,
  },
  button: {
    marginTop: spacing.m,
  },
  link: {
    marginTop: spacing.s,
  },
});
