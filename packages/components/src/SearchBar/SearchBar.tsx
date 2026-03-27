import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { fontFamily, fontSize, radius, spacing, useTheme } from '@repo/theme';
import { Search } from 'lucide-react-native';
import { useState } from 'react';

import { Typography } from '../Typography';

export interface SearchBarProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  loading?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  onClear,
  containerStyle,
  loading = false,
  placeholder = 'Search services or providers...',
  ...rest
}: SearchBarProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: isFocused ? colors.borderFocus : colors.border,
          backgroundColor: colors.backgroundSecondary,
        },
        containerStyle,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.textDisabled} />
      ) : (
        <Search size={20} color={colors.textDisabled} />
      )}
      <TextInput
        style={[styles.input, { color: colors.textPrimary }]}
        placeholder={placeholder}
        placeholderTextColor={colors.textDisabled}
        value={value}
        onChangeText={onChangeText}
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
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            onChangeText('');
            onClear?.();
          }}
          hitSlop={{ top: spacing.s, bottom: spacing.s, left: spacing.s, right: spacing.s }}
        >
          <Typography variant="caption" color="textSecondary">
            Clear
          </Typography>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.m,
    paddingHorizontal: spacing.m,
  },
  input: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.m,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.s,
  },
});
