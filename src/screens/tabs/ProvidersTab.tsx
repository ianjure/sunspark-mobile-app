import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import ProviderCard from '@/src/components/ProviderCard';
import { MAIN_TEXT_COLOR } from '@/src/constants/colors';
import { FONT_INTER_BOLD, FONT_INTER_REGULAR } from '@/src/constants/fonts';
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
          <Text
            style={{
              fontFamily: FONT_INTER_REGULAR,
              marginTop: 8,
              fontSize: 16,
              textAlign: 'center',
              color: MAIN_TEXT_COLOR,
            }}
          >
            Finding solar developers...
          </Text>
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
    gap: 20,
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
});
