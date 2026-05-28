import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '@/src/navigation/types';
import { styles } from '@/src/styles/styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Location'>;

// Bounding box for the Philippines
const PH_BOUNDS = {
  minLat: 4.5,
  maxLat: 21.5,
  minLon: 116.0,
  maxLon: 127.0,
};

// Center of the Philippines
const PH_CENTER_REGION: Region = {
  latitude: 12.8797,
  longitude: 121.774,
  latitudeDelta: 18,
  longitudeDelta: 12,
};

// Max allowed deltas so user can't zoom out to see other countries
const MAX_LATITUDE_DELTA = 18;
const MAX_LONGITUDE_DELTA = 12;

function isInsidePhilippines(lat: number, lon: number): boolean {
  return (
    lat >= PH_BOUNDS.minLat &&
    lat <= PH_BOUNDS.maxLat &&
    lon >= PH_BOUNDS.minLon &&
    lon <= PH_BOUNDS.maxLon
  );
}

function clampRegion(region: Region): Region {
  const latDelta = Math.min(region.latitudeDelta, MAX_LATITUDE_DELTA);
  const lonDelta = Math.min(region.longitudeDelta, MAX_LONGITUDE_DELTA);

  const halfLat = latDelta / 2;
  const halfLon = lonDelta / 2;

  const clampedLat = Math.min(
    Math.max(region.latitude, PH_BOUNDS.minLat + halfLat),
    PH_BOUNDS.maxLat - halfLat,
  );
  const clampedLon = Math.min(
    Math.max(region.longitude, PH_BOUNDS.minLon + halfLon),
    PH_BOUNDS.maxLon - halfLon,
  );

  return {
    latitude: clampedLat,
    longitude: clampedLon,
    latitudeDelta: latDelta,
    longitudeDelta: lonDelta,
  };
}

export default function LocationScreen({ navigation }: Props) {
  const [locationErrorMsg, setLocationErrorMsg] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [pinnedCoords, setPinnedCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [pinErrorMsg, setPinErrorMsg] = useState<string | null>(null);

  const mapRef = useRef<MapView>(null);

  async function enableLocation() {
    try {
      setLocationLoading(true);
      setLocationErrorMsg(null);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setLocationErrorMsg('Permission to access location was denied.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      navigation.replace('ScanBill', {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    } catch (error) {
      console.log('Location error:', error);
      setLocationErrorMsg('Unable to get your current location.');
    } finally {
      setLocationLoading(false);
    }
  }

  function handleMapPress(e: MapPressEvent) {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    if (!isInsidePhilippines(latitude, longitude)) {
      setPinErrorMsg('📍 Please pin a location inside the Philippines.');
      setPinnedCoords(null);
      return;
    }

    setPinErrorMsg(null);
    setPinnedCoords({ latitude, longitude });
  }

  function handleRegionChangeComplete(region: Region) {
    const clamped = clampRegion(region);

    const latChanged = Math.abs(clamped.latitude - region.latitude) > 0.0001;
    const lonChanged = Math.abs(clamped.longitude - region.longitude) > 0.0001;
    const deltaChanged =
      Math.abs(clamped.latitudeDelta - region.latitudeDelta) > 0.0001 ||
      Math.abs(clamped.longitudeDelta - region.longitudeDelta) > 0.0001;

    if (latChanged || lonChanged || deltaChanged) {
      mapRef.current?.animateToRegion(clamped, 200);
    }
  }

  function confirmPinnedLocation() {
    if (!pinnedCoords) return;

    setMapModalVisible(false);
    navigation.replace('ScanBill', {
      latitude: pinnedCoords.latitude,
      longitude: pinnedCoords.longitude,
    });
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      {/* X Button */}
      <TouchableOpacity
        style={locationStyles.closeButton}
        onPress={() => navigation.replace('Welcome')}
      >
        <Text style={locationStyles.closeButtonText}>✕</Text>
      </TouchableOpacity>

      <Text style={styles.logo}>☀️</Text>
      <Text style={styles.title}>Welcome to Sunspark</Text>
      <Text style={styles.subtitle}>
        Let's start by getting your location so we can estimate your home's
        solar potential.
      </Text>

      {locationErrorMsg && <Text style={styles.error}>{locationErrorMsg}</Text>}

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={enableLocation}
        disabled={locationLoading}
      >
        <Text style={styles.primaryButtonText}>
          {locationLoading ? 'Getting Location...' : 'Enable Location'}
        </Text>
      </TouchableOpacity>

      {locationLoading && <ActivityIndicator style={{ marginTop: 16 }} />}

      <TouchableOpacity
        onPress={() => {
          setPinnedCoords(null);
          setPinErrorMsg(null);
          setMapModalVisible(true);
        }}
        style={{ marginTop: 20 }}
      >
        <Text style={mapPickerStyles.pinText}>
          Or pin your location on the map
        </Text>
      </TouchableOpacity>

      {/* Map Picker Modal */}
      <Modal
        visible={mapModalVisible}
        animationType="slide"
        onRequestClose={() => setMapModalVisible(false)}
      >
        <View style={mapPickerStyles.modalContainer}>
          {/* Header */}
          <View style={mapPickerStyles.header}>
            <TouchableOpacity onPress={() => setMapModalVisible(false)}>
              <Text style={mapPickerStyles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={mapPickerStyles.headerTitle}>Pin Your Home</Text>
            <View style={{ width: 60 }} />
          </View>

          {/* Hint / error banner */}
          <View
            style={[
              mapPickerStyles.hintBanner,
              pinErrorMsg && mapPickerStyles.hintBannerError,
            ]}
          >
            <Text
              style={[
                mapPickerStyles.hintText,
                pinErrorMsg && mapPickerStyles.hintTextError,
              ]}
            >
              {pinErrorMsg
                ? pinErrorMsg
                : pinnedCoords
                  ? '✅ Location pinned! Tap Confirm to continue.'
                  : '👆 Tap anywhere in the Philippines to pin your home.'}
            </Text>
          </View>

          {/* Map */}
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            initialRegion={PH_CENTER_REGION}
            onPress={handleMapPress}
            onRegionChangeComplete={handleRegionChangeComplete}
            showsUserLocation
            showsMyLocationButton
            rotateEnabled={false}
            pitchEnabled={false}
          >
            {pinnedCoords && (
              <Marker
                coordinate={pinnedCoords}
                title="Your Home"
                description="This location will be used for your solar estimate."
                pinColor="#ffc928"
              />
            )}
          </MapView>

          {/* Footer */}
          <View style={mapPickerStyles.footer}>
            <TouchableOpacity
              style={[
                mapPickerStyles.confirmButton,
                !pinnedCoords && mapPickerStyles.confirmButtonDisabled,
              ]}
              onPress={confirmPinnedLocation}
              disabled={!pinnedCoords}
            >
              <Text style={mapPickerStyles.confirmButtonText}>
                Confirm Location
              </Text>
            </TouchableOpacity>

            {pinnedCoords && (
              <Text style={mapPickerStyles.coordsText}>
                {pinnedCoords.latitude.toFixed(5)},{' '}
                {pinnedCoords.longitude.toFixed(5)}
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const locationStyles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 56,
    left: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '700',
  },
});

const mapPickerStyles = StyleSheet.create({
  pinText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#765a00',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff8f1',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 14,
    backgroundColor: '#fff8f1',
    borderBottomWidth: 2,
    borderBottomColor: '#d2c5ac',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#765a00',
    width: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#201b11',
  },
  hintBanner: {
    backgroundColor: '#fdf2e2',
    borderBottomWidth: 2,
    borderBottomColor: '#d2c5ac',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  hintBannerError: {
    backgroundColor: '#fee2e2',
    borderBottomColor: '#fca5a5',
  },
  hintText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4e4633',
    textAlign: 'center',
  },
  hintTextError: {
    color: '#991b1b',
  },
  footer: {
    backgroundColor: '#fff8f1',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
    borderTopWidth: 2,
    borderTopColor: '#d2c5ac',
    gap: 8,
  },
  confirmButton: {
    backgroundColor: '#ffc928',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#d9a400',
  },
  confirmButtonDisabled: {
    backgroundColor: '#e5e7eb',
    borderBottomColor: '#d1d5db',
  },
  confirmButtonText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#201b11',
  },
  coordsText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: '#807660',
  },
});
