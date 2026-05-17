import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { RootStackParamList } from "@/src/navigation/types";
import { styles } from "@/src/styles/styles";
import { SunsparkResult } from "@/src/types/sunspark";

type Props = NativeStackScreenProps<RootStackParamList, "EditBill">;

export default function EditBillScreen({ navigation, route }: Props) {
  const originalResult = route.params.result;

  const [monthlyBill, setMonthlyBill] = useState(
    originalResult.monthly_bill?.toString() ?? ""
  );
  const [kwhUsage, setKwhUsage] = useState(
    originalResult.kwh_usage?.toString() ?? ""
  );
  const [effectiveRatePerKwh, setEffectiveRatePerKwh] = useState(
    originalResult.effective_rate_per_kwh?.toString() ?? ""
  );

  function parseNumber(value: string) {
    const cleaned = value.replace(/[^0-9.]/g, "");
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
    const pvoutDaily = updatedResult.solar?.pvout_daily;

    if (
      kwhUsageValue === null ||
      kwhUsageValue <= 0 ||
      pvoutDaily === null ||
      pvoutDaily === undefined ||
      pvoutDaily <= 0
    ) {
      return {
        ...updatedResult,
        estimate: {
          recommended_system_size_kwp: null,
          estimated_monthly_production_kwh: null,
          estimated_monthly_savings: null,
          estimated_annual_savings: null,
          coverage_percentage: null,
        },
      };
    }

    const recommendedSystemSizeKwp = kwhUsageValue / (pvoutDaily * 30);

    const estimatedMonthlyProductionKwh =
      recommendedSystemSizeKwp * pvoutDaily * 30;

    const estimatedMonthlySavings =
      effectiveRateValue !== null
        ? estimatedMonthlyProductionKwh * effectiveRateValue
        : monthlyBillValue;

    const estimatedAnnualSavings =
      estimatedMonthlySavings !== null ? estimatedMonthlySavings * 12 : null;

    const coveragePercentage =
      (estimatedMonthlyProductionKwh / kwhUsageValue) * 100;

    return {
      ...updatedResult,
      estimate: {
        recommended_system_size_kwp: roundNumber(recommendedSystemSizeKwp, 2),
        estimated_monthly_production_kwh: roundNumber(
          estimatedMonthlyProductionKwh,
          2
        ),
        estimated_monthly_savings:
          estimatedMonthlySavings !== null
            ? roundNumber(estimatedMonthlySavings, 2)
            : null,
        estimated_annual_savings:
          estimatedAnnualSavings !== null
            ? roundNumber(estimatedAnnualSavings, 2)
            : null,
        coverage_percentage: roundNumber(coveragePercentage, 2),
      },
    };
  }

  async function continueToMain() {
    const parsedMonthlyBill = parseNumber(monthlyBill);
    const parsedKwhUsage = parseNumber(kwhUsage);
    const parsedEffectiveRate = parseNumber(effectiveRatePerKwh);

    if (parsedMonthlyBill === null) {
      Alert.alert("Missing monthly bill", "Please enter a valid monthly bill.");
      return;
    }

    if (parsedKwhUsage === null) {
      Alert.alert("Missing kWh usage", "Please enter a valid monthly kWh usage.");
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

    navigation.replace("SunlightQuestion", {
      result: finalResult,
    });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Review Bill Details</Text>
        <Text style={styles.subtitle}>
          Check the values we found from your bill. You can edit them before we
          create your Sunspark assessment.
        </Text>

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

        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Solar Data Found</Text>

          <Text style={styles.label}>PV Output Daily</Text>
          <Text style={styles.value}>
            {originalResult.solar?.pvout_daily ?? "Not available"} kWh/kWp/day
          </Text>

          <Text style={styles.label}>Optimal Tilt Angle</Text>
          <Text style={styles.value}>
            {originalResult.solar?.optimal_tilt_angle ?? "Not available"}°
          </Text>
        </View>

        <TouchableOpacity style={styles.primaryButtonFull} onPress={continueToMain}>
          <Text style={styles.primaryButtonText}>Continue to Assessment</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function roundNumber(value: number, decimals: number) {
  return Number(value.toFixed(decimals));
}