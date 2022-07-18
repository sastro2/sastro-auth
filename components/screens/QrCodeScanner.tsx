import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../../App';
import { addCode, loadCodes } from '../../utils/storageMethods';
import Header from '../Header';
import type { AuthCode } from './AuthCodes';

type QrScannerProps = NativeStackScreenProps<
  RootStackParamList,
  'QrCodeScanner'
>;

export default function QrCodeScanner(props: QrScannerProps) {
  const [hasCameraPermission, sethasCameraPermission] =
    useState<boolean>(false);
  const [scanned, setScanned] = useState<boolean>(false);

  let camera: Camera | null;

  const askForCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();

    if (status === 'granted') {
      sethasCameraPermission(true);
    } else {
      props.navigation.push('AuthCodes');
    }
  };

  useEffect(() => {
    askForCameraPermission();
  }, []);

  const handleQrCodeScanned = async ({ data }: BarCodeScannerResult) => {
    if (data) {
      setScanned(true);

      const newData = data.split(',');
      const code: AuthCode = {
        seed: newData[0],
        twoFaUnixT0: parseInt(newData[1]),
        name: newData[2],
      };

      const codes = await loadCodes();
      if (
        codes.find((code) => {
          code.seed === newData[0];
        })
      ) {
        return;
      }

      await addCode(code);
      props.navigation.push('AuthCodes');
    }
  };

  return (
    <>
      <Header label="Auth" />
      <View style={{ flex: 1 }}>
        {hasCameraPermission ? (
          <>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleQrCodeScanned}
              style={{ height: 654, width: 368 }}
            />
          </>
        ) : (
          <>
            <Text>Requesting Access</Text>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
