import { StyleSheet, Text, View } from 'react-native';

import { MAIN_TEXT_COLOR } from '@/src/constants/colors';
import { FONT_INTER_BLACK, FONT_INTER_REGULAR } from '@/src/constants/fonts';
import { SunsparkResult } from '@/src/types/sunspark';

import EstimateMiniCard from '@/src/components/EstimateMiniCard';
import InstallationCostIcon from '@/src/components/icons/InstallationCostIcon';
import Logo from '@/src/components/icons/Logo';
import MonthlySavingsIcon from '@/src/components/icons/MonthlySavingsIcon';
import PaybackIcon from '@/src/components/icons/PaybackIcon';
import RecommendedSizeIcon from '@/src/components/icons/RecommendedSizeIcon';
import ScoreCard from '@/src/components/ScoreCard';

type Props = {
  result: SunsparkResult;
};

function getFirstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] || fullName.trim();
}

export default function HomeTab({ result }: Props) {
  const readinessScore = result.readiness_score;
  const readinessLabel = result.readiness_label;

  const estimatedRecommendedSize = `${result.estimate?.recommended_system_size_kwp ?? 'N/A'} kWp`;
  const estimatedMonthlySavings = formatPeso(
    result.estimate?.estimated_monthly_savings,
  );
  const estimatedInstallCost = formatPeso(
    result.estimate?.estimated_install_cost,
  );
  const estimatedPaybackYears = result.estimate?.payback_years
    ? `${result.estimate.payback_years} years`
    : 'Not available';

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
          {"Here's your solar readiness snapshot."}
        </Text>
      </View>

      <ScoreCard score={readinessScore} label={readinessLabel} />

      <View style={styles.estimateGrid}>
        <EstimateMiniCard
          icon={<RecommendedSizeIcon height={40} />}
          value={estimatedRecommendedSize}
          label="RECOMMENDED SIZE"
          tooltip="The ideal solar panel system size for your home based on your energy usage and roof space."
        />
        <EstimateMiniCard
          icon={<MonthlySavingsIcon height={40} />}
          value={estimatedMonthlySavings}
          label="MONTHLY SAVINGS"
          tooltip="Estimated reduction in your monthly electricity bill after switching to solar."
        />
        <EstimateMiniCard
          icon={<InstallationCostIcon height={40} />}
          value={estimatedInstallCost}
          label="INSTALLATION COST"
          tooltip="Approximate total cost to purchase and install the recommended solar system."
        />
        <EstimateMiniCard
          icon={<PaybackIcon height={40} />}
          value={estimatedPaybackYears}
          label="PAYBACK PERIOD"
          tooltip="How long it takes for your monthly savings to fully cover the installation cost."
        />
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
    marginHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
