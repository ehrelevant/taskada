import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { colors } from '@repo/theme';
import { ReactNode } from 'react';

import { createStyles } from './Button.styles';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  accessibilityLabel?: string;
  testID?: string;
  fullWidth?: boolean;
  loadingText?: string;
}

export function Button({
  title,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  accessibilityLabel,
  testID,
  fullWidth = false,
  loadingText = 'Loading...',
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || isLoading;
  const styles = createStyles(variant, size, isDisabled);

  const getLoadingColor = () => {
    if (variant === 'primary' || variant === 'secondary') return colors.white;
    if (variant === 'danger') return colors.error.base;
    return colors.actionPrimary;
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={getLoadingColor()} />
          {loadingText && loadingText !== 'Loading...' && <Text style={styles.loadingText}>{loadingText}</Text>}
        </View>
      );
    }

    return (
      <>
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
        <Text style={styles.text}>{title}</Text>
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      style={[styles.button, fullWidth && styles.fullWidth, style]}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      testID={testID}
      {...rest}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}
