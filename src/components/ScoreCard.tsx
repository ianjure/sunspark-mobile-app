import { StyleSheet, Text, View } from 'react-native';

import { FONT_INTER_REGULAR, FONT_NUNITO_BOLD } from '@/src/constants/fonts';
import { getScoreColor } from '@/src/utils/getScoreColor';

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
        <View style={[styles.scoreBadge, { backgroundColor: badgeColor }]}>
          <Text style={styles.scoreBadgeText}>{label}</Text>
        </View>

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
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#D0D5DD',
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
  },
  scoreBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginBottom: 8,
  },
  scoreBadgeText: {
    fontFamily: FONT_NUNITO_BOLD,
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scoreDescription: {
    fontFamily: FONT_INTER_REGULAR,
    fontSize: 14,
    lineHeight: 19,
    color: '#667085',
  },
});
