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

export default function HomeScreen() {
  const cameraRef = useRef<CameraView>(null);

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationErrorMsg, setLocationErrorMsg] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);

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
        <Text style={styles.sectionTitle}>Camera</Text>

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

            <TouchableOpacity style={styles.button} onPress={retakePhoto}>
              <Text style={styles.buttonText}>Retake Photo</Text>
            </TouchableOpacity>
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
      </View>
    </ScrollView>
  );
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
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
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
});