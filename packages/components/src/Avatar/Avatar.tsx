import { colors } from '@repo/theme';
import { Image, ImageStyle, StyleProp, View } from 'react-native';

import { Typography } from '../Typography';

export interface AvatarProps {
  source?: { uri: string } | null;
  size?: number;
  name?: string;
  style?: StyleProp<ImageStyle>;
}

export function Avatar({ source, size = 40, name, style }: AvatarProps) {
  const initials = name
    ? name
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  if (source?.uri) {
    return (
      <Image
        source={source}
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.actionPrimary,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
    >
      <Typography
        variant="body2"
        color="textInverse"
        weight="semiBold"
        style={{
          fontSize: size * 0.4,
          height: size * 0.5,
          verticalAlign: 'middle',
        }}
      >
        {initials}
      </Typography>
    </View>
  );
}
