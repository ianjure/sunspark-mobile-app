import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CloseButton from '@/src/components/CloseButton';
import LocationMapPickerBottomSheet from '@/src/components/LocationMapPickerBottomSheet';
import OnboardingProgressBar from '@/src/components/OnboardingProgressBar';
import PrimaryButton from '@/src/components/PrimaryButton';
import SecondaryButton from '@/src/components/SecondaryButton';
import TextCombo from '@/src/components/TextCombo';
import { APP_BACKGROUND_COLOR } from '@/src/constants/colors';
import { FONT_INTER_BLACK, FONT_INTER_BOLD } from '@/src/constants/fonts';
import { RootStackParamList } from '@/src/navigation/types';
import { styles } from '@/src/styles/styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Location'>;

type Coordinates = {
  latitude: number;
  longitude: number;
};

export default function LocationScreen({ navigation }: Props) {
  const [locationErrorMsg, setLocationErrorMsg] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  function openMapPicker() {
    bottomSheetModalRef.current?.present();
  }

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

  function confirmPinnedLocation(coordinates: Coordinates) {
    bottomSheetModalRef.current?.dismiss();
    navigation.replace('ScanBill', coordinates);
  }

  return (
    <SafeAreaView style={locationStyles.screen} edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', marginRight: 20 }}>
        <CloseButton onPress={() => navigation.replace('Welcome')} />
        <View
          style={{
            flex: 1,
            marginLeft: 20,
            paddingTop: 25,
            justifyContent: 'center',
          }}
        >
          <OnboardingProgressBar step={1} />
        </View>
      </View>

      <View style={locationStyles.heroSection}>
        <TextCombo
          title="Where is your home?"
          subtitle={
            "We need your location to estimate your home's solar potential and find nearby providers."
          }
        />

        {locationErrorMsg && (
          <Text style={styles.error}>{locationErrorMsg}</Text>
        )}

        {locationLoading && <ActivityIndicator style={{ marginTop: 8 }} />}
      </View>

      <PrimaryButton
        label="USE MY CURRENT LOCATION"
        onPress={enableLocation}
        loading={locationLoading}
        disabled={false}
      />
      <View style={{ height: 15 }} />
      <SecondaryButton
        label="PIN MY HOUSE ON THE MAP"
        onPress={openMapPicker}
        style={locationStyles.lastButton}
      />

      <LocationMapPickerBottomSheet
        ref={bottomSheetModalRef}
        onConfirm={confirmPinnedLocation}
      />
    </SafeAreaView>
  );
}

const locationStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: APP_BACKGROUND_COLOR,
  },
  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  heroEmoji: {
    fontSize: 80,
    marginBottom: 8,
  },
  heroTitle: {
    fontFamily: FONT_INTER_BLACK,
    fontSize: 26,
    fontWeight: '900',
    color: '#201b11',
    textAlign: 'center',
    lineHeight: 34,
  },
  heroSubtitle: {
    fontFamily: FONT_INTER_BOLD,
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  lastButton: {
    marginBottom: 22,
  },
});
