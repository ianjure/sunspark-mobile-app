import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackArrowButton from '@/src/components/icons/BackArrowButton';
import LoanCard from '@/src/components/LoanCard';
import {
  APP_BACKGROUND_COLOR,
  MAIN_TEXT_COLOR,
  MUTED_TEXT_COLOR,
} from '@/src/constants/colors';
import {
  FONT_INTER_EXTRABOLD,
  FONT_INTER_REGULAR,
  FONT_INTER_SEMIBOLD,
} from '@/src/constants/fonts';
// NOTE: adjust this import to wherever the Supabase client actually lives
// in the project (e.g. '@/src/lib/supabase').
import { supabase } from '@/src/lib/supabase';
import { RootStackParamList } from '@/src/navigation/types';
import { FinancingPartner } from '@/src/types/financer';

type Props = NativeStackScreenProps<RootStackParamList, 'QuoteScreen'>;

function formatPeso(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return 'Not available';
  }
  return `₱${Math.round(value).toLocaleString()}`;
}

export default function QuoteScreen({ navigation, route }: Props) {
  const { provider, result } = route.params;

  const [partners, setPartners] = useState<FinancingPartner[]>([]);
  const [partnersLoading, setPartnersLoading] = useState(true);
  const [partnersError, setPartnersError] = useState<string | null>(null);

  const estimatedInstallationCost =
    result.estimate?.estimated_install_cost ?? 0;

  useEffect(() => {
    let isMounted = true;

    async function fetchPartners() {
      setPartnersLoading(true);
      setPartnersError(null);

      // NOTE: adjust table/column names to match the actual schema.
      const { data, error } = await supabase
        .from('financing_partners')
        .select('*');

      if (!isMounted) return;

      if (error) {
        setPartnersError(error.message);
      } else {
        setPartners(data ?? []);
      }
      setPartnersLoading(false);
    }

    fetchPartners();

    return () => {
      isMounted = false;
    };
  }, []);

  // Only show 2 financing options, picked at random from the fetched partners.
  const displayedPartners = useMemo(() => {
    if (partners.length <= 2) return partners;
    const shuffled = [...partners].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2);
  }, [partners]);

  const handleApplyForFinancing = (partner: FinancingPartner) => {
    // TODO: hook this up to the actual application flow
    // (e.g. navigate to an application screen or open the partner's link).
    console.log('Apply for financing:', partner.product_name);
  };

  const initials = provider?.name
    ? provider.name
        .split(' ')
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase() ?? '')
        .join('')
    : '☀';

  const location = [provider?.city_municipality, provider?.province]
    .filter(Boolean)
    .join(', ');

  const recommendedSize = `${result.estimate?.recommended_system_size_kwp ?? 'N/A'} kWp`;
  const projectCost = formatPeso(result.estimate?.estimated_install_cost);
  const estimatedSavings = formatPeso(
    result.estimate?.estimated_monthly_savings,
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: APP_BACKGROUND_COLOR }}
      edges={['top', 'bottom']}
    >
      {/* Top navbar — back arrow absolutely positioned so it can't push the
          title off-center or off-baseline; both sit in a fixed-height row */}
      <View style={styles.navbar}>
        <View style={styles.backButtonContainer}>
          <BackArrowButton onPress={() => navigation.goBack()} />
        </View>
        <Text style={styles.title} numberOfLines={1}>
          Your quote is ready
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header — copied from ProviderProfileBottomSheet */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.providerName} numberOfLines={2}>
              {provider?.name}
            </Text>
            {location ? (
              <Text style={styles.providerLocation} numberOfLines={1}>
                {location}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={{ height: 20 }} />

        {/* Details section — now shows estimate data instead of contact info */}
        <View style={styles.section}>
          <Text style={styles.fieldLabel}>Recommended System Size</Text>
          <Text style={styles.fieldValue}>{recommendedSize}</Text>

          <Text style={[styles.fieldLabel, styles.fieldLabelSpaced]}>
            Project Cost
          </Text>
          <Text style={styles.fieldValue}>{projectCost}</Text>

          <Text style={[styles.fieldLabel, styles.fieldLabelSpaced]}>
            Estimated Savings
          </Text>
          <Text style={styles.fieldValue}>{estimatedSavings}</Text>
        </View>

        <View style={{ height: 25 }} />

        {/* Financing options — one LoanCard per partner from the database */}
        <Text style={styles.sectionTitle}>Financing Options</Text>

        <View style={{ height: 10 }} />

        {partnersLoading ? (
          <ActivityIndicator color={MAIN_TEXT_COLOR} />
        ) : partnersError ? (
          <Text style={styles.helperText}>
            Couldn't load financing options. Please try again later.
          </Text>
        ) : partners.length === 0 ? (
          <Text style={styles.helperText}>
            No financing options available yet.
          </Text>
        ) : (
          <View style={styles.loanCardList}>
            {displayedPartners.map((partner) => (
              <LoanCard
                key={partner.id}
                partner={partner}
                bankName={partner.bank_name}
                monthlyPayment={
                  estimatedInstallationCost * partner.monthly_payment_multiplier
                }
                onApply={handleApplyForFinancing}
                style={styles.loanCard}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  navbar: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backButtonContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  title: {
    fontFamily: FONT_INTER_EXTRABOLD,
    fontSize: 24,
    lineHeight: 28,
    color: MAIN_TEXT_COLOR,
    textAlign: 'center',
    marginTop: 22,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#1F8F2E',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontFamily: FONT_INTER_EXTRABOLD,
    fontSize: 25,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerInfo: {
    flex: 1,
  },
  providerName: {
    fontFamily: FONT_INTER_EXTRABOLD,
    fontSize: 18,
    color: MAIN_TEXT_COLOR,
    lineHeight: 22,
  },
  providerLocation: {
    fontFamily: FONT_INTER_REGULAR,
    fontSize: 12,
    color: MAIN_TEXT_COLOR,
    marginTop: 5,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D0D5DD',
    borderRadius: 20,
    padding: 15,
  },
  fieldLabel: {
    fontFamily: FONT_INTER_REGULAR,
    fontSize: 12,
    color: MAIN_TEXT_COLOR,
  },
  fieldValue: {
    fontFamily: FONT_INTER_SEMIBOLD,
    fontSize: 18,
    color: MAIN_TEXT_COLOR,
  },
  fieldLabelSpaced: {
    marginTop: 10,
  },
  sectionTitle: {
    fontFamily: FONT_INTER_EXTRABOLD,
    fontSize: 15,
    color: MAIN_TEXT_COLOR,
  },
  helperText: {
    fontFamily: FONT_INTER_REGULAR,
    fontSize: 12,
    color: MUTED_TEXT_COLOR,
  },
  loanCardList: {
    gap: 15,
  },
  loanCard: {
    marginHorizontal: 0,
  },
});
