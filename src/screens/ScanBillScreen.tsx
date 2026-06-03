import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackArrowButton from '@/src/components/icons/BackArrowButton';
import LoadingOverlay from '@/src/components/LoadingOverlay';
import OnboardingProgressBar from '@/src/components/OnboardingProgressBar';
import PrimaryButton from '@/src/components/PrimaryButton';
import SecondaryButton from '@/src/components/SecondaryButton';
import TextCombo from '@/src/components/TextCombo';
import Toast from '@/src/components/Toast';
import { API_URL } from '@/src/constants/api';
import { APP_BACKGROUND_COLOR } from '@/src/constants/colors';
import { RootStackParamList } from '@/src/navigation/types';
import { SunsparkResult } from '@/src/types/sunspark';

type Props = NativeStackScreenProps<RootStackParamList, 'ScanBill'>;

export default function ScanBillScreen({ navigation, route }: Props) {
  const cameraRef = useRef<CameraView>(null);

  const { latitude, longitude } = route.params;

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handlePrimaryPress() {
    if (!cameraPermission?.granted) {
      await requestCameraPermission();
      return;
    }
    if (photoUri) {
      await analyzeBill();
      return;
    }
    await takePhoto();
  }

  async function takePhoto() {
    if (!cameraRef.current || isTakingPhoto) return;
    try {
      setIsTakingPhoto(true);
      setErrorMsg(null);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      setPhotoUri(photo.uri);
    } catch (error) {
      console.log('Error taking photo:', error);
    } finally {
      setIsTakingPhoto(false);
    }
  }

  function retakePhoto() {
    setPhotoUri(null);
    setErrorMsg(null);
  }

  async function analyzeBill() {
    if (!photoUri) return;
    try {
      setIsUploading(true);
      setErrorMsg(null);

      const formData = new FormData();
      formData.append('file', {
        uri: photoUri,
        name: 'electric-bill.jpg',
        type: 'image/jpeg',
      } as any);
      formData.append('lat', String(latitude));
      formData.append('lon', String(longitude));

      const response = await fetch(API_URL, { method: 'POST', body: formData });
      const responseText = await response.text();

      let data: SunsparkResult;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(`Server did not return JSON: ${responseText}`);
      }

      if (!response.ok || !data.success) {
        throw new Error('Failed to analyze bill.');
      }

      navigation.replace('EditBill', { result: data, latitude, longitude });
    } catch (error: any) {
      console.log('Analyze bill error:', error);
      setErrorMsg(error.message || 'Something went wrong.');
    } finally {
      setIsUploading(false);
    }
  }

  function getPrimaryLabel() {
    if (!cameraPermission?.granted) return 'ALLOW ACCESS TO CAMERA';
    if (photoUri) return isUploading ? 'ANALYZING...' : 'CONTINUE';
    return isTakingPhoto ? 'CAPTURING...' : 'TAKE A PHOTO';
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: APP_BACKGROUND_COLOR }}
      edges={['top', 'bottom']}
    >
      <Toast message={errorMsg} onDismiss={() => setErrorMsg(null)} />
      <LoadingOverlay
        visible={isUploading}
        message="Reading your bill data..."
      />

      <View style={{ flexDirection: 'row', marginRight: 20 }}>
        <BackArrowButton onPress={() => navigation.replace('Location')} />
        <View
          style={{
            flex: 1,
            marginLeft: 20,
            paddingTop: 25,
            justifyContent: 'center',
          }}
        >
          <OnboardingProgressBar step={2} />
        </View>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 25 }}>
        <TextCombo
          title="Scan your electric bill"
          subtitle={
            'Take a clear photo of your latest electric bill\nto estimate your solar savings.'
          }
        />

        <View
          style={{
            flex: 1,
            marginTop: 20,
            marginBottom: 20,
            borderRadius: 10,
            borderWidth: 4,
            borderColor: '#D0D5DD',
            overflow: 'hidden',
          }}
        >
          {photoUri ? (
            <Image
              source={{ uri: photoUri }}
              style={{ flex: 1 }}
              resizeMode="cover"
            />
          ) : (
            cameraPermission?.granted && (
              <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />
            )
          )}
        </View>
      </View>

      <PrimaryButton
        label={getPrimaryLabel()}
        onPress={handlePrimaryPress}
        loading={isTakingPhoto || isUploading}
        disabled={false}
      />
      <View style={{ height: 15 }} />
      <SecondaryButton
        label="RETAKE PHOTO"
        onPress={retakePhoto}
        disabled={isUploading || !photoUri}
        style={{ marginBottom: 22, opacity: photoUri ? 1 : 0 }}
      />
    </SafeAreaView>
  );
}
