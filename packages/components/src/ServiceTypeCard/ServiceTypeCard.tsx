import { colors, palette, radius, SERVICE_TYPE_ICONS, spacing } from '@repo/theme';
import { memo } from 'react';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

import { Typography } from '../Typography';

export interface ServiceTypeCardProps extends TouchableOpacityProps {
  name: string;
  iconUrl?: string | null;
}

export const ServiceTypeCard = memo(function ServiceTypeCard({
  name,
  iconUrl: _iconUrl,
  style,
  ...rest
}: ServiceTypeCardProps) {
  return (
    <TouchableOpacity
      style={[
        {
          width: 108,
          padding: spacing.s,
          alignItems: 'center',
          borderRadius: radius.m,
          backgroundColor: colors.background,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        },
        style,
      ]}
      {...rest}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 24,
          backgroundColor: colors.backgroundSecondary,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: spacing.xs,
        }}
      >
        {(() => {
          const IconComponent = SERVICE_TYPE_ICONS[name];
          if (IconComponent) {
            return <IconComponent size={48} color={colors.textPrimary} />;
          }
          return <View style={{ width: 64, height: 64, backgroundColor: palette.gray300, borderRadius: 14 }} />;
        })()}
      </View>
      <Typography variant="body2" color="textPrimary" align="center" weight="bold">
        {name}
      </Typography>
    </TouchableOpacity>
  );
});
