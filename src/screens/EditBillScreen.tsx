import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackArrowButton from '@/src/components/BackArrowButton';
import OnboardingProgressBar from '@/src/components/OnboardingProgressBar';
import TextCombo from '@/src/components/TextCombo';
import { APP_BACKGROUND_COLOR } from '@/src/constants/colors';
import { RootStackParamList } from '@/src/navigation/types';
import { styles } from '@/src/styles/styles';
import { SunsparkResult } from '@/src/types/sunspark';

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

  function parseNumber(value: string) {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parsed = Number(cleaned);

    if (!cleaned || Number.isNaN(parsed)) {
      return null;
    }

    return parsed;
  }

  function recomputeEstimate(updatedResult: SunsparkResult): SunsparkResult {
    const monthlyBillValue = updatedResult.monthly_bill;
    const kwhUsageValue = updatedResult.kwh_usage;
    const effectiveRateValue = updatedResult.effective_rate_per_kwh;
    const pvOutputDaily = updatedResult.solar?.pvout_daily;

    const targetOffsetPercent = 0.7;
    const costPerKwp = 60000;
    const gridEmissionFactor = 0.7;

    if (
      monthlyBillValue === null ||
      kwhUsageValue === null ||
      effectiveRateValue === null ||
      pvOutputDaily === null ||
      pvOutputDaily === undefined ||
      monthlyBillValue <= 0 ||
      kwhUsageValue <= 0 ||
      effectiveRateValue <= 0 ||
      pvOutputDaily <= 0
    ) {
      return {
        ...updatedResult,
        estimate: {
          target_offset_percent: targetOffsetPercent,
          monthly_production_per_kwp: null,
          target_kwh_offset: null,
          recommended_system_size_kwp: null,
          estimated_monthly_solar_kwh: null,
          estimated_monthly_production_kwh: null,
          estimated_monthly_savings: null,
          estimated_annual_savings: null,
          estimated_new_bill: null,
          estimated_install_cost: null,
          cost_per_kwp: costPerKwp,
          payback_years: null,
          grid_emission_factor: gridEmissionFactor,
          monthly_co2_reduction_kg: null,
          annual_co2_reduction_tons: null,
          coverage_percentage: null,
        },
      };
    }

    const monthlyProductionPerKwp = pvOutputDaily * 30;
    const targetKwhOffset = kwhUsageValue * targetOffsetPercent;
    const recommendedSystemSizeKwpRaw =
      targetKwhOffset / monthlyProductionPerKwp;
    const recommendedSystemSizeKwp =
      Math.ceil(recommendedSystemSizeKwpRaw * 2) / 2;
    const estimatedMonthlySolarKwh =
      recommendedSystemSizeKwp * monthlyProductionPerKwp;
    const estimatedMonthlySavings =
      estimatedMonthlySolarKwh * effectiveRateValue;
    const estimatedAnnualSavings = estimatedMonthlySavings * 12;
    const estimatedNewBill = monthlyBillValue - estimatedMonthlySavings;
    const estimatedInstallCost = recommendedSystemSizeKwp * costPerKwp;
    const paybackYears = estimatedInstallCost / estimatedAnnualSavings;
    const monthlyCo2ReductionKg = estimatedMonthlySolarKwh * gridEmissionFactor;
    const annualCo2ReductionTons = (monthlyCo2ReductionKg * 12) / 1000;

    return {
      ...updatedResult,
      estimate: {
        target_offset_percent: roundNumber(targetOffsetPercent, 2),
        monthly_production_per_kwp: roundNumber(monthlyProductionPerKwp, 2),
        target_kwh_offset: roundNumber(targetKwhOffset, 2),
        recommended_system_size_kwp: roundNumber(recommendedSystemSizeKwp, 2),
        estimated_monthly_solar_kwh: roundNumber(estimatedMonthlySolarKwh, 2),
        estimated_monthly_production_kwh: roundNumber(
          estimatedMonthlySolarKwh,
          2,
        ),
        estimated_monthly_savings: roundNumber(estimatedMonthlySavings, 2),
        estimated_annual_savings: roundNumber(estimatedAnnualSavings, 2),
        estimated_new_bill: roundNumber(estimatedNewBill, 2),
        estimated_install_cost: roundNumber(estimatedInstallCost, 2),
        cost_per_kwp: costPerKwp,
        payback_years: roundNumber(paybackYears, 1),
        grid_emission_factor: gridEmissionFactor,
        monthly_co2_reduction_kg: roundNumber(monthlyCo2ReductionKg, 2),
        annual_co2_reduction_tons: roundNumber(annualCo2ReductionTons, 2),
        coverage_percentage: roundNumber(targetOffsetPercent * 100, 2),
      },
    };
  }

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
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 25 }}>
          <TextCombo
            title="Review bill details"
            subtitle={
              'Check the values we found from your bill.\nYou can edit them before we create\nyour solar assessment.'
            }
          />
        </View>

        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Bill Summary</Text>

          <Text style={styles.label}>Monthly Bill</Text>
          <TextInput
            style={styles.input}
            value={monthlyBill}
            onChangeText={setMonthlyBill}
            keyboardType="decimal-pad"
            placeholder="Example: 3500"
          />

          <Text style={styles.label}>Monthly kWh Usage</Text>
          <TextInput
            style={styles.input}
            value={kwhUsage}
            onChangeText={setKwhUsage}
            keyboardType="decimal-pad"
            placeholder="Example: 420"
          />

          <Text style={styles.label}>Effective Rate per kWh</Text>
          <TextInput
            style={styles.input}
            value={effectiveRatePerKwh}
            onChangeText={setEffectiveRatePerKwh}
            keyboardType="decimal-pad"
            placeholder="Leave blank to compute automatically"
          />

          <Text style={styles.helperText}>
            Tip: Effective rate is usually monthly bill divided by monthly kWh
            usage. You can leave this blank and Sunspark will compute it.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButtonFull}
          onPress={continueToMain}
        >
          <Text style={styles.primaryButtonText}>Continue to Assessment</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function roundNumber(value: number, decimals: number) {
  return Number(value.toFixed(decimals));
}
