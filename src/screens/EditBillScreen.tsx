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

import BackArrowButton from '@/src/components/icons/BackArrowButton';
import InputField from '@/src/components/InputField';
import LoadingOverlay from '@/src/components/LoadingOverlay';
import OnboardingProgressBar from '@/src/components/OnboardingProgressBar';
import PrimaryButton from '@/src/components/PrimaryButton';
import TextCombo from '@/src/components/TextCombo';
import Toast from '@/src/components/Toast';
import { RECOMPUTE_ESTIMATE_API } from '@/src/constants/api';
import { APP_BACKGROUND_COLOR, MAIN_TEXT_COLOR } from '@/src/constants/colors';
import { FONT_INTER_REGULAR } from '@/src/constants/fonts';
import { RootStackParamList } from '@/src/navigation/types';
import { SunsparkResult } from '@/src/types/sunspark';

type Props = NativeStackScreenProps<RootStackParamList, 'EditBill'>;

export default function EditBillScreen({ navigation, route }: Props) {
  const { result: originalResult, latitude, longitude } = route.params;

  const [monthlyBill, setMonthlyBill] = useState(
    originalResult.monthly_bill?.toString() ?? '',
  );
  const [avgMonthlyKwh, setAvgMonthlyKwh] = useState(
    originalResult.avg_monthly_kwh?.toString() ?? '',
  );
  const [effectiveRatePerKwh, setEffectiveRatePerKwh] = useState(
    originalResult.effective_rate_per_kwh?.toString() ?? '',
  );
  const [isRecomputing, setIsRecomputing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function continueToMain() {
    if (isRecomputing) return;

    const parsedMonthlyBill = parseNumber(monthlyBill);
    const parsedAvgMonthlyKwh = parseNumber(avgMonthlyKwh);
    const parsedEffectiveRate = parseNumber(effectiveRatePerKwh);

    if (parsedMonthlyBill === null) {
      Alert.alert('Missing monthly bill', 'Please enter a valid monthly bill.');
      return;
    }

    if (parsedAvgMonthlyKwh === null) {
      Alert.alert(
        'Missing average monthly consumption',
        'Please enter your average monthly kWh usage.',
      );
      return;
    }

    try {
      setIsRecomputing(true);
      setErrorMsg(null);

      const response = await fetch(RECOMPUTE_ESTIMATE_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monthly_bill: parsedMonthlyBill,
          kwh_usage: originalResult.kwh_usage,
          avg_monthly_kwh: parsedAvgMonthlyKwh,
          rate_per_kwh_found_on_bill: originalResult.rate_per_kwh_found_on_bill,
          effective_rate_per_kwh: parsedEffectiveRate,
          customer_type: originalResult.customer_type,
          solar: originalResult.solar,
          location: originalResult.location,
          assessment_answers: originalResult.assessment_answers,
          lat: latitude ?? originalResult.solar?.lat,
          lon: longitude ?? originalResult.solar?.lon,
        }),
      });
      const responseText = await response.text();

      let data: SunsparkResult;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(`Server did not return JSON: ${responseText}`);
      }

      if (!response.ok || !data.success) {
        throw new Error('Failed to recompute estimate.');
      }

      navigation.replace('HomeOwnershipQuestion', {
        result: data,
      });
    } catch (error: any) {
      console.log('Recompute estimate error:', error);
      setErrorMsg(error.message || 'Something went wrong.');
    } finally {
      setIsRecomputing(false);
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: APP_BACKGROUND_COLOR }}
      edges={['top', 'bottom']}
    >
      <Toast message={errorMsg} onDismiss={() => setErrorMsg(null)} />
      <LoadingOverlay
        visible={isRecomputing}
        message="Updating your solar estimate..."
      />

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

        <View style={{ marginTop: 24 }}>
          <InputField
            title="Customer Type"
            value={originalResult.customer_type ?? undefined}
            editable={false}
          />
          <View style={{ height: 20 }} />
          <InputField
            title="Avg Monthly Bill"
            value={monthlyBill}
            onChangeText={setMonthlyBill}
            keyboardType="decimal-pad"
            placeholder="Example: 3500"
          />
          <View style={{ height: 20 }} />
          <InputField
            title="Avg Monthly kWh Usage"
            value={avgMonthlyKwh}
            onChangeText={setAvgMonthlyKwh}
            keyboardType="decimal-pad"
            placeholder="Example: 214"
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
              {
                'Tip: Effective rate will be computed automatically if left blank.'
              }
            </Text>
          </View>
          <View style={{ height: 30 }} />
          <PrimaryButton
            label={isRecomputing ? 'UPDATING...' : 'CONTINUE'}
            onPress={continueToMain}
            loading={isRecomputing}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function parseNumber(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const parsed = Number(cleaned);

  if (!cleaned || Number.isNaN(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}
