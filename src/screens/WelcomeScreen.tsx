import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Logo from '@/src/components/Logo';
import PrimaryButton from '@/src/components/PrimaryButton';
import SecondaryButton from '@/src/components/SecondaryButton';
import { APP_BACKGROUND_COLOR, MAIN_TEXT_COLOR } from '@/src/constants/colors';
import { FONT_INTER_BOLD, FONT_INTER_REGULAR } from '@/src/constants/fonts';
import { RootStackParamList } from '@/src/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={welcomeStyles.screen} edges={['top', 'bottom']}>
      {/* Top Bar with Logo */}
      <View style={welcomeStyles.topBar}>
        <Logo height={34} />
      </View>

      {/* Hero Section */}
      <View style={welcomeStyles.heroSection}>
        <Text style={welcomeStyles.heroTitle}>Welcome to Sunspark!</Text>
        <Text style={welcomeStyles.heroSubtitle}>
          Your simple way to explore solar and save more.
        </Text>
      </View>

      {/* Bottom Button Area */}
      <PrimaryButton
        label="GET STARTED"
        onPress={() => navigation.replace('Location')}
      />
      <View style={{ height: 16 }} />
      <SecondaryButton
        label="I ALREADY HAVE AN ACCOUNT"
        onPress={() => navigation.replace('Main')}
      />
    </SafeAreaView>
  );
}

const welcomeStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: APP_BACKGROUND_COLOR,
  },
  topBar: {
    paddingTop: 40,
    alignItems: 'center',
  },
  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  heroEmoji: {
    fontSize: 80,
    marginBottom: 8,
  },
  heroTitle: {
    fontFamily: FONT_INTER_BOLD,
    fontSize: 26,
    color: MAIN_TEXT_COLOR,
    textAlign: 'center',
    lineHeight: 34,
  },
  heroSubtitle: {
    fontFamily: FONT_INTER_REGULAR,
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 70,
  },
});
