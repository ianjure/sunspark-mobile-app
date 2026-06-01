import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackArrowButton from '@/src/components/BackArrowButton';
import OnboardingProgressBar from '@/src/components/OnboardingProgressBar';
import PrimaryButton from '@/src/components/PrimaryButton';
import SecondaryButton from '@/src/components/SecondaryButton';
import { API_URL } from '@/src/constants/api';
import { APP_BACKGROUND_COLOR } from '@/src/constants/colors';
import { RootStackParamList } from '@/src/navigation/types';
import { styles } from '@/src/styles/styles';
import { SunsparkResult } from '@/src/types/sunspark';

type Props = NativeStackScreenProps<RootStackParamList, 'ScanBill'>;

const TITLE_TOP = 30;
const TITLE_FONT_SIZE = 24;
const TITLE_LINE_HEIGHT = TITLE_FONT_SIZE * 1.3;
const SUBTITLE_GAP = 14;
const SUBTITLE_TOP = TITLE_TOP + TITLE_LINE_HEIGHT + SUBTITLE_GAP;
const SUBTITLE_FONT_SIZE = 14;
const SUBTITLE_LINE_HEIGHT = SUBTITLE_FONT_SIZE * 1.5;
const SUBTITLE_LINES = 2;
const SUBTITLE_HEIGHT = SUBTITLE_LINE_HEIGHT * SUBTITLE_LINES;
const FRAME_TOP = SUBTITLE_TOP + SUBTITLE_HEIGHT + 30;

export default function ScanBillScreen({ navigation, route }: Props) {
  const cameraRef = useRef<CameraView>(null);

  const { latitude, longitude } = route.params;

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [apiErrorMsg, setApiErrorMsg] = useState<string | null>(null);

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
      setApiErrorMsg(null);
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
    setApiErrorMsg(null);
  }

  async function analyzeBill() {
    if (!photoUri) return;
    try {
      setIsUploading(true);
      setApiErrorMsg(null);

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
      setApiErrorMsg(error.message || 'Something went wrong.');
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
      {/* ── Top bar ── */}
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

      {/* ── Body ── */}
      <View style={{ flex: 1 }}>
        {/* Title */}
        <Text
          style={[
            styles.title,
            {
              position: 'absolute',
              top: TITLE_TOP,
              left: 20,
              right: 20,
              fontSize: TITLE_FONT_SIZE,
              lineHeight: TITLE_LINE_HEIGHT,
            },
          ]}
        >
          Scan your electric bill
        </Text>

        {/* Subtitle */}
        <Text
          style={[
            styles.subtitle,
            {
              position: 'absolute',
              top: SUBTITLE_TOP,
              left: 20,
              right: 20,
              marginTop: 0,
              fontSize: SUBTITLE_FONT_SIZE,
              lineHeight: SUBTITLE_LINE_HEIGHT,
            },
          ]}
        >
          Take a clear photo of your latest electric bill so Sunspark can
          estimate your solar savings.
        </Text>

        {/* ── Photo / Camera frame — fixed, never resizes ── */}
        <View
          style={{
            position: 'absolute',
            top: FRAME_TOP,
            left: 20,
            right: 20,
            bottom: 20,
            borderRadius: 20,
            borderWidth: 2,
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

        {/* Loading / Error */}
        {isUploading && (
          <View
            style={[
              styles.loadingBox,
              { position: 'absolute', alignSelf: 'center', bottom: 160 },
            ]}
          >
            <ActivityIndicator />
            <Text style={styles.text}>Reading your bill data...</Text>
          </View>
        )}

        {apiErrorMsg && (
          <Text
            style={[
              styles.error,
              { position: 'absolute', bottom: 160, alignSelf: 'center' },
            ]}
          >
            {apiErrorMsg}
          </Text>
        )}
      </View>

      {/* ── Pinned buttons — mirrors Location screen pattern ── */}
      <PrimaryButton
        label={getPrimaryLabel()}
        onPress={handlePrimaryPress}
        disabled={isTakingPhoto || isUploading}
      />
      <View style={{ height: 10 }} />
      <SecondaryButton
        label="RETAKE PHOTO"
        onPress={retakePhoto}
        disabled={isUploading || !photoUri}
        style={{ marginBottom: 20, opacity: photoUri ? 1 : 0 }}
      />
    </SafeAreaView>
  );
}
