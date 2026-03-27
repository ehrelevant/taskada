import { Button, Input, Typography } from '@repo/components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@repo/theme';

import { createStyles } from './SignUp.styles';
import { useSignUpScreen } from './SignUp.hooks';

export function SignUpScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const {
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
  } = useSignUpScreen();

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer} bottomOffset={50}>
      <View style={styles.heroCard}>
        <Typography variant="h3" color="textInverse">
          Create your account
        </Typography>
        <Typography variant="body1" color="textInverse" style={styles.heroSubtitle}>
          Join the platform and start receiving service requests.
        </Typography>
      </View>

      <View style={styles.formCard}>
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
        <Input
          label="Phone Number*"
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        {errorMessage !== '' && (
          <Typography variant="body1" color={colors.error.base} style={styles.errorText}>
            {errorMessage}
          </Typography>
        )}

        <Button title="Sign Up" onPress={handleSignUp} />
      </View>

      <Pressable onPress={() => navigation.replace('SignIn')} style={styles.footer}>
        <Typography variant="body1" color="textSecondary">
          Already have an account? <Text style={styles.link}>Sign In</Text>
        </Typography>
      </Pressable>
    </KeyboardAwareScrollView>
  );
}
