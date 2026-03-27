import { Image, ImageSourcePropType, ImageStyle, StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '@repo/theme';

import { Typography } from '../Typography';

export interface AvatarProps {
  source?: ImageSourcePropType | null;
  size?: number;
  name?: string;
  onPress?: () => void;
  borderColor?: string;
  borderWidth?: number;
  style?: StyleProp<ViewStyle | ImageStyle>;
}

export function Avatar({ source, size = 40, name, onPress, borderColor, borderWidth = 0, style }: AvatarProps) {
  const { colors } = useTheme();
  const initials = name
    ? name
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    ...(borderColor && borderWidth > 0 ? { borderColor, borderWidth } : undefined),
  };

  const renderFallback = () => (
    <View
      style={[
        avatarStyle,
        {
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

  const renderImage = () => {
    if (source && typeof source === 'object' && 'uri' in source && source.uri) {
      return <Image source={source} style={[avatarStyle, style] as ImageStyle} />;
    }
    return renderFallback();
  };

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {renderImage()}
      </TouchableOpacity>
    );
  }

  return renderImage();
}
