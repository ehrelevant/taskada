import { Button, Input, ScreenContainer, Typography } from '@repo/components';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@repo/theme';

import { createStyles } from './SignIn.styles';
import { useSignIn } from './SignIn.hooks';

export function SignInScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { email, setEmail, password, setPassword, errorMessage, handleSignIn, navigation } = useSignIn();

  return (
    <ScreenContainer keyboardAware contentPadding="m">
      <View style={styles.heroCard}>
        <Typography variant="h3" color="textInverse">
          Welcome back
        </Typography>
        <Typography variant="body1" color="textInverse">
          Sign in to discover and book trusted services.
        </Typography>
      </View>

      <View style={styles.formCard}>
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

        <Button title="Sign In" onPress={handleSignIn} />
      </View>

      <Pressable onPress={() => navigation.replace('SignUp')} style={styles.footer}>
        <Typography variant="body1" color="textSecondary">
          Don&apos;t have an account? <Text style={styles.link}>Sign Up</Text>
        </Typography>
      </Pressable>
    </ScreenContainer>
  );
}
