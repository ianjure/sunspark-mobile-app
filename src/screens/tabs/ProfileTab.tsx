import { StyleSheet, Text, View } from 'react-native';

import PrimaryButton from '@/src/components/PrimaryButton';
import { MAIN_TEXT_COLOR } from '@/src/constants/colors';
import {
  FONT_INTER_BOLD,
  FONT_INTER_EXTRABOLD,
  FONT_INTER_REGULAR,
} from '@/src/constants/fonts';
import { SunsparkResult } from '@/src/types/sunspark';
import { formatCurrency } from '@/src/utils/formatCurrency';

import { resetOnboardingProgress } from '@/src/components/OnboardingProgressBar';

type Props = {
  result: SunsparkResult;
  resetApp: () => void;
};

function getInitials(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?';
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel} numberOfLines={1}>
        {label}
      </Text>
      <Text style={styles.infoValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

function SectionBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sectionBlock}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionDivider} />
      {children}
    </View>
  );
}

export default function ProfileTab({ result, resetApp }: Props) {
  async function handleReset() {
    resetOnboardingProgress();
    resetApp();
  }

  const displayName = result.user_name ?? 'User';
  const initials = getInitials(displayName);

  return (
    <>
      {/* Hero Profile Header */}
      <View style={styles.heroSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
        </View>
        <Text style={styles.heroName}>{displayName}</Text>
        <Text style={styles.heroType}>{result.customer_type ?? 'Unknown'}</Text>
      </View>

      {/* Unified Card */}
      <View style={styles.unifiedCard}>
        <SectionBlock title="⚡ Solar Estimate">
          <InfoRow
            label="Recommended Size"
            value={`${result.estimate?.recommended_system_size_kwp ?? 'N/A'} kWp`}
          />
          <InfoRow
            label="Monthly Solar Production"
            value={`${result.estimate?.estimated_monthly_solar_kwh ?? 'N/A'} kWh`}
          />
          <InfoRow
            label="Monthly Savings"
            value={formatCurrency(result.estimate?.estimated_monthly_savings)}
          />
          <InfoRow
            label="Annual Savings"
            value={formatCurrency(result.estimate?.estimated_annual_savings)}
          />
          <InfoRow
            label="Estimated Install Cost"
            value={formatCurrency(result.estimate?.estimated_install_cost)}
          />
          <InfoRow
            label="Est. New Monthly Bill"
            value={formatCurrency(result.estimate?.estimated_new_bill)}
          />
        </SectionBlock>

        <SectionBlock title="🧾 Bill Summary">
          <InfoRow
            label="Average Monthly Bill"
            value={formatCurrency(result.avg_monthly_bill)}
          />
          <InfoRow
            label="Average Monthly kWh"
            value={`${result.avg_monthly_kwh ?? 'Not found'} kWh`}
          />
          <InfoRow
            label="Effective Rate per kWh"
            value={formatCurrency(result.effective_rate_per_kwh)}
          />
        </SectionBlock>

        <SectionBlock title="🌤️ Solar Resource">
          <InfoRow
            label="PV Output Daily"
            value={`${result.solar?.pvout_daily?.toFixed(3) ?? 'N/A'} kWh/kWp/day`}
          />
          <InfoRow
            label="Optimal Tilt Angle"
            value={`${result.solar?.optimal_tilt_angle ?? 'N/A'}°`}
          />
          <InfoRow
            label="Coordinates"
            value={`${result.solar?.lat.toFixed(3) ?? '—'}, ${result.solar?.lon.toFixed(3) ?? '—'}`}
          />
        </SectionBlock>

        <SectionBlock title="🌿 Environmental Impact">
          <InfoRow
            label="Bill Coverage"
            value={`${result.estimate?.coverage_percentage ?? '—'}%`}
          />
          <InfoRow
            label="Payback Period"
            value={`${result.estimate?.payback_years ?? '—'} years`}
          />
          <InfoRow
            label="Annual CO₂ Reduction"
            value={`${result.estimate?.annual_co2_reduction_tons ?? '—'} tons`}
          />
        </SectionBlock>

        <SectionBlock title="📍 Location">
          <InfoRow
            label="Barangay"
            value={result.location?.barangay ?? 'Not available'}
          />
          <InfoRow
            label="City / Municipality"
            value={result.location?.city_or_municipality ?? 'Not available'}
          />
          <InfoRow
            label="Province"
            value={result.location?.province ?? 'Not available'}
          />
        </SectionBlock>

        {result.assessment_answers && (
          <SectionBlock title="🏠 Your Preferences">
            <InfoRow
              label="Home Ownership"
              value={result.assessment_answers.home_ownership ?? 'Not answered'}
            />
            <InfoRow
              label="Roof Sunlight"
              value={result.assessment_answers.sunlight ?? 'Not answered'}
            />
            <InfoRow
              label="Usable Roof Space"
              value={result.assessment_answers.roof_space ?? 'Not answered'}
            />
            <InfoRow
              label="Payment Preference"
              value={
                result.assessment_answers.payment_preference ?? 'Not answered'
              }
            />
            <InfoRow
              label="Installation Timeline"
              value={
                result.assessment_answers.installation_timeline ??
                'Not answered'
              }
            />
          </SectionBlock>
        )}
      </View>

      {/* Reset Button */}
      <PrimaryButton
        label="RESET APP"
        onPress={handleReset}
        color="#EF4444"
        shadowColor="#B91C1C"
        style={{ marginBottom: 26 }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  /* ── Hero ── */
  heroSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFC928',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5A900',
  },
  avatarInitials: {
    fontFamily: FONT_INTER_EXTRABOLD,
    fontSize: 34,
    color: MAIN_TEXT_COLOR,
    letterSpacing: 1,
  },
  heroName: {
    fontFamily: FONT_INTER_EXTRABOLD,
    fontSize: 26,
    color: MAIN_TEXT_COLOR,
    textAlign: 'center',
  },
  heroType: {
    fontFamily: FONT_INTER_REGULAR,
    fontSize: 14,
    color: MAIN_TEXT_COLOR,
    textAlign: 'center',
  },

  /* ── Unified Card ── */
  unifiedCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D0D5DD',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 10,
    marginBottom: 20,
    marginHorizontal: 20,
  },

  /* ── Section Block ── */
  sectionBlock: {
    paddingTop: 15,
    paddingBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: FONT_INTER_BOLD,
    fontSize: 15,
    color: MAIN_TEXT_COLOR,
    letterSpacing: 0.3,
  },
  sectionDivider: {
    height: 1.5,
    backgroundColor: '#D0D5DD',
    marginBottom: 4,
  },

  /* ── Info Row ── */
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontFamily: FONT_INTER_REGULAR,
    fontSize: 12,
    color: MAIN_TEXT_COLOR,
    flex: 0.5,
  },
  infoValue: {
    fontFamily: FONT_INTER_EXTRABOLD,
    fontSize: 12,
    color: MAIN_TEXT_COLOR,
    flex: 0.5,
    textAlign: 'right',
  },
});
