import { BottomSheetModal } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_BACKGROUND_COLOR, MAIN_TEXT_COLOR } from '@/src/constants/colors';
import { FONT_INTER_BOLD, FONT_INTER_REGULAR } from '@/src/constants/fonts';

import BottomTabBar, { MainTab } from '@/src/components/BottomTabBar';
import ProviderProfileBottomSheet from '@/src/components/ProviderProfileBottomSheet';
import { RootStackParamList } from '@/src/navigation/types';
import HomeTab from '@/src/screens/tabs/HomeTab';
import ProfileTab from '@/src/screens/tabs/ProfileTab';
import ProvidersTab from '@/src/screens/tabs/ProvidersTab';
import { SolarDeveloper } from '@/src/types/provider';
import { SunsparkResult } from '@/src/types/sunspark';
import { STORAGE_KEY } from '@/src/utils/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>;

export default function MainScreen({ navigation, route }: Props) {
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [result, setResult] = useState<SunsparkResult | null>(
    route.params?.result ?? null,
  );
  const [loading, setLoading] = useState(route.params?.result ? false : true);

  const [selectedProvider, setSelectedProvider] =
    useState<SolarDeveloper | null>(null);
  const profileSheetRef = useRef<BottomSheetModal>(null);
  const clearProviderTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 85 + insets.bottom;

  useEffect(() => {
    async function loadSavedResult() {
      if (route.params?.result) return;

      try {
        const savedResult = await AsyncStorage.getItem(STORAGE_KEY);

        if (!savedResult) {
          navigation.replace('Welcome');
          return;
        }

        setResult(JSON.parse(savedResult));
      } catch (error) {
        console.log('AsyncStorage load result error:', error);
        navigation.replace('Location');
      } finally {
        setLoading(false);
      }
    }

    loadSavedResult();
  }, [navigation, route.params?.result]);

  useEffect(() => {
    return () => {
      if (clearProviderTimeout.current) {
        clearTimeout(clearProviderTimeout.current);
      }
    };
  }, []);

  async function resetApp() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      navigation.replace('Welcome');
    } catch (error) {
      console.log('Reset app error:', error);
    }
  }

  function handleViewProfile(provider: SolarDeveloper) {
    if (clearProviderTimeout.current) {
      clearTimeout(clearProviderTimeout.current);
      clearProviderTimeout.current = null;
    }
    setSelectedProvider(provider);
    profileSheetRef.current?.present();
  }

  // Called by the CLOSE button — dismisses the sheet, which then triggers onDismiss
  const handleClosePressed = useCallback(() => {
    profileSheetRef.current?.dismiss();
  }, []);

  // Called by the sheet after its closing animation finishes — safe to clear state here
  const handleSheetDismiss = useCallback(() => {
    clearProviderTimeout.current = setTimeout(() => {
      setSelectedProvider(null);
    }, 300);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Loading assessment...</Text>
      </View>
    );
  }

  if (!result) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.emptyText}>No assessment found</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainShell}>
      {/* Status bar background */}
      <View style={[styles.statusBarBg, { height: insets.top }]} />

      {/* Home tab */}
      <ScrollView
        style={activeTab !== 'home' && styles.hidden}
        contentContainerStyle={[
          styles.tabContent,
          { paddingTop: 20, paddingBottom: TAB_BAR_HEIGHT },
        ]}
      >
        <HomeTab result={result} />
      </ScrollView>

      {/* Providers top bar */}
      <View
        style={[
          styles.providerTopBarSafeArea,
          activeTab !== 'providers' && styles.hidden,
        ]}
      >
        <View style={styles.providerTopBar}>
          <Text style={styles.providerTopBarTitle}>
            Solar developers near you
          </Text>
          <Text style={styles.providerTopBarSubtitle}>
            Showing providers based on your location.
          </Text>
        </View>
      </View>

      {/* Providers tab */}
      <ScrollView
        style={activeTab !== 'providers' && styles.hidden}
        contentContainerStyle={[
          styles.tabContent,
          { paddingTop: 20, paddingBottom: TAB_BAR_HEIGHT + 20 },
        ]}
      >
        <ProvidersTab result={result} onViewProfile={handleViewProfile} />
      </ScrollView>

      {/* Profile tab */}
      <ScrollView
        style={activeTab !== 'profile' && styles.hidden}
        contentContainerStyle={[
          styles.tabContent,
          { paddingTop: 10, paddingBottom: TAB_BAR_HEIGHT },
        ]}
      >
        <ProfileTab result={result} resetApp={resetApp} />
      </ScrollView>

      <BottomTabBar activeTab={activeTab} setActiveTab={setActiveTab} />

      <ProviderProfileBottomSheet
        ref={profileSheetRef}
        provider={selectedProvider}
        onClosePressed={handleClosePressed}
        onDismiss={handleSheetDismiss}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainShell: {
    flex: 1,
    backgroundColor: APP_BACKGROUND_COLOR,
  },
  statusBarBg: {
    backgroundColor: APP_BACKGROUND_COLOR,
    zIndex: 10,
  },
  hidden: {
    display: 'none',
  },
  loadingText: {
    fontFamily: FONT_INTER_REGULAR,
    fontSize: 16,
    textAlign: 'center',
    color: MAIN_TEXT_COLOR,
  },
  emptyText: {
    fontFamily: FONT_INTER_REGULAR,
    fontSize: 14,
    color: MAIN_TEXT_COLOR,
    lineHeight: 20,
    textAlign: 'center',
  },
  tabContent: {
    flexGrow: 1,
    backgroundColor: APP_BACKGROUND_COLOR,
  },
  providerTopBarSafeArea: {
    backgroundColor: APP_BACKGROUND_COLOR,
    borderBottomWidth: 2,
    borderBottomColor: '#D0D5DD',
  },
  providerTopBar: {
    height: 120,
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 4,
  },
  providerTopBarTitle: {
    fontFamily: FONT_INTER_BOLD,
    fontSize: 24,
    fontWeight: '700',
    color: MAIN_TEXT_COLOR,
  },
  providerTopBarSubtitle: {
    fontFamily: FONT_INTER_REGULAR,
    fontSize: 16,
    fontWeight: '400',
    color: MAIN_TEXT_COLOR,
  },
});
