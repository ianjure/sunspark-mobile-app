import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
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
import { RootStackParamList } from '@/src/navigation/types';
import HomeTab from '@/src/screens/tabs/HomeTab';
import ProfileTab from '@/src/screens/tabs/ProfileTab';
import ProvidersTab from '@/src/screens/tabs/ProvidersTab';
import { styles } from '@/src/styles/styles';
import { SunsparkResult } from '@/src/types/sunspark';
import { STORAGE_KEY } from '@/src/utils/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>;

export default function MainScreen({ navigation, route }: Props) {
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [result, setResult] = useState<SunsparkResult | null>(
    route.params?.result ?? null,
  );
  const [loading, setLoading] = useState(route.params?.result ? false : true);

  // Always call hooks at the top level, before any early returns
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 85 + insets.bottom;
  const TOP_CONTENT_PADDING =
    activeTab === 'providers'
      ? 20
      : insets.top + (activeTab === 'home' ? 34 : 16);

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

  async function resetApp() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      navigation.replace('Welcome');
    } catch (error) {
      console.log('Reset app error:', error);
    }
  }

  if (loading) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Loading Assessment</Text>
        <ActivityIndicator style={{ marginTop: 16 }} />
      </View>
    );
  }

  if (!result) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>No assessment found</Text>
      </View>
    );
  }

  return (
    <View style={screenStyles.mainShell}>
      {activeTab === 'providers' && (
        <View
          style={[
            screenStyles.providerTopBarSafeArea,
            { paddingTop: insets.top },
          ]}
        >
          <View style={screenStyles.providerTopBar}>
            <Text style={screenStyles.providerTopBarTitle}>
              Solar developers near you
            </Text>
            <Text style={screenStyles.providerTopBarSubtitle}>
              Showing providers based on your location.
            </Text>
          </View>
        </View>
      )}

      <ScrollView
        contentContainerStyle={[
          screenStyles.tabContent,
          {
            paddingTop: TOP_CONTENT_PADDING,
            paddingBottom: TAB_BAR_HEIGHT + 16,
          },
        ]}
      >
        {activeTab === 'home' && <HomeTab result={result} />}
        {activeTab === 'providers' && <ProvidersTab result={result} />}
        {activeTab === 'profile' && (
          <ProfileTab result={result} resetApp={resetApp} />
        )}
      </ScrollView>

      <BottomTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </View>
  );
}

const screenStyles = StyleSheet.create({
  mainShell: {
    flex: 1,
    backgroundColor: APP_BACKGROUND_COLOR,
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
