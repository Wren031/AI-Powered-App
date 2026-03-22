
import { Stack } from 'expo-router';

import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="verify" />
        <Stack.Screen name="setup-profile" />
        <Stack.Screen name="camera-scan" />
        <Stack.Screen name="result-scan" />
        <Stack.Screen name="(tabs)" /> 
      </Stack>
    </SafeAreaProvider>
  );
}