import { colors, radius, spacing } from '@repo/theme';
import { Search } from 'lucide-react-native';
import { StyleProp, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useState } from 'react';

import { Typography } from '../Typography';

export interface SearchBarProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  onClear,
  containerStyle,
  placeholder = 'Search services or providers...',
  ...rest
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: isFocused ? colors.borderFocus : colors.border,
          borderRadius: radius.m,
          paddingHorizontal: spacing.m,
          backgroundColor: colors.backgroundSecondary,
        },
        containerStyle,
      ]}
    >
      <Search size={20} color={colors.textDisabled} />
      <TextInput
        style={{
          flex: 1,
          paddingVertical: spacing.s,
          paddingHorizontal: spacing.s,
          fontSize: 16,
          color: colors.textPrimary,
        }}
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
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Typography variant="caption" color="textSecondary">
            Clear
          </Typography>
        </TouchableOpacity>
      )}
    </View>
  );
}