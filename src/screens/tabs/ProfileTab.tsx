import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { APP_BACKGROUND_COLOR } from '@/src/constants/colors';
import { SunsparkResult } from '@/src/types/sunspark';
import { formatCurrency } from '@/src/utils/formatCurrency';

type Props = {
  result: SunsparkResult;
  resetApp: () => void;
};

function getInitials(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?';
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function InfoRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <View style={profileStyles.infoRow}>
      <Text style={profileStyles.infoLabel}>{label}</Text>
      <Text
        style={[
          profileStyles.infoValue,
          accent && profileStyles.infoValueAccent,
        ]}
        numberOfLines={2}
      >
        {value}
      </Text>
    </View>
  );
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <View style={profileStyles.sectionCard}>
      <View style={profileStyles.sectionHeader}>
        <Text style={profileStyles.sectionIcon}>{icon}</Text>
        <Text style={profileStyles.sectionTitle}>{title}</Text>
      </View>
      <View style={profileStyles.sectionDivider} />
      {children}
    </View>
  );
}

export default function ProfileTab({ result, resetApp }: Props) {
  const displayName = result.user_name ?? 'User';
  const initials = getInitials(displayName);
  const firstName = displayName.trim().split(/\s+/)[0];

  return (
    <>
      {/* Hero Profile Header */}
      <View style={profileStyles.heroSection}>
        <View style={profileStyles.avatarContainer}>
          <View style={profileStyles.avatarRing}>
            <View style={profileStyles.avatar}>
              <Text style={profileStyles.avatarInitials}>{initials}</Text>
            </View>
          </View>
          <View style={profileStyles.solarBadge}>
            <Text style={profileStyles.solarBadgeText}>☀️</Text>
          </View>
        </View>
        <Text style={profileStyles.heroName}>{displayName}</Text>
        <View style={profileStyles.heroBadge}>
          <Text style={profileStyles.heroBadgeText}>
            Solar Assessment Complete
          </Text>
        </View>
        <Text style={profileStyles.heroLocation}>
          📍 {result.location?.city_or_municipality ?? 'Unknown'},{' '}
          {result.location?.province ?? 'Philippines'}
        </Text>
      </View>

      {/* Quick Stats Row */}
      <View style={profileStyles.statsRow}>
        <View style={profileStyles.statCard}>
          <Text style={profileStyles.statValue}>
            {result.estimate?.coverage_percentage ?? '—'}%
          </Text>
          <Text style={profileStyles.statLabel}>Coverage</Text>
        </View>
        <View style={[profileStyles.statCard, profileStyles.statCardMiddle]}>
          <Text style={profileStyles.statValue}>
            {result.estimate?.payback_years ?? '—'}yr
          </Text>
          <Text style={profileStyles.statLabel}>Payback</Text>
        </View>
        <View style={profileStyles.statCard}>
          <Text style={profileStyles.statValue}>
            {result.estimate?.annual_co2_reduction_tons ?? '—'}t
          </Text>
          <Text style={profileStyles.statLabel}>CO₂/yr</Text>
        </View>
      </View>

      {/* Solar Estimate */}
      <SectionCard title="Solar Estimate" icon="⚡">
        <InfoRow
          label="Recommended System Size"
          value={`${result.estimate?.recommended_system_size_kwp ?? 'N/A'} kWp`}
          accent
        />
        <InfoRow
          label="Monthly Solar Production"
          value={`${result.estimate?.estimated_monthly_solar_kwh ?? 'N/A'} kWh`}
        />
        <InfoRow
          label="Monthly Savings"
          value={formatCurrency(result.estimate?.estimated_monthly_savings)}
          accent
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
          label="Estimated New Monthly Bill"
          value={formatCurrency(result.estimate?.estimated_new_bill)}
          accent
        />
      </SectionCard>

      {/* Bill Summary */}
      <SectionCard title="Bill Summary" icon="🧾">
        <InfoRow
          label="Monthly Bill"
          value={formatCurrency(result.monthly_bill)}
          accent
        />
        <InfoRow
          label="Monthly kWh Usage"
          value={`${result.kwh_usage ?? 'Not found'} kWh`}
        />
        <InfoRow
          label="Effective Rate per kWh"
          value={formatCurrency(result.effective_rate_per_kwh)}
        />
      </SectionCard>

      {/* Solar Resource */}
      <SectionCard title="Solar Resource" icon="🌤️">
        <InfoRow
          label="PV Output Daily"
          value={`${result.solar?.pvout_daily ?? 'N/A'} kWh/kWp/day`}
          accent
        />
        <InfoRow
          label="Optimal Tilt Angle"
          value={`${result.solar?.optimal_tilt_angle ?? 'N/A'}°`}
        />
        <InfoRow
          label="Coordinates"
          value={`${result.solar?.lat ?? '—'}, ${result.solar?.lon ?? '—'}`}
        />
      </SectionCard>

      {/* Location */}
      <SectionCard title="Location" icon="📍">
        <InfoRow
          label="Barangay"
          value={result.location?.barangay ?? 'Not available'}
        />
        <InfoRow
          label="City / Municipality"
          value={result.location?.city_or_municipality ?? 'Not available'}
          accent
        />
        <InfoRow
          label="Province"
          value={result.location?.province ?? 'Not available'}
        />
      </SectionCard>

      {/* Preferences */}
      {result.assessment_answers && (
        <SectionCard title="Your Preferences" icon="🏠">
          <InfoRow
            label="Home Ownership"
            value={result.assessment_answers.home_ownership ?? 'Not answered'}
          />
          <InfoRow
            label="Roof Sunlight"
            value={result.assessment_answers.sunlight ?? 'Not answered'}
            accent
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
              result.assessment_answers.installation_timeline ?? 'Not answered'
            }
            accent
          />
        </SectionCard>
      )}

      {/* Reset Button */}
      <TouchableOpacity
        style={profileStyles.resetButton}
        onPress={resetApp}
        activeOpacity={0.8}
      >
        <Text style={profileStyles.resetIcon}>🔄</Text>
        <Text style={profileStyles.resetButtonText}>
          Reset App / Start Over
        </Text>
      </TouchableOpacity>

      <View style={{ height: 8 }} />
    </>
  );
}

const profileStyles = StyleSheet.create({
  /* ── Hero ── */
  heroSection: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 14,
  },
  avatarRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffc928',
    padding: 3,
    shadowColor: '#765a00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  avatar: {
    flex: 1,
    borderRadius: 50,
    backgroundColor: APP_BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#d2c5ac',
  },
  avatarInitials: {
    fontSize: 34,
    fontWeight: '900',
    color: '#765a00',
    letterSpacing: 1,
  },
  solarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: APP_BACKGROUND_COLOR,
    borderWidth: 2,
    borderColor: '#d2c5ac',
    alignItems: 'center',
    justifyContent: 'center',
  },
  solarBadgeText: {
    fontSize: 16,
  },
  heroName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#201b11',
    marginBottom: 6,
    textAlign: 'center',
  },
  heroBadge: {
    backgroundColor: '#8efc6e',
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginBottom: 8,
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#177500',
  },
  heroLocation: {
    fontSize: 13,
    fontWeight: '700',
    color: '#807660',
    textAlign: 'center',
  },

  /* ── Stats Row ── */
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#d2c5ac',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statCardMiddle: {
    backgroundColor: '#ffc928',
    borderColor: '#d9a400',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#201b11',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4e4633',
  },

  /* ── Section Card ── */
  sectionCard: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#d2c5ac',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#201b11',
    letterSpacing: 0.3,
  },
  sectionDivider: {
    height: 1.5,
    backgroundColor: '#ebe1d1',
    marginBottom: 4,
  },

  /* ── Info Row ── */
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#f0e8d8',
    gap: 12,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#807660',
    flex: 1,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#201b11',
    flex: 1.2,
    textAlign: 'right',
  },
  infoValueAccent: {
    color: '#765a00',
  },
  linkText: {
    color: '#765a00',
    fontSize: 11,
    textDecorationLine: 'underline',
  },

  /* ── Reset ── */
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fee2e2',
    borderWidth: 2,
    borderColor: '#fca5a5',
    paddingVertical: 15,
    borderRadius: 16,
    marginTop: 4,
    marginBottom: 16,
  },
  resetIcon: {
    fontSize: 16,
  },
  resetButtonText: {
    color: '#991b1b',
    fontSize: 15,
    fontWeight: '800',
  },
});
