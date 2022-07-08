import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AutoFocus } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../../App';
import { addCode, loadCodes } from '../../utils/storageMethods';
import CodeItem from '../CodeItem';
import Header from '../Header';

type AuthCodesProps = NativeStackScreenProps<RootStackParamList, 'AuthCodes'>;

export type AuthCode = {
  seed: string;
  twoFaUnixT0: number;
  name: string;
};

export default function AuthCodes(props: AuthCodesProps) {
  const [codes, setCodes] = useState<AuthCode[]>([]);

  const renderItem = (codeObject) => {
    const code = codeObject.item;

    return <CodeItem code={code} />;
  };

  const initializeCodes = async () => {
    const loadedCodes = await loadCodes();
    if (!(codes.length === loadedCodes.length)) {
      setCodes(loadedCodes);
    }
  };

  initializeCodes();

  return (
    <>
      <Header label="Auth" />
      <View style={styles.container}>
        <Button
          title="Scan QR Code"
          onPress={() => {
            props.navigation.push('QrCodeScanner');
          }}
        ></Button>
        <Button
          title="Delete Codes"
          onPress={async () => {
            await AsyncStorage.clear();
            setCodes([]);
          }}
        ></Button>
        <StatusBar style="auto" />
      </View>
      <View>
        <FlatList
          data={codes}
          style={styles.list}
          renderItem={renderItem}
          keyExtractor={(item) => item.seed}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  list: {
    marginTop: 30,
    paddingHorizontal: 30,
  },
});
