import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { RootStackParamList } from "@/src/navigation/types";
import { styles } from "@/src/styles/styles";
import { SunsparkResult } from "@/src/types/sunspark";
import { formatCurrency } from "@/src/utils/formatCurrency";
import { STORAGE_KEY } from "@/src/utils/storage";

type Props = NativeStackScreenProps<RootStackParamList, "Main">;

export default function MainScreen({ navigation, route }: Props) {
  const [result, setResult] = useState<SunsparkResult | null>(
    route.params?.result ?? null
  );
  const [loading, setLoading] = useState(route.params?.result ? false : true);

  useEffect(() => {
    async function loadSavedResult() {
      if (route.params?.result) return;

      try {
        const savedResult = await AsyncStorage.getItem(STORAGE_KEY);

        if (!savedResult) {
          navigation.replace("Location");
          return;
        }

        setResult(JSON.parse(savedResult));
      } catch (error) {
        console.log("AsyncStorage load result error:", error);
        navigation.replace("Location");
      } finally {
        setLoading(false);
      }
    }

    loadSavedResult();
  }, [navigation, route.params?.result]);

  async function resetApp() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      navigation.replace("Location");
    } catch (error) {
      console.log("Reset app error:", error);
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

        <TouchableOpacity style={styles.primaryButton} onPress={resetApp}>
          <Text style={styles.primaryButtonText}>Start Assessment</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Sunspark Assessment</Text>
      <Text style={styles.subtitle}>
        Here’s your first solar estimate based on your bill and location.
      </Text>

      <View style={styles.heroCard}>
        <Text style={styles.cardLabel}>Recommended Solar System</Text>
        <Text style={styles.heroValue}>
          {result.estimate?.recommended_system_size_kwp ?? "N/A"} kWp
        </Text>
        <Text style={styles.smallText}>
          Estimated to cover {result.estimate?.coverage_percentage ?? "N/A"}% of
          your monthly electricity usage.
        </Text>
      </View>

      <View style={styles.resultCard}>
        <Text style={styles.resultTitle}>Bill Summary</Text>

        <Text style={styles.label}>Monthly Bill</Text>
        <Text style={styles.value}>{formatCurrency(result.monthly_bill)}</Text>

        <Text style={styles.label}>Monthly kWh Usage</Text>
        <Text style={styles.value}>{result.kwh_usage ?? "Not found"} kWh</Text>

        <Text style={styles.label}>Effective Rate per kWh</Text>
        <Text style={styles.value}>
          {formatCurrency(result.effective_rate_per_kwh)}
        </Text>
      </View>

      <View style={styles.resultCard}>
        <Text style={styles.resultTitle}>Solar Estimate</Text>

        <Text style={styles.label}>Estimated Monthly Production</Text>
        <Text style={styles.value}>
          {result.estimate?.estimated_monthly_production_kwh ?? "N/A"} kWh
        </Text>

        <Text style={styles.label}>Estimated Monthly Savings</Text>
        <Text style={styles.value}>
          {formatCurrency(result.estimate?.estimated_monthly_savings)}
        </Text>

        <Text style={styles.label}>Estimated Annual Savings</Text>
        <Text style={styles.value}>
          {formatCurrency(result.estimate?.estimated_annual_savings)}
        </Text>
      </View>

      <View style={styles.resultCard}>
        <Text style={styles.resultTitle}>Solar Resource</Text>

        <Text style={styles.label}>PV Output Daily</Text>
        <Text style={styles.value}>
          {result.solar?.pvout_daily ?? "Not available"} kWh/kWp/day
        </Text>

        <Text style={styles.label}>Solar Data Source</Text>
        <Text style={styles.value}>{result.solar?.pvout_source}</Text>

        <Text style={styles.label}>Optimal Tilt Angle</Text>
        <Text style={styles.value}>
          {result.solar?.optimal_tilt_angle ?? "Not available"}°
        </Text>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={resetApp}>
        <Text style={styles.resetButtonText}>Reset App / Start Over</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}