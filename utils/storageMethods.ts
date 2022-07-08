import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthCode } from '../components/screens/AuthCodes';

const STORE_KEY = '@authenticator';

export const saveCodes = async (codes: AuthCode[]) => {
  await AsyncStorage.setItem(STORE_KEY, JSON.stringify(codes));
};

export const loadCodes = async (): Promise<AuthCode[]> => {
  const stringifiedCodes = await AsyncStorage.getItem(STORE_KEY);

  if (!stringifiedCodes) {
    return [];
  }
  const codes = JSON.parse(stringifiedCodes);

  return codes;
};

export const addCode = async (code: AuthCode): Promise<AuthCode[]> => {
  const codes = await loadCodes();
  codes.push(code);
  await saveCodes(codes);

  return codes;
};
