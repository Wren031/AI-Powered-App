import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView, StyleSheet,
  Text, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { useProfileData } from '@/src/features/auth/hooks/useProfileData';
export default function HomeScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const { profile, loading } = useProfileData();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{profile?.first_name || 'User'} {profile?.last_name || 'User'}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/setup-profile')}>
           <Image 
            source={{ uri: profile?.avatar_url || 'https://via.placeholder.com/150' }} 
            style={styles.avatarThumb} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>Account Status: {profile?.status || 'Active'}</Text>
          <Text style={styles.cardSubtitle}>
            Your profile is 100% complete. You can now access all AI features.
          </Text>
        </View>

        <View style={styles.grid}>
          <TouchableOpacity style={styles.box}>
            <View style={styles.iconPlaceholder} />
            <Text style={styles.boxText}>Scan Skin</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.box}>
            <View style={styles.iconPlaceholder} />
            <Text style={styles.boxText}>History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Profile Overview</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender:</Text>
            <Text style={styles.infoValue}>{profile?.gender || 'Not set'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location:</Text>
            <Text style={styles.infoValue}>{profile?.address || 'Not set'}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout Session</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  welcomeText: { fontSize: 14, color: '#999', fontWeight: '500' },
  userName: { fontSize: 24, fontWeight: '800', color: '#1A1A1A' },
  avatarThumb: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#EEE'
  },
  content: { padding: 24 },
  mainCard: {
    backgroundColor: '#000',
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 6 },
  cardSubtitle: { color: '#AAA', fontSize: 14, lineHeight: 20 },
  grid: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  box: {
    flex: 1,
    height: 110,
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  iconPlaceholder: { width: 30, height: 30, backgroundColor: '#DDD', borderRadius: 8, marginBottom: 10 },
  boxText: { fontWeight: '700', color: '#1A1A1A', fontSize: 15 },
  infoSection: { marginBottom: 32 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 16 },
  infoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F5F5F5' 
  },
  infoLabel: { color: '#666', fontSize: 14 },
  infoValue: { color: '#1A1A1A', fontWeight: '600', fontSize: 14 },
  logoutBtn: {
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF3B30',
    marginTop: 10,
  },
  logoutText: { color: '#FF3B30', fontWeight: '700', fontSize: 16 }
});