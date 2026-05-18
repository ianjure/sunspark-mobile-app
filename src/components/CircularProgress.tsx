import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { styles } from "@/src/styles/styles";

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
        <Circle
          stroke="#ebe1d1"
          fill="transparent"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        <Circle
          stroke="#006e1b"
          fill="transparent"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>

      <View style={styles.circularProgressTextWrapper}>
        <Text style={styles.scoreValue}>{normalizedScore}</Text>
        <Text style={styles.scoreMax}>/ 100</Text>
      </View>
    </View>
  );
}