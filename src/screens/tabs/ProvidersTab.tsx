import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import ProviderCard from '@/src/components/ProviderCard';
import { APP_BACKGROUND_COLOR, MAIN_TEXT_COLOR } from '@/src/constants/colors';
import {
  FONT_INTER_BLACK,
  FONT_INTER_BOLD,
  FONT_INTER_EXTRABOLD,
  FONT_INTER_REGULAR,
} from '@/src/constants/fonts';
import { supabase } from '@/src/lib/supabase';
import { SolarDeveloper } from '@/src/types/provider';
import { SunsparkResult } from '@/src/types/sunspark';

type Props = {
  result: SunsparkResult;
  onViewProfile: (provider: SolarDeveloper) => void;
};

export default function ProvidersTab({ result, onViewProfile }: Props) {
  const [providers, setProviders] = useState<SolarDeveloper[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cityOrMunicipality = result.location?.city_or_municipality;
  const province = result.location?.province;

  useEffect(() => {
    fetchProviders();
  }, []);

  async function fetchProviders() {
    try {
      setLoading(true);
      setErrorMessage(null);

      let cityResult: SolarDeveloper[] = [];
      let provinceResult: SolarDeveloper[] = [];

      if (cityOrMunicipality) {
        cityResult = await queryProvidersByCity(cityOrMunicipality);
      }

      if (province) {
        provinceResult = await queryProvidersByProvince(province);
      }

      const cityProviderIds = new Set(
        cityResult.map((provider) => provider.id),
      );
      const provinceOnlyResult = provinceResult.filter(
        (provider) => !cityProviderIds.has(provider.id),
      );
      const locationMatchedProviders = [...cityResult, ...provinceOnlyResult];

      if (locationMatchedProviders.length > 0) {
        setProviders(locationMatchedProviders);
        return;
      }

      const fallbackResult = await queryFallbackProviders();
      setProviders(fallbackResult);
    } catch (error: any) {
      console.log('Fetch providers error:', error);
      setErrorMessage(error.message || 'Unable to fetch providers.');
    } finally {
      setLoading(false);
    }
  }

  async function queryProvidersByCity(city: string) {
    const { data, error } = await supabase
      .from('solar_developers')
      .select('*')
      .ilike('city_municipality', `%${city}%`)
      .limit(20);

    if (error) throw error;
    return data ?? [];
  }

  async function queryProvidersByProvince(province: string) {
    const { data, error } = await supabase
      .from('solar_developers')
      .select('*')
      .ilike('province', `%${province}%`)
      .limit(20);

    if (error) throw error;
    return data ?? [];
  }

  async function queryFallbackProviders() {
    const { data, error } = await supabase
      .from('solar_developers')
      .select('*')
      .limit(20);

    if (error) throw error;
    return data ?? [];
  }

  return (
    <>
      {loading && (
        <View>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Finding solar developers...</Text>
        </View>
      )}

      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      {!loading && providers.length === 0 && (
        <View>
          <Text style={styles.emptyTitle}>No providers found</Text>
          <Text style={styles.emptyText}>
            {'We could not find a matching provider yet.\nTry again later.'}
          </Text>
        </View>
      )}

      {!loading && providers.length > 0 && (
        <View style={styles.cardList}>
          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onViewProfile={onViewProfile}
            />
          ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  cardList: {
    gap: 15,
  },
  loadingText: {
    fontFamily: FONT_INTER_REGULAR,
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
    color: MAIN_TEXT_COLOR,
  },
  error: {
    fontFamily: FONT_INTER_REGULAR,
    color: MAIN_TEXT_COLOR,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  emptyTitle: {
    fontFamily: FONT_INTER_BOLD,
    fontSize: 18,
    fontWeight: '700',
    color: MAIN_TEXT_COLOR,
    marginTop: 20,
    textAlign: 'center',
    marginBottom: 4,
  },
  emptyText: {
    fontFamily: FONT_INTER_REGULAR,
    fontSize: 14,
    color: MAIN_TEXT_COLOR,
    lineHeight: 20,
    textAlign: 'center',
  },

  /* ── Provider Card ── */
  providerList: {
    gap: 16,
  },
  providerCard: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#d2c5ac',
    borderRadius: 18,
    padding: 16,
    gap: 14,
  },
  providerHeaderRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  providerLogo: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: '#ebe1d1',
    borderWidth: 1,
    borderColor: '#d2c5ac',
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerLogoText: {
    fontSize: 30,
  },
  providerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  providerName: {
    fontFamily: FONT_INTER_BLACK,
    fontSize: 22,
    fontWeight: '900',
    color: MAIN_TEXT_COLOR,
  },
  providerLocation: {
    fontFamily: FONT_INTER_REGULAR,
    color: MAIN_TEXT_COLOR,
    fontSize: 13,
    marginTop: 4,
  },
  providerRating: {
    fontFamily: FONT_INTER_EXTRABOLD,
    color: MAIN_TEXT_COLOR,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4,
  },
  providerReviews: {
    fontFamily: FONT_INTER_BOLD,
    color: MAIN_TEXT_COLOR,
    fontWeight: '700',
  },
  viewProfileButton: {
    flex: 1,
    backgroundColor: '#765a00',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
  },
  viewProfileButtonText: {
    fontFamily: FONT_INTER_BLACK,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  profileLinkText: {
    fontFamily: FONT_INTER_BOLD,
    fontSize: 14,
    lineHeight: 20,
    color: MAIN_TEXT_COLOR,
    fontWeight: '700',
    marginTop: 4,
  },
  providerSecondaryButton: {
    flex: 1,
    backgroundColor: '#1f7108',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
  },
  providerSecondaryButtonText: {
    fontFamily: FONT_INTER_BLACK,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  viewProfileButtonFull: {
    width: '100%',
    backgroundColor: '#765a00',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
  },

  /* ── Provider Modal ── */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  providerModalCard: {
    width: '100%',
    backgroundColor: APP_BACKGROUND_COLOR,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    borderWidth: 2,
    borderColor: '#d2c5ac',
  },
  providerModalHeader: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    marginBottom: 18,
  },
  providerLogoLarge: {
    width: 70,
    height: 70,
    borderRadius: 18,
    backgroundColor: '#ebe1d1',
    borderWidth: 1,
    borderColor: '#d2c5ac',
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerLogoTextLarge: {
    fontSize: 36,
  },
  providerModalTitle: {
    fontFamily: FONT_INTER_BLACK,
    fontSize: 26,
    fontWeight: '900',
    color: MAIN_TEXT_COLOR,
  },
  providerModalSection: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#d2c5ac',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  providerModalActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  modalCloseButton: {
    width: '100%',
    backgroundColor: '#fb3f00',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontFamily: FONT_INTER_BLACK,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
});
