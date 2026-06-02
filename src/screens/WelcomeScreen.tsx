import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Logo from '@/src/components/Logo';
import PrimaryButton from '@/src/components/PrimaryButton';
import SecondaryButton from '@/src/components/SecondaryButton';
import TextCombo from '@/src/components/TextCombo';
import WelcomeIllustration from '@/src/components/WelcomeIllustration';
import { APP_BACKGROUND_COLOR } from '@/src/constants/colors';
import { RootStackParamList } from '@/src/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={welcomeStyles.screen} edges={['top', 'bottom']}>
      <View style={{ paddingTop: 30, alignItems: 'center' }}>
        <Logo height={34} />
      </View>

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
        }}
      >
        <WelcomeIllustration height={280} />
        <TextCombo
          title="Welcome to Sunspark!"
          subtitle={'Your simple way to explore solar\nand save more.'}
        />
      </View>

      <PrimaryButton
        label="GET STARTED"
        onPress={() => navigation.replace('Location')}
      />
      <View style={{ height: 15 }} />
      <SecondaryButton
        label="I ALREADY HAVE AN ACCOUNT"
        onPress={() => navigation.replace('Main')}
        style={welcomeStyles.lastButton}
      />
    </SafeAreaView>
  );
}

const welcomeStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: APP_BACKGROUND_COLOR,
  },
  lastButton: {
    marginBottom: 22,
  },
});
