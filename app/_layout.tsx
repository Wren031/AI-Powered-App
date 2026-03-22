import { supabase } from '@/src/features/lib/supabase';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const router = useRouter();

useEffect(() => {
    // Listen for the moment the session is created after Google redirect
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        // Redirect to your tabs folder
        router.replace('/(tabs)/home'); 
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="verify" />
        <Stack.Screen name="setup-profile" />
        <Stack.Screen name="(tabs)" /> 
      </Stack>
    </SafeAreaProvider>
  );
}