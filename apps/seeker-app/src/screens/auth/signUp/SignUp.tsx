import { Button, Input, Typography } from '@repo/components';
import { colors } from '@repo/theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Pressable, Text } from 'react-native';

import { styles } from './SignUp.styles';
import { useSignUp } from './SignUp.hooks';

export function SignUpScreen() {
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
  } = useSignUp();

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
        <Typography variant="body1" color={colors.error.base}>
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
