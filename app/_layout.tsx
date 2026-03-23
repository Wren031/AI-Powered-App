
import { Stack } from 'expo-router';

import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {

  return (
    <SafeAreaProvider>
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />

      <Stack.Screen name="signup" />
      <Stack.Screen name="verify" />
      <Stack.Screen name="setup-profile" />
      <Stack.Screen name="camera-scan" />
      <Stack.Screen name="result-scan" />

      <Stack.Screen name="settings" />
      <Stack.Screen name="progress" />
      <Stack.Screen name="history" />
      <Stack.Screen name="personal-info" />
      <Stack.Screen name="privacy-security" />
      <Stack.Screen name="change-password" />
      <Stack.Screen name="about-us" />
      <Stack.Screen name="help-center" />
      
    </Stack>
    </SafeAreaProvider>
  );
}


      {/* <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="verify" />
        <Stack.Screen name="setup-profile" />
        <Stack.Screen name="camera-scan" />
        <Stack.Screen name="result-scan" />
        <Stack.Screen name="(tabs)" /> 
        
      </Stack> */}