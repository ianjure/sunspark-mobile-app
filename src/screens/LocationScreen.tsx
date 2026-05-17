import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Location from "expo-location";
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { RootStackParamList } from "@/src/navigation/types";
import { styles } from "@/src/styles/styles";

type Props = NativeStackScreenProps<RootStackParamList, "Location">;

export default function LocationScreen({ navigation }: Props) {
  const [locationErrorMsg, setLocationErrorMsg] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  async function enableLocation() {
    try {
      setLocationLoading(true);
      setLocationErrorMsg(null);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLocationErrorMsg("Permission to access location was denied.");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      navigation.replace("ScanBill", {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    } catch (error) {
      console.log("Location error:", error);
      setLocationErrorMsg("Unable to get your current location.");
    } finally {
      setLocationLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.logo}>☀️</Text>
      <Text style={styles.title}>Welcome to Sunspark</Text>
      <Text style={styles.subtitle}>
        Let’s start by getting your location so we can estimate your home’s
        solar potential.
      </Text>

      {locationErrorMsg && <Text style={styles.error}>{locationErrorMsg}</Text>}

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={enableLocation}
        disabled={locationLoading}
      >
        <Text style={styles.primaryButtonText}>
          {locationLoading ? "Getting Location..." : "Enable Location"}
        </Text>
      </TouchableOpacity>

      {locationLoading && <ActivityIndicator style={{ marginTop: 16 }} />}
    </View>
  );
}