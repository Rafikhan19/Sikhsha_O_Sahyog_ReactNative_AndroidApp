import { StatusBar } from 'expo-status-bar';
import { StyleSheet, AppRegistry, View } from 'react-native';
import StackNavigator from './navigation/StackNavigator';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <StackNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2D2FE',
  },
});

AppRegistry.registerComponent('App', () => App);
