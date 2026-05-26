import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { RootStackParamList } from '@/src/navigation/types';
import { styles } from '@/src/styles/styles';
import { STORAGE_KEY } from '@/src/utils/storage';

import Logo from '@/src/components/Logo';

type Props = NativeStackScreenProps<RootStackParamList, 'Loading'>;

export default function LoadingScreen({ navigation }: Props) {
  useEffect(() => {
    async function checkSavedResult() {
      try {
        const savedResult = await AsyncStorage.getItem(STORAGE_KEY);

        if (savedResult) {
          navigation.replace('Main');
        } else {
          navigation.replace('Location');
        }
      } catch (error) {
        console.log('AsyncStorage read error:', error);
        navigation.replace('Location');
      }
    }

    checkSavedResult();
  }, [navigation]);

  return (
    <View style={styles.screen}>
      <Logo width={42} height={42} />
      <ActivityIndicator style={{ marginTop: 16 }} />
    </View>
  );
}
