import { Text, TouchableOpacity, View } from "react-native";

import { styles } from "@/src/styles/styles";
import { SunsparkResult } from "@/src/types/sunspark";
import { formatCurrency } from "@/src/utils/formatCurrency";

type Props = {
  result: SunsparkResult;
  resetApp: () => void;
};

export default function ProfileTab({ result, resetApp }: Props) {
  return (
    <>
      <View style={styles.greetingSection}>
        <Text style={styles.greetingTitle}>Profile</Text>
        <Text style={styles.greetingSubtitle}>
          Development settings and saved assessment details.
        </Text>
      </View>

      <View style={styles.resultCard}>
        <Text style={styles.resultTitle}>After Solar Estimate</Text>

        <Text style={styles.label}>Target Offset</Text>
        <Text style={styles.value}>
          {result.estimate?.coverage_percentage ?? "N/A"}%
        </Text>

        <Text style={styles.label}>Estimated New Monthly Bill</Text>
        <Text style={styles.value}>
          {formatCurrency(result.estimate?.estimated_new_bill)}
        </Text>

        <Text style={styles.label}>Monthly Solar Production</Text>
        <Text style={styles.value}>
          {result.estimate?.estimated_monthly_solar_kwh ?? "N/A"} kWh
        </Text>

        <Text style={styles.label}>Annual CO₂ Reduction</Text>
        <Text style={styles.value}>
          {result.estimate?.annual_co2_reduction_tons ?? "N/A"} tons CO₂
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
        <Text style={styles.resultTitle}>Location Data</Text>

        <Text style={styles.label}>Latitude</Text>
        <Text style={styles.value}>{result.solar?.lat ?? "Not available"}</Text>

        <Text style={styles.label}>Longitude</Text>
        <Text style={styles.value}>{result.solar?.lon ?? "Not available"}</Text>

        <Text style={styles.label}>Global Solar Atlas URL</Text>
        <Text style={styles.profileLinkText}>
          {result.solar?.atlas_url ?? "Not available"}
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
    </>
  );
}