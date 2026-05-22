import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { supabase } from '@/src/lib/supabase';
import { styles } from '@/src/styles/styles';
import { SolarDeveloper } from '@/src/types/provider';
import { SunsparkResult } from '@/src/types/sunspark';

type Props = {
  result: SunsparkResult;
};

export default function ProvidersTab({ result }: Props) {
  const [providers, setProviders] = useState<SolarDeveloper[]>([]);
  const [selectedProvider, setSelectedProvider] =
    useState<SolarDeveloper | null>(null);
  const [loading, setLoading] = useState(true);
  const [matchLevel, setMatchLevel] = useState<string>('region');
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

      if (cityOrMunicipality) {
        const cityResult = await queryProvidersByCity(cityOrMunicipality);

        if (cityResult.length > 0) {
          setProviders(cityResult);
          setMatchLevel('city / municipality');
          return;
        }
      }

      if (province) {
        const provinceResult = await queryProvidersByProvince(province);

        if (provinceResult.length > 0) {
          setProviders(provinceResult);
          setMatchLevel('province');
          return;
        }
      }

      const fallbackResult = await queryFallbackProviders();

      setProviders(fallbackResult);
      setMatchLevel('national fallback');
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

  function openEmail(email: string | null) {
    if (!email || email === 'N/A') return;

    const firstEmail = email.split('/')[0].trim();

    Linking.openURL(`mailto:${firstEmail}`);
  }

  function callProvider(phone: string | null) {
    if (!phone || phone === 'N/A') return;

    const firstPhone = phone.split('/')[0].trim();

    Linking.openURL(`tel:${firstPhone}`);
  }

  function closeModal() {
    setSelectedProvider(null);
  }

  return (
    <>
      <View style={styles.providerHeroCard}>
        <Text style={styles.providerHeroIcon}>💡</Text>

        <View style={{ flex: 1 }}>
          <Text style={styles.providerHeroTitle}>
            Solar developers near you
          </Text>
          <Text style={styles.providerHeroSubtitle}>
            Showing providers based on your location. Match level: {matchLevel}.
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterChipRow}
      >
        <View style={styles.activeFilterChip}>
          <Text style={styles.activeFilterText}>All</Text>
        </View>

        <View style={styles.filterChip}>
          <Text style={styles.filterText}>{cityOrMunicipality ?? 'City'}</Text>
        </View>

        <View style={styles.filterChip}>
          <Text style={styles.filterText}>{province ?? 'Province'}</Text>
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator />
          <Text style={styles.text}>Finding solar developers...</Text>
        </View>
      )}

      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      {!loading && providers.length === 0 && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>No providers found</Text>
          <Text style={styles.smallText}>
            We could not find a matching provider yet. Try again later.
          </Text>
        </View>
      )}

      {!loading && providers.length > 0 && (
        <View style={styles.providerList}>
          {providers.map((provider) => (
            <View key={provider.id} style={styles.providerCard}>
              <View style={styles.providerHeaderRow}>
                <View style={styles.providerLogo}>
                  <Text style={styles.providerLogoText}>☀️</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.providerNameRow}>
                    <Text style={styles.providerName}>{provider.name}</Text>
                  </View>

                  <Text style={styles.providerLocation}>
                    📍 {provider.city_municipality ?? 'Unknown city'}
                    {provider.province ? `, ${provider.province}` : ''}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.viewProfileButtonFull}
                onPress={() => setSelectedProvider(provider)}
              >
                <Text style={styles.viewProfileButtonText}>View Profile</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.protectionCard}>
        <Text style={styles.protectionIcon}>🛡️</Text>

        <View style={{ flex: 1 }}>
          <Text style={styles.protectionTitle}>Sunspark Protection</Text>
          <Text style={styles.protectionText}>
            Providers shown here come from your solar developer registry. Always
            verify final pricing, scope, and accreditation before signing.
          </Text>
        </View>
      </View>

      <Modal
        visible={selectedProvider !== null}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.providerModalCard}>
            <View style={styles.providerModalHeader}>
              <View style={styles.providerLogoLarge}>
                <Text style={styles.providerLogoTextLarge}>☀️</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.providerModalTitle}>
                  {selectedProvider?.name}
                </Text>

                <Text style={styles.providerLocation}>
                  📍 {selectedProvider?.city_municipality ?? 'Unknown city'}
                  {selectedProvider?.province
                    ? `, ${selectedProvider.province}`
                    : ''}
                </Text>
              </View>
            </View>

            <View style={styles.providerModalSection}>
              <Text style={styles.label}>Complete Address</Text>
              <Text style={styles.value}>
                {selectedProvider?.address ?? 'No address available'}
              </Text>

              <Text style={styles.label}>Contact Number</Text>
              <Text style={styles.value}>
                {selectedProvider?.contact_number ?? 'Not available'}
              </Text>

              <Text style={styles.label}>Email Address</Text>
              <Text style={styles.value}>
                {selectedProvider?.email ?? 'Not available'}
              </Text>

              <Text style={styles.label}>Region</Text>
              <Text style={styles.value}>
                {selectedProvider?.region ?? 'Not available'}
              </Text>
            </View>

            <View style={styles.providerModalActionRow}>
              <TouchableOpacity
                style={styles.providerSecondaryButton}
                onPress={() =>
                  callProvider(selectedProvider?.contact_number ?? null)
                }
              >
                <Text style={styles.providerSecondaryButtonText}>Call</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.viewProfileButton}
                onPress={() => openEmail(selectedProvider?.email ?? null)}
              >
                <Text style={styles.viewProfileButtonText}>Email</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={closeModal}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
