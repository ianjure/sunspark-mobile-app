import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { styles } from '@/src/styles/styles';
import { SunsparkResult } from '@/src/types/sunspark';
import { formatCurrency } from '@/src/utils/formatCurrency';

import CircularProgress from '@/src/components/CircularProgress';
import Logo from '@/src/components/icons/Logo';

type Props = {
  result: SunsparkResult;
};

function getFirstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] || fullName.trim();
}

export default function HomeTab({ result }: Props) {
  const readinessScore = useMemo(() => {
    let score = 60;

    const coverage = result.estimate?.coverage_percentage ?? 0;
    const pvoutDaily = result.solar?.pvout_daily ?? 0;
    const roofSpace = result.assessment_answers?.roof_space;
    const sunlight = result.assessment_answers?.sunlight;

    if (coverage >= 70) score += 10;
    if (pvoutDaily >= 4) score += 10;

    if (sunlight === 'Mostly sunny') score += 10;
    if (sunlight === 'Partially shaded') score += 5;
    if (sunlight === 'Heavily shaded') score -= 5;

    if (roofSpace === 'Large') score += 10;
    if (roofSpace === 'Medium') score += 5;
    if (roofSpace === 'Small') score -= 5;

    return Math.max(0, Math.min(100, score));
  }, [result]);

  const readinessLabel = useMemo(() => {
    if (readinessScore >= 80) return 'Great fit for solar';
    if (readinessScore >= 60) return 'Good fit for solar';
    return 'Needs more review';
  }, [readinessScore]);

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
          Here&apos;s your solar readiness snapshot.
        </Text>
      </View>

      <View style={styles.scoreCard}>
        <CircularProgress score={readinessScore} />

        <View style={styles.scoreContent}>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreBadgeText}>✓ {readinessLabel}</Text>
          </View>

          <Text style={styles.scoreDescription}>
            Your bill, location, roof answers, and solar resource data were used
            to create this first estimate.
          </Text>
        </View>
      </View>

      <View style={styles.estimateGrid}>
        <View style={styles.estimateMiniCard}>
          <Text style={styles.estimateIcon}>⚡</Text>
          <Text style={styles.estimateLabel}>Recommended size</Text>
          <Text style={styles.estimateValue}>
            {result.estimate?.recommended_system_size_kwp ?? 'N/A'} kWp
          </Text>
        </View>

        <View style={styles.estimateMiniCard}>
          <Text style={styles.estimateIcon}>💰</Text>
          <Text style={styles.estimateLabel}>Monthly savings</Text>
          <Text style={styles.estimateValue}>
            {formatCurrency(result.estimate?.estimated_monthly_savings)}
          </Text>
        </View>

        <View style={styles.estimateMiniCard}>
          <Text style={styles.estimateIcon}>🏷️</Text>
          <Text style={styles.estimateLabel}>Install cost</Text>
          <Text style={styles.estimateSmallValue}>{estimatedInstallCost}</Text>
        </View>

        <View style={styles.estimateMiniCard}>
          <Text style={styles.estimateIcon}>📅</Text>
          <Text style={styles.estimateLabel}>Payback</Text>
          <Text style={styles.estimateValue}>{paybackYears}</Text>
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
