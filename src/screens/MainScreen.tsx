import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

  const readinessScore = useMemo(() => {
    if (!result) return 0;

    let score = 60;

    const coverage = result.estimate?.coverage_percentage ?? 0;
    const pvoutDaily = result.solar?.pvout_daily ?? 0;
    const roofSpace = result.assessment_answers?.roof_space;
    const sunlight = result.assessment_answers?.sunlight;

    if (coverage >= 90) score += 10;
    if (pvoutDaily >= 4) score += 10;

    if (sunlight === "Mostly sunny") score += 10;
    if (sunlight === "Partially shaded") score += 5;
    if (sunlight === "Heavily shaded") score -= 5;

    if (roofSpace === "Large") score += 10;
    if (roofSpace === "Medium") score += 5;
    if (roofSpace === "Small") score -= 5;

    return Math.max(0, Math.min(100, score));
  }, [result]);

  const readinessLabel = useMemo(() => {
    if (readinessScore >= 80) return "Great fit for solar";
    if (readinessScore >= 60) return "Good fit for solar";
    return "Needs more review";
  }, [readinessScore]);

  const estimatedCostRange = useMemo(() => {
    const systemSize = result?.estimate?.recommended_system_size_kwp;

    if (!systemSize) return "Not available";

    const low = systemSize * 50000;
    const high = systemSize * 70000;

    return `${formatPeso(low)} - ${formatPeso(high)}`;
  }, [result]);

  const paybackYears = useMemo(() => {
    const systemSize = result?.estimate?.recommended_system_size_kwp;
    const annualSavings = result?.estimate?.estimated_annual_savings;

    if (!systemSize || !annualSavings || annualSavings <= 0) {
      return "Not available";
    }

    const estimatedCost = systemSize * 60000;
    const years = estimatedCost / annualSavings;

    return `${years.toFixed(1)} years`;
  }, [result]);

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
    <ScrollView contentContainerStyle={styles.mainContainer}>
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.brandIcon}>
            <Text style={styles.brandIconText}>☀️</Text>
          </View>
          <Text style={styles.brandText}>Sunspark</Text>
        </View>

        <View style={styles.notificationButton}>
          <Text style={styles.notificationIcon}>🔔</Text>
        </View>
      </View>

      <View style={styles.greetingSection}>
        <Text style={styles.greetingTitle}>Hello, Ian</Text>
        <Text style={styles.greetingSubtitle}>
          Here’s your solar readiness snapshot.
        </Text>
      </View>

      <View style={styles.scoreCard}>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreValue}>{readinessScore}</Text>
          <Text style={styles.scoreMax}>/ 100</Text>
        </View>

        <View style={styles.scoreContent}>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreBadgeText}>✓ {readinessLabel}</Text>
          </View>

          <Text style={styles.scoreDescription}>
            Your bill, location, roof answers, and solar resource data were used
            to create this first estimate.
          </Text>
        </View>
      </View>

      <View style={styles.estimateGrid}>
        <View style={styles.estimateMiniCard}>
          <Text style={styles.estimateIcon}>⚡</Text>
          <Text style={styles.estimateLabel}>Recommended size</Text>
          <Text style={styles.estimateValue}>
            {result.estimate?.recommended_system_size_kwp ?? "N/A"} kWp
          </Text>
        </View>

        <View style={styles.estimateMiniCard}>
          <Text style={styles.estimateIcon}>💰</Text>
          <Text style={styles.estimateLabel}>Monthly savings</Text>
          <Text style={styles.estimateValue}>
            {formatCurrency(result.estimate?.estimated_monthly_savings)}
          </Text>
        </View>

        <View style={styles.estimateMiniCard}>
          <Text style={styles.estimateIcon}>🏷️</Text>
          <Text style={styles.estimateLabel}>Cost range</Text>
          <Text style={styles.estimateSmallValue}>{estimatedCostRange}</Text>
        </View>

        <View style={styles.estimateMiniCard}>
          <Text style={styles.estimateIcon}>📅</Text>
          <Text style={styles.estimateLabel}>Payback</Text>
          <Text style={styles.estimateValue}>{paybackYears}</Text>
        </View>
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
        <Text style={styles.resultTitle}>Solar Resource</Text>

        <Text style={styles.label}>PV Output Daily</Text>
        <Text style={styles.value}>
          {result.solar?.pvout_daily ?? "Not available"} kWh/kWp/day
        </Text>

        <Text style={styles.label}>Optimal Tilt Angle</Text>
        <Text style={styles.value}>
          {result.solar?.optimal_tilt_angle ?? "Not available"}°
        </Text>

        <Text style={styles.label}>Solar Data Source</Text>
        <Text style={styles.value}>{result.solar?.pvout_source}</Text>
      </View>

      {result.assessment_answers && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Your Preferences</Text>

          <Text style={styles.label}>Roof Sunlight</Text>
          <Text style={styles.value}>
            {result.assessment_answers.sunlight ?? "Not answered"}
          </Text>

          <Text style={styles.label}>Usable Roof Space</Text>
          <Text style={styles.value}>
            {result.assessment_answers.roof_space ?? "Not answered"}
          </Text>

          <Text style={styles.label}>Payment Preference</Text>
          <Text style={styles.value}>
            {result.assessment_answers.payment_preference ?? "Not answered"}
          </Text>

          <Text style={styles.label}>Installation Timeline</Text>
          <Text style={styles.value}>
            {result.assessment_answers.installation_timeline ?? "Not answered"}
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.resetButton} onPress={resetApp}>
        <Text style={styles.resetButtonText}>Reset App / Start Over</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function formatPeso(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "Not available";
  }

  return `₱${Math.round(value).toLocaleString()}`;
}