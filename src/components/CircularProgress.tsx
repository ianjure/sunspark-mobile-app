import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { MAIN_TEXT_COLOR } from '@/src/constants/colors';
import { FONT_INTER_BLACK, FONT_INTER_BOLD } from '@/src/constants/fonts';
import { getScoreColor } from '@/src/utils/getScoreColor';

type Props = {
  score: number;
  size?: number;
  strokeWidth?: number;
};

export default function CircularProgress({
  score,
  size = 128,
  strokeWidth = 12,
}: Props) {
  const normalizedScore = Math.max(0, Math.min(100, score));

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset =
    circumference - (normalizedScore / 100) * circumference;

  const progressColor = getScoreColor(normalizedScore);

  return (
    <View
      style={[
        styles.circularProgressWrapper,
        {
          width: size,
          height: size,
        },
      ]}
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
        <Text style={styles.scoreValue}>{normalizedScore}</Text>
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
    fontWeight: '900',
    color: MAIN_TEXT_COLOR,
  },
  scoreMax: {
    fontFamily: FONT_INTER_BOLD,
    fontSize: 12,
    fontWeight: '700',
    color: '#667085',
  },
});
