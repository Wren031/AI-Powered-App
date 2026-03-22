import { Ionicons } from '@expo/vector-icons'; // Built-in with Expo
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarActiveTintColor: '#000',
    }}>
    <Tabs.Screen
      name="home"
      options={{
        title: 'Home',
        tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
      }}
/>

    </Tabs>
  );
}