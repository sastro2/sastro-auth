import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthCodes from './components/screens/AuthCodes';
import QrCodeScanner from './components/screens/QrCodeScanner';

export type RootStackParamList = {
  AuthCodes: undefined;
  QrCodeScanner: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="AuthCodes" component={AuthCodes} />
        <RootStack.Screen name="QrCodeScanner" component={QrCodeScanner} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
