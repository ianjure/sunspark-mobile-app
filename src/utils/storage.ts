import { SunsparkResult } from '@/src/types/sunspark';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEY = 'sunspark_result';

export async function saveResult(result: SunsparkResult): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(result));
}

export async function loadResult(): Promise<SunsparkResult | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as SunsparkResult) : null;
}

export async function clearResult(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
