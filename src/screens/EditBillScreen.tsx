import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackArrowButton from '@/src/components/BackArrowButton';
import InputField from '@/src/components/InputField';
import OnboardingProgressBar from '@/src/components/OnboardingProgressBar';
import PrimaryButton from '@/src/components/PrimaryButton';
import TextCombo from '@/src/components/TextCombo';
import { APP_BACKGROUND_COLOR, MAIN_TEXT_COLOR } from '@/src/constants/colors';
import { FONT_INTER_REGULAR } from '@/src/constants/fonts';
import { RootStackParamList } from '@/src/navigation/types';
import { SunsparkResult } from '@/src/types/sunspark';
import {
  parseNumber,
  recomputeEstimate,
  roundNumber,
} from '@/src/utils/billUtils';

type Props = NativeStackScreenProps<RootStackParamList, 'EditBill'>;

export default function EditBillScreen({ navigation, route }: Props) {
  const { result: originalResult, latitude, longitude } = route.params;

  const [monthlyBill, setMonthlyBill] = useState(
    originalResult.monthly_bill?.toString() ?? '',
  );
  const [kwhUsage, setKwhUsage] = useState(
    originalResult.kwh_usage?.toString() ?? '',
  );
  const [effectiveRatePerKwh, setEffectiveRatePerKwh] = useState(
    originalResult.effective_rate_per_kwh?.toString() ?? '',
  );

  async function continueToMain() {
    const parsedMonthlyBill = parseNumber(monthlyBill);
    const parsedKwhUsage = parseNumber(kwhUsage);
    const parsedEffectiveRate = parseNumber(effectiveRatePerKwh);

    if (parsedMonthlyBill === null) {
      Alert.alert('Missing monthly bill', 'Please enter a valid monthly bill.');
      return;
    }

    if (parsedKwhUsage === null) {
      Alert.alert(
        'Missing kWh usage',
        'Please enter a valid monthly kWh usage.',
      );
      return;
    }

    const updatedResult: SunsparkResult = {
      ...originalResult,
      monthly_bill: parsedMonthlyBill,
      kwh_usage: parsedKwhUsage,
      effective_rate_per_kwh:
        parsedEffectiveRate !== null
          ? parsedEffectiveRate
          : roundNumber(parsedMonthlyBill / parsedKwhUsage, 4),
    };

    const finalResult = recomputeEstimate(updatedResult);

    navigation.replace('HomeOwnershipQuestion', {
      result: finalResult,
    });
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: APP_BACKGROUND_COLOR }}
      edges={['top', 'bottom']}
    >
      <View style={{ flexDirection: 'row', marginRight: 20 }}>
        <BackArrowButton
          onPress={() =>
            navigation.replace('ScanBill', {
              latitude: latitude ?? 0,
              longitude: longitude ?? 0,
            })
          }
        />
        <View
          style={{
            flex: 1,
            marginLeft: 20,
            paddingTop: 25,
            justifyContent: 'center',
          }}
        >
          <OnboardingProgressBar step={2} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: APP_BACKGROUND_COLOR }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={{ paddingHorizontal: 20, paddingTop: 25 }}>
          <TextCombo
            title="Review bill details"
            subtitle={
              'Check the values we found from your bill.\nYou can edit them before we create\nyour solar assessment.'
            }
          />
        </View>

        <View style={{ marginTop: 40 }}>
          <InputField
            title="Monthly Bill"
            value={monthlyBill}
            onChangeText={setMonthlyBill}
            keyboardType="decimal-pad"
            placeholder="Example: 3500"
          />
          <View style={{ height: 20 }} />
          <InputField
            title="Monthly kWh Usage"
            value={kwhUsage}
            onChangeText={setKwhUsage}
            keyboardType="decimal-pad"
            placeholder="Example: 420"
          />
          <View style={{ height: 20 }} />
          <InputField
            title="Effective Rate per kWh"
            value={effectiveRatePerKwh}
            onChangeText={setEffectiveRatePerKwh}
            keyboardType="decimal-pad"
            placeholder="Leave blank to compute automatically"
          />

          <View style={{ paddingTop: 10, paddingHorizontal: 20 }}>
            <Text
              style={{
                fontFamily: FONT_INTER_REGULAR,
                fontSize: 12,
                color: MAIN_TEXT_COLOR,
              }}
            >
              Tip: Effective rate is usually monthly bill divided by monthly kWh
              usage. You can leave this blank and Sunspark will compute it.
            </Text>
          </View>
          <View style={{ height: 20 }} />
          <PrimaryButton label="CONTINUE" onPress={continueToMain} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
