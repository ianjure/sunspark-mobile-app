import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { APP_BACKGROUND_COLOR } from '@/src/constants/colors';
import { RootStackParamList } from '@/src/navigation/types';
import { STORAGE_KEY } from '@/src/utils/storage';

import Logo from '@/src/components/icons/Logo';

type Props = NativeStackScreenProps<RootStackParamList, 'Loading'>;

export default function LoadingScreen({ navigation }: Props) {
  useEffect(() => {
    async function checkSavedResult() {
      try {
        const savedResult = await AsyncStorage.getItem(STORAGE_KEY);

        if (savedResult) {
          navigation.replace('Main');
        } else {
          navigation.replace('Welcome');
        }
      } catch (error) {
        console.log('AsyncStorage read error:', error);
        navigation.replace('Welcome');
      }
    }

    checkSavedResult();
  }, [navigation]);

  return (
    <View style={styles.screen}>
      <Logo height={34} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: APP_BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
