import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const API_URL =
  "https://ianjure--sunspark-ocr-backend-fastapi-app.modal.run/extract-bill-from-image";

type SunsparkResult = {
  success: boolean;
  monthly_bill: number | null;
  kwh_usage: number | null;
  rate_per_kwh_found_on_bill: number | null;
  effective_rate_per_kwh: number | null;
  solar: {
    lat: number;
    lon: number;
    atlas_url: string;
    pvout_daily: number | null;
    pvout_source: string;
    ghi_annual: number | null;
    ghi_daily: number | null;
    dni_annual: number | null;
    dif_annual: number | null;
    gti_annual: number | null;
    optimal_tilt_angle: number | null;
    temperature: number | null;
  };
  estimate: {
    recommended_system_size_kwp: number | null;
    estimated_monthly_production_kwh: number | null;
    estimated_monthly_savings: number | null;
    estimated_annual_savings: number | null;
    coverage_percentage: number | null;
  };
};

export default function HomeScreen() {
  const cameraRef = useRef<CameraView>(null);

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationErrorMsg, setLocationErrorMsg] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [apiErrorMsg, setApiErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<SunsparkResult | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setLocationErrorMsg("Permission to access location was denied.");
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setLocation(currentLocation);
      } catch (error) {
        setLocationErrorMsg("Unable to get your current location.");
      } finally {
        setLocationLoading(false);
      }
    }

    getCurrentLocation();
  }, []);

  async function takePhoto() {
    if (!cameraRef.current || isTakingPhoto) return;

    try {
      setIsTakingPhoto(true);
      setApiErrorMsg(null);
      setResult(null);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      setPhotoUri(photo.uri);
    } catch (error) {
      console.log("Error taking photo:", error);
    } finally {
      setIsTakingPhoto(false);
    }
  }

  function retakePhoto() {
    setPhotoUri(null);
    setApiErrorMsg(null);
    setResult(null);
  }

  async function analyzeBill() {
    if (!photoUri) {
      setApiErrorMsg("Please take a photo first.");
      return;
    }

    if (!location) {
      setApiErrorMsg("Location is required before analyzing the bill.");
      return;
    }

    try {
      setIsUploading(true);
      setApiErrorMsg(null);
      setResult(null);

      const formData = new FormData();

      formData.append("file", {
        uri: photoUri,
        name: "electric-bill.jpg",
        type: "image/jpeg",
      } as any);

      formData.append("lat", String(location.coords.latitude));
      formData.append("lon", String(location.coords.longitude));

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to analyze bill.");
      }

      setResult(data);
    } catch (error: any) {
      console.log("Analyze bill error:", error);
      setApiErrorMsg(error.message || "Something went wrong.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sunspark</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Location</Text>

        {locationLoading && (
          <View style={styles.centerContent}>
            <ActivityIndicator size="small" />
            <Text style={styles.text}>Getting your location...</Text>
          </View>
        )}

        {!locationLoading && locationErrorMsg && (
          <Text style={styles.error}>{locationErrorMsg}</Text>
        )}

        {!locationLoading && location && (
          <View style={styles.card}>
            <Text style={styles.label}>Latitude</Text>
            <Text style={styles.value}>{location.coords.latitude}</Text>

            <Text style={styles.label}>Longitude</Text>
            <Text style={styles.value}>{location.coords.longitude}</Text>

            <Text style={styles.label}>Accuracy</Text>
            <Text style={styles.value}>{location.coords.accuracy} meters</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Electric Bill Photo</Text>

        {!cameraPermission && (
          <Text style={styles.text}>Loading camera permission...</Text>
        )}

        {cameraPermission && !cameraPermission.granted && (
          <View style={styles.centerContent}>
            <Text style={styles.text}>
              We need your permission to use the camera.
            </Text>
            <Button title="Allow Camera" onPress={requestCameraPermission} />
          </View>
        )}

        {cameraPermission && cameraPermission.granted && photoUri && (
          <View style={styles.previewContainer}>
            <Image source={{ uri: photoUri }} style={styles.previewImage} />

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.secondaryButton} onPress={retakePhoto}>
                <Text style={styles.secondaryButtonText}>Retake</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={analyzeBill}
                disabled={isUploading}
              >
                <Text style={styles.buttonText}>
                  {isUploading ? "Analyzing..." : "Analyze Bill"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {cameraPermission && cameraPermission.granted && !photoUri && (
          <View style={styles.cameraContainer}>
            <CameraView ref={cameraRef} style={styles.camera} facing="back" />

            <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
              <Text style={styles.captureButtonText}>
                {isTakingPhoto ? "Taking..." : "Take Photo"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {apiErrorMsg && <Text style={styles.error}>{apiErrorMsg}</Text>}
      </View>

      {result && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sunspark Estimate</Text>

          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Bill Details</Text>

            <Text style={styles.label}>Monthly Bill</Text>
            <Text style={styles.value}>
              {formatCurrency(result.monthly_bill)}
            </Text>

            <Text style={styles.label}>Monthly kWh Usage</Text>
            <Text style={styles.value}>{result.kwh_usage ?? "Not found"} kWh</Text>

            <Text style={styles.label}>Effective Rate per kWh</Text>
            <Text style={styles.value}>
              {formatCurrency(result.effective_rate_per_kwh)}
            </Text>

            <Text style={styles.resultTitle}>Solar Resource</Text>

            <Text style={styles.label}>PV Output Daily</Text>
            <Text style={styles.value}>
              {result.solar?.pvout_daily ?? "Not available"} kWh/kWp/day
            </Text>

            <Text style={styles.label}>PV Output Source</Text>
            <Text style={styles.value}>{result.solar?.pvout_source}</Text>

            <Text style={styles.label}>Optimal Tilt Angle</Text>
            <Text style={styles.value}>
              {result.solar?.optimal_tilt_angle ?? "Not available"}°
            </Text>

            <Text style={styles.resultTitle}>Recommended System</Text>

            <Text style={styles.bigValue}>
              {result.estimate?.recommended_system_size_kwp ?? "N/A"} kWp
            </Text>

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

            <Text style={styles.label}>Estimated Bill Coverage</Text>
            <Text style={styles.value}>
              {result.estimate?.coverage_percentage ?? "N/A"}%
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "Not found";
  }

  return `$${value.toFixed(2)}`;
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  section: {
    width: "100%",
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: 8,
    fontSize: 16,
    textAlign: "center",
  },
  card: {
    width: "100%",
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#f4f4f5",
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginTop: 12,
  },
  value: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
  },
  bigValue: {
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 8,
    color: "#111827",
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 12,
  },
  cameraContainer: {
    width: "100%",
    height: 420,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  captureButton: {
    padding: 16,
    backgroundColor: "#facc15",
    alignItems: "center",
  },
  captureButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  previewContainer: {
    width: "100%",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: 420,
    borderRadius: 20,
    resizeMode: "cover",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    backgroundColor: "#111827",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultCard: {
    width: "100%",
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#fefce8",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
});