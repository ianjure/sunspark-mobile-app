import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { MAIN_TEXT_COLOR } from '@/src/constants/colors';
import { FONT_INTER_BLACK, FONT_INTER_BOLD } from '@/src/constants/fonts';
import { getScoreColor } from '@/src/utils/getScoreColor';

type Props = {
  score: number;
  size?: number;
  strokeWidth?: number;
  duration?: number;
};

export default function CircularProgress({
  score,
  size = 128,
  strokeWidth = 12,
  duration = 1400,
}: Props) {
  const normalizedScore = Math.max(0, Math.min(100, score));

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Animated value drives everything
  const animatedValue = useRef(new Animated.Value(0)).current;

  // JS-side state updated on every animation frame via listener
  const [displayScore, setDisplayScore] = useState(0);
  const [progressOffset, setProgressOffset] = useState(circumference);
  const [progressColor, setProgressColor] = useState(getScoreColor(0));

  useEffect(() => {
    const id = animatedValue.addListener(({ value }) => {
      setDisplayScore(Math.round(value));
      setProgressOffset(circumference - (value / 100) * circumference);
      setProgressColor(getScoreColor(value));
    });

    Animated.timing(animatedValue, {
      toValue: normalizedScore,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // must be false — we're driving JS state
    }).start();

    return () => {
      animatedValue.removeListener(id);
    };
  }, [normalizedScore]);

  return (
    <View
      style={[styles.circularProgressWrapper, { width: size, height: size }]}
    >
      <Svg width={size} height={size}>
        {/* Track */}
        <Circle
          stroke="#D0D5DD"
          fill="transparent"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <Circle
          stroke={progressColor}
          fill="transparent"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>

      <View style={styles.circularProgressTextWrapper}>
        <Text style={styles.scoreValue}>{displayScore}</Text>
        <Text style={styles.scoreMax}>/ 100</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  circularProgressWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularProgressTextWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    fontFamily: FONT_INTER_BLACK,
    fontSize: 35,
    color: MAIN_TEXT_COLOR,
  },
  scoreMax: {
    fontFamily: FONT_INTER_BOLD,
    fontSize: 12,
    color: '#667085',
  },
});
