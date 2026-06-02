import { StyleSheet, Text, View } from 'react-native';

import { MAIN_TEXT_COLOR } from '@/src/constants/colors';
import { FONT_INTER_BOLD, FONT_INTER_REGULAR } from '@/src/constants/fonts';

type Props = {
  title: string;
  subtitle: string;
};

export default function OnboardingHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONT_INTER_BOLD,
    fontSize: 24,
    lineHeight: 24 * 1.3,
    color: MAIN_TEXT_COLOR,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONT_INTER_REGULAR,
    fontSize: 14,
    lineHeight: 14 * 1.5,
    color: MAIN_TEXT_COLOR,
    textAlign: 'center',
  },
});
