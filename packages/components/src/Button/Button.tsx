import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { colors } from '@repo/theme';
import { ReactNode } from 'react';

import { createStyles } from './Button.styles';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Button({
  title,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || isLoading;
  const styles = createStyles(variant, size, isDisabled);

  const renderContent = () => {
    if (isLoading) {
      return (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'secondary' ? colors.white : colors.actionPrimary}
        />
      );
    }

    return (
      <>
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
        <Text style={styles.text}>{title}</Text>
        {rightIcon && <View style={{ marginLeft: 8 }}>{rightIcon}</View>}
      </>
    );
  };

  return (
    <TouchableOpacity activeOpacity={0.8} disabled={isDisabled} style={[styles.button, style]} {...rest}>
      {renderContent()}
    </TouchableOpacity>
  );
}
