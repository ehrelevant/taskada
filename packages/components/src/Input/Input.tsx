import { colors } from '@repo/theme';
import { ReactNode, useId, useState } from 'react';
import { StyleProp, Text, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle } from 'react-native';

import { createStyles } from './Input.styles';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  inputContainerStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  onIconPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  inputContainerStyle,
  containerStyle,
  onIconPress,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const styles = createStyles(error, isFocused);
  const inputId = useId();
  const labelledById = `${inputId}-label`;

  const handleFocus = (...args: Parameters<NonNullable<TextInputProps['onFocus']>>) => {
    setIsFocused(true);
    rest.onFocus?.(...args);
  };

  const handleBlur = (...args: Parameters<NonNullable<TextInputProps['onBlur']>>) => {
    setIsFocused(false);
    rest.onBlur?.(...args);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label} id={labelledById}>
          {label}
        </Text>
      )}
      <View style={[styles.inputContainer, inputContainerStyle]}>
        {leftIcon && (
          <View style={styles.leftIcon} accessibilityElementsHidden>
            {leftIcon}
          </View>
        )}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textDisabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityLabel={accessibilityLabel || label}
          accessibilityHint={accessibilityHint}
          accessibilityLabelledBy={labelledById}
          accessibilityState={{ disabled: rest.editable === false }}
          testID={testID}
          {...rest}
        />
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onIconPress}
            disabled={!onIconPress}
            accessibilityLabel={rest.placeholder ? `${rest.placeholder} action` : 'Input action'}
            accessibilityRole="button"
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
        </Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}
