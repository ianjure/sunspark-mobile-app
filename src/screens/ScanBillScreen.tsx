import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { API_URL } from '@/src/constants/api';
import { RootStackParamList } from '@/src/navigation/types';
import { styles } from '@/src/styles/styles';
import { SunsparkResult } from '@/src/types/sunspark';

type Props = NativeStackScreenProps<RootStackParamList, 'ScanBill'>;

export default function ScanBillScreen({ navigation, route }: Props) {
  const cameraRef = useRef<CameraView>(null);

  const { latitude, longitude } = route.params;

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [apiErrorMsg, setApiErrorMsg] = useState<string | null>(null);

  async function takePhoto() {
    if (!cameraRef.current || isTakingPhoto) return;

    try {
      setIsTakingPhoto(true);
      setApiErrorMsg(null);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

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
    if (!photoUri) {
      setApiErrorMsg('Please take a photo first.');
      return;
    }

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

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

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

      navigation.replace('EditBill', {
        result: data,
      });
    } catch (error: any) {
      console.log('Analyze bill error:', error);
      setApiErrorMsg(error.message || 'Something went wrong.');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Scan Your Electric Bill</Text>
      <Text style={styles.subtitle}>
        Take a clear photo of your latest electric bill so Sunspark can estimate
        your solar savings.
      </Text>

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
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={retakePhoto}
              disabled={isUploading}
            >
              <Text style={styles.secondaryButtonText}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={analyzeBill}
              disabled={isUploading}
            >
              <Text style={styles.primaryButtonText}>
                {isUploading ? 'Analyzing...' : 'Analyze Bill'}
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
              {isTakingPhoto ? 'Taking...' : 'Take Photo'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {isUploading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator />
          <Text style={styles.text}>Reading your bill and solar data...</Text>
        </View>
      )}

      {apiErrorMsg && <Text style={styles.error}>{apiErrorMsg}</Text>}
    </ScrollView>
  );
}
