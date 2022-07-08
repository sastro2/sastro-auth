import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type HeaderProps = {
  label: string;
};

export default function Header(props: HeaderProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.label}>{props.label}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#64bddb',
  },
  container: {
    paddingBottom: 20,
  },
  label: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
