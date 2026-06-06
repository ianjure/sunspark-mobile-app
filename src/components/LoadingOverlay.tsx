import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { BLACK_COLOR, MAIN_TEXT_COLOR, SURFACE_COLOR } from '@/src/constants/colors';

type Props = {
  visible: boolean;
  message?: string;
};

export default function LoadingOverlay({ visible, message }: Props) {
  if (!visible) return null;

  return (
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color={SURFACE_COLOR} />
        {message && <Text style={styles.text}>{message}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: MAIN_TEXT_COLOR,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: 'center',
    gap: 14,
    shadowColor: BLACK_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  text: {
    color: SURFACE_COLOR,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
});
