import { colors } from '@repo/theme';
import { ReactNode, useState } from 'react';
import { StyleProp, Text, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle } from 'react-native';

import { createStyles } from './Input.styles';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  onIconPress?: () => void;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  onIconPress,
  style,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const styles = createStyles(error, isFocused);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textDisabled}
          onFocus={e => {
            setIsFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={e => {
            setIsFocused(false);
            rest.onBlur?.(e);
          }}
          {...rest}
        />
        {rightIcon && (
          <TouchableOpacity style={styles.rightIcon} onPress={onIconPress} disabled={!onIconPress}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}
