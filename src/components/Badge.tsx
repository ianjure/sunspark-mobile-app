import { StyleSheet, Text, View } from 'react-native';

import { SURFACE_COLOR } from '@/src/constants/colors';
import { FONT_NUNITO_BOLD } from '@/src/constants/fonts';

type Props = {
  label: string;
  color: string;
  textColor?: string;
  width?: number;
};

export default function Badge({
  label,
  color,
  textColor = SURFACE_COLOR,
  width,
}: Props) {
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: color },
        width ? { width } : null,
      ]}
    >
      <Text style={[styles.badgeText, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  badgeText: {
    fontFamily: FONT_NUNITO_BOLD,
    fontSize: 12,
    textAlign: 'center',
  },
});
