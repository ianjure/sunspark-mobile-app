import { StyleSheet, Text, View } from 'react-native';

import {
  BORDER_COLOR,
  MUTED_TEXT_COLOR,
  SURFACE_COLOR,
} from '@/src/constants/colors';
import { FONT_INTER_REGULAR } from '@/src/constants/fonts';
import { getScoreColor } from '@/src/utils/getScoreColor';

import Badge from '@/src/components/Badge';
import CircularProgress from '@/src/components/CircularProgress';

type Props = {
  score: number;
  label: string;
};

export default function ScoreCard({ score, label }: Props) {
  const badgeColor = getScoreColor(score);

  return (
    <View style={styles.scoreCard}>
      <CircularProgress score={score} />

      <View style={styles.scoreContent}>
        <Badge label={label} color={badgeColor} />

        <Text style={styles.scoreDescription}>
          Your location, bill, roof, and solar resource data were used to create
          this first estimate.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scoreCard: {
    height: 200,
    backgroundColor: SURFACE_COLOR,
    borderWidth: 2,
    borderColor: BORDER_COLOR,
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  scoreContent: {
    flex: 1,
    gap: 8,
  },
  scoreDescription: {
    fontFamily: FONT_INTER_REGULAR,
    fontSize: 14,
    lineHeight: 19,
    color: MUTED_TEXT_COLOR,
  },
});
