import { Button, Input, ScreenContainer, Typography } from '@repo/components';
import { colors } from '@repo/theme';
import { Pressable, Text } from 'react-native';

import { styles } from './SignIn.styles';
import { useSignInScreen } from './SignIn.hooks';

export function SignInScreen() {
  const { email, setEmail, password, setPassword, errorMessage, handleSignIn, navigation } = useSignInScreen();

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
