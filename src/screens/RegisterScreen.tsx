import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '@/src/navigation/types';
import { STORAGE_KEY } from '@/src/utils/storage';

import BackArrowButton from '@/src/components/icons/BackArrowButton';
import RegisterIllustration from '@/src/components/illustrations/RegisterIllustration';
import ModalInputField from '@/src/components/ModalInputField';
import OnboardingProgressBar from '@/src/components/OnboardingProgressBar';
import PrimaryButton from '@/src/components/PrimaryButton';
import TextCombo from '@/src/components/TextCombo';
import { APP_BACKGROUND_COLOR } from '@/src/constants/colors';
import { FONT_INTER_BOLD } from '@/src/constants/fonts';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation, route }: Props) {
  const { result } = route.params;
  const [fullName, setFullName] = useState('Juan dela Cruz');

  async function handleSubmit() {
    if (!fullName.trim()) {
      Alert.alert('Missing name', 'Please enter your full name.');
      return;
    }

    const finalResult = {
      ...result,
      user_name: fullName.trim(),
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(finalResult));
    navigation.replace('Main', { result: finalResult });
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: APP_BACKGROUND_COLOR }}
      edges={['top', 'bottom']}
    >
      <View style={{ flexDirection: 'row', marginRight: 20 }}>
        <BackArrowButton
          onPress={() => navigation.replace('TimelineQuestion', { result })}
        />
        <View
          style={{
            flex: 1,
            marginLeft: 20,
            paddingTop: 25,
            justifyContent: 'center',
          }}
        >
          <OnboardingProgressBar step={8} />
        </View>
      </View>

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
        }}
      >
        <RegisterIllustration height={280} />
        <TextCombo
          title="You're almost there!"
          subtitle={
            'Create your free account to save your report\nand view trusted providers near you.'
          }
        />
      </View>

      <ModalInputField
        title="What is your full name?"
        value={fullName}
        onChangeText={setFullName}
        keyboardType="default"
        placeholder="Example: Juan dela Cruz"
      />

      <View style={{ height: 15 }} />
      <PrimaryButton label="CONTINUE" onPress={handleSubmit} />
      <View style={{ height: 15 }} />
      <View
        style={{
          height: 55,
          marginBottom: 22,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={styles.termsText}>
          {'By signing up, you agree to our \n'}
          <Text style={styles.termsLink}>Terms of Service</Text>
          {' and '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
          {'.'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  termsText: {
    fontFamily: FONT_INTER_BOLD,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#667085',
  },
  termsLink: {
    fontFamily: FONT_INTER_BOLD,
    color: '#667085',
    textDecorationLine: 'underline',
  },
});
