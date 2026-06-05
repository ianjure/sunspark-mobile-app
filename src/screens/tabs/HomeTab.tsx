import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MAIN_TEXT_COLOR } from '@/src/constants/colors';
import {
  FONT_INTER_BLACK,
  FONT_INTER_BOLD,
  FONT_INTER_REGULAR,
  FONT_NUNITO_BOLD,
} from '@/src/constants/fonts';
import { SunsparkResult } from '@/src/types/sunspark';
import {
  calculateReadinessScore,
  getReadinessLabel,
} from '@/src/utils/calculateReadinessScore';
import { formatCurrency } from '@/src/utils/formatCurrency';

import ScoreCard from '@/src/components/ScoreCard';
import Logo from '@/src/components/icons/Logo';

type Props = {
  result: SunsparkResult;
};

function getFirstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] || fullName.trim();
}

export default function HomeTab({ result }: Props) {
  const readinessScore = useMemo(
    () => calculateReadinessScore(result),
    [result],
  );
  const readinessLabel = useMemo(
    () => getReadinessLabel(readinessScore),
    [readinessScore],
  );

  const estimatedInstallCost = useMemo(() => {
    const cost = result.estimate?.estimated_install_cost;
    if (!cost) return 'Not available';
    return formatPeso(cost);
  }, [result]);

  const paybackYears = useMemo(() => {
    const years = result.estimate?.payback_years;
    if (!years) return 'Not available';
    return `${years} years`;
  }, [result]);

  const displayName = result.user_name
    ? getFirstName(result.user_name)
    : 'there';

  return (
    <>
      <View style={styles.homeLogoRow}>
        <Logo height={28} />
      </View>

      <View style={styles.greetingSection}>
        <Text style={styles.greetingTitle}>Hello, {displayName}</Text>
        <Text style={styles.greetingSubtitle}>
          Here's your solar readiness snapshot.
        </Text>
      </View>

      <ScoreCard score={readinessScore} label={readinessLabel} />

      <View style={styles.estimateGrid}>
        <View style={styles.estimateMiniCard}>
          <Text style={styles.estimateValue}>
            {result.estimate?.recommended_system_size_kwp ?? 'N/A'} kWp
          </Text>
          <Text style={styles.estimateLabel}>RECOMMENDED SIZE</Text>
        </View>

        <View style={styles.estimateMiniCard}>
          <Text style={styles.estimateValue}>
            {formatCurrency(result.estimate?.estimated_monthly_savings)}
          </Text>
          <Text style={styles.estimateLabel}>MONTHLY SAVINGS</Text>
        </View>

        <View style={styles.estimateMiniCard}>
          <Text style={styles.estimateSmallValue}>{estimatedInstallCost}</Text>
          <Text style={styles.estimateLabel}>INSTALL COST</Text>
        </View>

        <View style={styles.estimateMiniCard}>
          <Text style={styles.estimateValue}>{paybackYears}</Text>
          <Text style={styles.estimateLabel}>PAYBACK</Text>
        </View>
      </View>
    </>
  );
}

function formatPeso(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return 'Not available';
  }

  return `₱${Math.round(value).toLocaleString()}`;
}

const styles = StyleSheet.create({
  homeLogoRow: {
    marginBottom: 30,
    alignItems: 'flex-start',
    marginHorizontal: 20,
  },
  greetingSection: {
    marginBottom: 15,
    marginHorizontal: 20,
  },
  greetingTitle: {
    fontFamily: FONT_INTER_BLACK,
    fontSize: 30,
    lineHeight: 32,
    fontWeight: '900',
    color: MAIN_TEXT_COLOR,
  },
  greetingSubtitle: {
    fontFamily: FONT_INTER_REGULAR,
    fontSize: 16,
    lineHeight: 22,
    color: MAIN_TEXT_COLOR,
    marginTop: 5,
  },
  estimateGrid: {
    width: '100%',
    marginHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  estimateMiniCard: {
    width: '48%',
    minHeight: 120,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D0D5DD',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  estimateLabel: {
    fontFamily: FONT_NUNITO_BOLD,
    fontSize: 10,
    fontWeight: '700',
    color: '#667085',
    textAlign: 'center',
  },
  estimateValue: {
    fontFamily: FONT_INTER_BOLD,
    fontSize: 25,
    fontWeight: '900',
    color: MAIN_TEXT_COLOR,
    textAlign: 'center',
  },
  estimateSmallValue: {
    fontFamily: FONT_INTER_BLACK,
    fontSize: 25,
    fontWeight: '900',
    color: MAIN_TEXT_COLOR,
    textAlign: 'center',
  },
});
