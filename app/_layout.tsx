import { Inter_700Bold } from '@expo-google-fonts/inter';
import { Nunito_700Bold, Nunito_900Black } from '@expo-google-fonts/nunito';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { APP_BACKGROUND_COLOR } from '@/src/constants/colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_700Bold,
    Nunito_900Black,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SystemUI.setBackgroundColorAsync(APP_BACKGROUND_COLOR);
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: APP_BACKGROUND_COLOR },
        }}
      />
    </SafeAreaProvider>
  );
}
