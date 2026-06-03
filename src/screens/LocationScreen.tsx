import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { useRef, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CloseButton from '@/src/components/icons/CloseButton';
import LocationIllustration from '@/src/components/illustrations/LocationIllustration';
import LoadingOverlay from '@/src/components/LoadingOverlay';
import LocationMapPickerBottomSheet from '@/src/components/LocationMapPickerBottomSheet';
import OnboardingProgressBar from '@/src/components/OnboardingProgressBar';
import PrimaryButton from '@/src/components/PrimaryButton';
import SecondaryButton from '@/src/components/SecondaryButton';
import TextCombo from '@/src/components/TextCombo';
import Toast from '@/src/components/Toast';
import { APP_BACKGROUND_COLOR } from '@/src/constants/colors';
import { RootStackParamList } from '@/src/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Location'>;

type Coordinates = {
  latitude: number;
  longitude: number;
};

export default function LocationScreen({ navigation }: Props) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  function openMapPicker() {
    bottomSheetModalRef.current?.present();
  }

  async function enableLocation() {
    try {
      setLocationLoading(true);
      setErrorMsg(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied.');
        return;
      }

      // Use last known position instantly if available
      const lastKnown = await Location.getLastKnownPositionAsync({
        maxAge: 5 * 60 * 1000, // accept positions up to 5 minutes old
        requiredAccuracy: 500, // within 500 meters is good enough
      });

      if (lastKnown) {
        navigation.replace('ScanBill', {
          latitude: lastKnown.coords.latitude,
          longitude: lastKnown.coords.longitude,
        });
        return;
      }

      // No recent fix — fall back to full acquisition
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      navigation.replace('ScanBill', {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    } catch (error) {
      console.log('Location error:', error);
      setErrorMsg('Unable to get your current location.');
    } finally {
      setLocationLoading(false);
    }
  }

  function confirmPinnedLocation(coordinates: Coordinates) {
    bottomSheetModalRef.current?.dismiss();
    navigation.replace('ScanBill', coordinates);
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: APP_BACKGROUND_COLOR }}
      edges={['top', 'bottom']}
    >
      <Toast message={errorMsg} onDismiss={() => setErrorMsg(null)} />
      <LoadingOverlay
        visible={locationLoading}
        message="Getting your location..."
      />

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

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
        }}
      >
        <LocationIllustration height={280} />
        <TextCombo
          title="Where is your home?"
          subtitle={
            "We need your location to estimate your home's\nsolar potential and find nearby providers."
          }
        />
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
        style={{ marginBottom: 22 }}
      />

      <LocationMapPickerBottomSheet
        ref={bottomSheetModalRef}
        onConfirm={confirmPinnedLocation}
      />
    </SafeAreaView>
  );
}
