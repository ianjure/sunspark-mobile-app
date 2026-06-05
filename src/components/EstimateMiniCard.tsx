import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import TooltipIcon from '@/src/components/icons/TooltipIcon';
import { MAIN_TEXT_COLOR } from '@/src/constants/colors';
import {
  FONT_INTER_BLACK,
  FONT_INTER_BOLD,
  FONT_INTER_REGULAR,
  FONT_NUNITO_BOLD,
} from '@/src/constants/fonts';

type Props = {
  icon: React.ReactNode;
  value: string;
  label: string;
  tooltip: string;
  smallValue?: boolean;
};

const DURATION = 160;
const CARD_HEIGHT = 140;

export default function EstimateMiniCard({
  icon,
  value,
  label,
  tooltip,
  smallValue = false,
}: Props) {
  const [showBack, setShowBack] = useState(false);
  const scaleX = useRef(new Animated.Value(1)).current;

  function flip(toBack: boolean) {
    Animated.timing(scaleX, {
      toValue: 0,
      duration: DURATION,
      useNativeDriver: false,
    }).start(() => {
      setShowBack(toBack);
      Animated.timing(scaleX, {
        toValue: 1,
        duration: DURATION,
        useNativeDriver: false,
      }).start();
    });
  }

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.card,
          showBack && styles.cardBack,
          { transform: [{ scaleX }] },
        ]}
      >
        {showBack ? (
          <Pressable style={styles.backFace} onPress={() => flip(false)}>
            <Text style={styles.backBody}>{tooltip}</Text>
          </Pressable>
        ) : (
          <>
            <View style={styles.tooltipWrapper}>
              <Pressable
                onPress={() => flip(true)}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel={`More info about ${label}`}
              >
                <TooltipIcon height={15} />
              </Pressable>
            </View>
            {icon}
            <View style={{ height: 5 }} />
            <Text style={smallValue ? styles.smallValue : styles.value}>
              {value}
            </Text>
            <Text style={styles.label}>{label}</Text>
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Wrapper owns the fixed space in the grid — never changes size
  wrapper: {
    width: '48%',
    height: CARD_HEIGHT,
  },
  // Card fills the wrapper absolutely so it can't push anything around
  card: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D0D5DD',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBack: {
    backgroundColor: '#667085',
    borderColor: '#667085',
  },
  tooltipWrapper: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  value: {
    fontFamily: FONT_INTER_BOLD,
    fontSize: 25,
    fontWeight: '900',
    color: MAIN_TEXT_COLOR,
    textAlign: 'center',
  },
  smallValue: {
    fontFamily: FONT_INTER_BLACK,
    fontSize: 25,
    fontWeight: '900',
    color: MAIN_TEXT_COLOR,
    textAlign: 'center',
  },
  label: {
    fontFamily: FONT_NUNITO_BOLD,
    fontSize: 10,
    fontWeight: '700',
    color: '#667085',
    textAlign: 'center',
  },
  backFace: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBody: {
    fontFamily: FONT_INTER_REGULAR,
    fontSize: 12,
    lineHeight: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
});
