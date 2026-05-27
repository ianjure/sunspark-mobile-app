import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

import AppTopBar from '@/src/components/AppTopBar';
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
    <View style={styles.mainShell}>
      <AppTopBar />

      <ScrollView contentContainerStyle={styles.tabContent}>
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
