import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PrimaryButton from '@/src/components/PrimaryButton';
import { APP_BACKGROUND_COLOR } from '@/src/constants/colors';
import { FONT_INTER_BOLD } from '@/src/constants/fonts';

type Coordinates = {
  latitude: number;
  longitude: number;
};

type LocationMapPickerBottomSheetProps = {
  onConfirm: (coordinates: Coordinates) => void;
};

const PH_BOUNDS = {
  minLat: 4.5,
  maxLat: 21.5,
  minLon: 116.0,
  maxLon: 127.0,
};

const PH_CENTER_REGION: Region = {
  latitude: 12.8797,
  longitude: 121.774,
  latitudeDelta: 18,
  longitudeDelta: 12,
};

const MAX_LATITUDE_DELTA = 18;
const MAX_LONGITUDE_DELTA = 12;
const SHEET_TOP_OFFSET = 100;
const SHEET_TOP_RADIUS = 20;
const SHEET_HANDLE_HEIGHT = 24;
const INSTRUCTION_HEIGHT = 50;
const MAP_BUTTON_GAP = 18;
const BOTTOM_PADDING = 16;

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

const LocationMapPickerBottomSheet = forwardRef<
  BottomSheetModal,
  LocationMapPickerBottomSheetProps
>(function LocationMapPickerBottomSheet({ onConfirm }, ref) {
  const [pinnedCoords, setPinnedCoords] = useState<Coordinates | null>(null);
  const mapRef = useRef<MapView>(null);
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  const mapSheetHeight = Math.max(
    windowHeight - insets.top - SHEET_TOP_OFFSET,
    1,
  );
  const mapSheetContentHeight = Math.max(
    mapSheetHeight - SHEET_HANDLE_HEIGHT,
    1,
  );
  const mapSheetSnapPoints = useMemo(() => [mapSheetHeight], [mapSheetHeight]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.45}
        pressBehavior="close"
      />
    ),
    [],
  );

  const renderHandle = useCallback(
    () => (
      <View style={mapPickerStyles.handle}>
        <View style={mapPickerStyles.handleIndicator} />
      </View>
    ),
    [],
  );

  const handleDismiss = useCallback(() => {
    setPinnedCoords(null);
  }, []);

  function handleMapPress(e: MapPressEvent) {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    if (!isInsidePhilippines(latitude, longitude)) {
      setPinnedCoords(null);
      return;
    }

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
    onConfirm(pinnedCoords);
  }

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={mapSheetSnapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      enableContentPanningGesture={false}
      backdropComponent={renderBackdrop}
      handleComponent={renderHandle}
      topInset={insets.top + SHEET_TOP_OFFSET}
      bottomInset={insets.bottom}
      backgroundStyle={mapPickerStyles.sheetBackground}
      keyboardBehavior="extend"
      onDismiss={handleDismiss}
    >
      <BottomSheetView
        style={[
          mapPickerStyles.modalContainer,
          { height: mapSheetContentHeight },
        ]}
      >
        <View style={mapPickerStyles.instructionSection}>
          <Text style={mapPickerStyles.instructionText}>
            Tap to pin your home
          </Text>
        </View>

        <View style={mapPickerStyles.mapFrame}>
          <MapView
            ref={mapRef}
            style={mapPickerStyles.map}
            initialRegion={PH_CENTER_REGION}
            onPress={handleMapPress}
            onRegionChangeComplete={handleRegionChangeComplete}
            showsUserLocation
            showsMyLocationButton
            rotateEnabled={false}
            pitchEnabled={false}
          >
            {pinnedCoords && (
              <Marker coordinate={pinnedCoords} pinColor="#ffc928" />
            )}
          </MapView>
        </View>

        <View
          style={[
            mapPickerStyles.footer,
            { paddingBottom: insets.bottom + BOTTOM_PADDING },
          ]}
        >
          <PrimaryButton
            label="CONFIRM LOCATION"
            onPress={confirmPinnedLocation}
            disabled={!pinnedCoords}
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default LocationMapPickerBottomSheet;

const mapPickerStyles = StyleSheet.create({
  modalContainer: {
    backgroundColor: APP_BACKGROUND_COLOR,
    overflow: 'hidden',
  },
  sheetBackground: {
    backgroundColor: APP_BACKGROUND_COLOR,
    borderTopLeftRadius: SHEET_TOP_RADIUS,
    borderTopRightRadius: SHEET_TOP_RADIUS,
  },
  handle: {
    height: SHEET_HANDLE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_BACKGROUND_COLOR,
    borderTopLeftRadius: SHEET_TOP_RADIUS,
    borderTopRightRadius: SHEET_TOP_RADIUS,
  },
  handleIndicator: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#667085',
  },
  instructionSection: {
    height: INSTRUCTION_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  instructionText: {
    fontFamily: FONT_INTER_BOLD,
    fontSize: 20,
    fontWeight: '700',
    color: '#17202A',
    textAlign: 'center',
    paddingBottom: 10,
  },
  mapFrame: {
    flex: 1,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#D0D5DD',
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  footer: {
    paddingTop: MAP_BUTTON_GAP,
  },
});
