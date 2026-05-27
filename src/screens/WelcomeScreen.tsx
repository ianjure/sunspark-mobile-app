import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import Logo from '@/src/components/Logo';
import PrimaryButton from '@/src/components/PrimaryButton';
import SecondaryButton from '@/src/components/SecondaryButton';
import { RootStackParamList } from '@/src/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={welcomeStyles.screen}>
      {/* Top Bar with Logo */}
      <View style={welcomeStyles.topBar}>
        <Logo width={150} height={25} />
      </View>

      {/* Hero Section */}
      <View style={welcomeStyles.heroSection}>
        <Text style={welcomeStyles.heroEmoji}>☀️</Text>
        <Text style={welcomeStyles.heroTitle}>
          Find out how much you can save with solar energy
        </Text>
        <Text style={welcomeStyles.heroSubtitle}>
          Snap your electric bill, answer a few quick questions, and get a
          personalized solar savings estimate in minutes.
        </Text>
      </View>

      {/* Bottom Button Area */}
      <View style={welcomeStyles.buttonArea}>
        <PrimaryButton
          label="GET STARTED"
          onPress={() => navigation.replace('Location')}
        />
        <View style={{ height: 16 }} />
        <SecondaryButton
          label="I ALREADY HAVE AN ACCOUNT"
          onPress={() => navigation.replace('Main')}
        />
      </View>
    </View>
  );
}

const welcomeStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EEF0F6',
  },
  topBar: {
    paddingTop: 56,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  heroEmoji: {
    fontSize: 80,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#201b11',
    textAlign: 'center',
    lineHeight: 34,
  },
  heroSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonArea: {
    paddingBottom: 20,
  },
});