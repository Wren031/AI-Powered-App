import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { useProfileData } from '@/src/features/auth/hooks/useProfileData';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SettingItem from '../components/SettingItem';

interface SettingData {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  color: string;
  type?: 'arrow' | 'switch' | 'text';
  value?: string | boolean;
  onValueChange?: (val: boolean) => void;
}

interface SectionData {
  section: string;
  data: SettingData[];
}

export default function SettingsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const { profile, loading } = useProfileData();

  const { logout, loading: authLoading } = useAuth();

  const handleSignOut = () => {
      Alert.alert(
        "Sign Out",
        "Are you sure you want to log out of your account?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Log Out", 
            style: "destructive", 
            onPress: async () => {

              await logout();
              
              // Optional: If your app doesn't auto-redirect via Auth Guard
              // router.replace('/login'); 
            }
          }
        ]
      );
    };
    



  const SETTINGS_DATA: SectionData[] = [
    {
      section: "Account Management",
      data: [
        { id: 'personal', icon: "person-outline", title: "Personal Information", color: "#6366f1", type: 'arrow' },
        { 
          id: 'notif', 
          icon: "notifications-outline", 
          title: "Notifications", 
          type: "switch", 
          value: notifications, 
          onValueChange: (val: boolean) => setNotifications(val), 
          color: "#f59e0b" 
        },
        { id: 'privacy', icon: "lock-closed-outline", title: "Privacy & Security", color: "#10b981", type: 'arrow' },
      ]
    },
    {
      section: "App Preferences",
      data: [
        { id: 'lang', icon: "language-outline", title: "Language", type: "text", value: "English", color: "#8b5cf6" },
        { 
          id: 'dark', 
          icon: "moon-outline", 
          title: "Dark Mode", 
          type: "switch", 
          value: darkMode, 
          onValueChange: (val: boolean) => setDarkMode(val), 
          color: "#475569" 
        },
      ]
    },
    {
      section: "Support & Legal",
      data: [
        { id: 'help', icon: "help-circle-outline", title: "Help Center", color: "#0ea5e9", type: 'arrow' },
        { id: 'about', icon: "information-circle-outline", title: "About Us", color: "#64748b", type: 'arrow' },
      ]
    }
  ];

  const filteredSettings = useMemo(() => {
    if (!searchQuery.trim()) return SETTINGS_DATA;
    return SETTINGS_DATA.map(section => ({
      ...section,
      data: section.data.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(section => section.data.length > 0);
  }, [searchQuery, notifications, darkMode]);


  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#6366f1" />
      </SafeAreaView>
    );
  }

  const fullName = [profile?.first_name, profile?.middle_name, profile?.last_name].filter(Boolean).join(' ') || 'Guest User';

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#94a3b8" />
            <TextInput
              placeholder="Search settings..."
              placeholderTextColor="#94a3b8"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Profile Card */}
          {!searchQuery && (
            <TouchableOpacity 
              activeOpacity={0.8} 
              style={styles.profileCard} 
              onPress={() => router.push('/setup-profile')}
            >
              <Image
                source={{ uri: profile?.avatar_url || `https://ui-avatars.com/api/?name=${fullName}&background=6366f1&color=fff` }}
                style={styles.avatar}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{fullName}</Text>
                <Text style={styles.profileEmail}>{profile?.email || 'View your profile'}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
            </TouchableOpacity>
          )}

          {/* Dynamic Sections */}
          {filteredSettings.map((section) => (
            <View key={section.section}>
              <Text style={styles.sectionLabel}>{section.section}</Text>
              <View style={styles.group}>
                {section.data.map((item, index) => (
                  <SettingItem
                    key={item.id}
                    icon={item.icon}
                    title={item.title}
                    color={item.color}
                    type={item.type}
                    value={item.value}
                    onValueChange={item.onValueChange}
                    isLast={index === section.data.length - 1}
                    onPress={() => {
                      if (item.id === 'personal') {
                        router.push('/personal-info');
                      }
                      if (item.id === 'privacy'){
                        router.push('/privacy-security');
                      }
                      if (item.id === 'help'){
                        router.push('/help-center');
                      }
                      if (item.id === 'about'){
                        router.push('/about-us');
                      }
                    }}
                  />
                ))}
              </View>
            </View>
          ))}

          {/* Results Empty State */}
          {filteredSettings.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No results found for "{searchQuery}"</Text>
            </View>
          )}

          {/* Professional Sign Out Section */}
          {!searchQuery && (
            <View style={{ marginTop: 10 }}>
              <Text style={styles.sectionLabel}>Account Actions</Text>
              <View style={styles.group}>
                <TouchableOpacity 
                  style={styles.logoutRow} 
                  activeOpacity={0.7}
                  onPress={handleSignOut}
                >
                  <View style={styles.logoutIconContainer}>
                    <Ionicons name="log-out" size={20} color="#ef4444" />
                  </View>
                  <Text style={styles.logoutText}>Sign Out</Text>
                  <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.versionText}>Version 1.0.4 (Build 102)</Text>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerContainer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  headerTitle: { fontSize: 32, fontWeight: '800', color: '#0f172a', marginBottom: 16 },
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    paddingHorizontal: 12, 
    height: 48, 
    borderRadius: 14, 
    borderWidth: 1, 
    borderColor: '#e2e8f0' 
  },
  searchInput: { flex: 1, fontSize: 16, marginLeft: 10, color: '#0f172a' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  
  // Profile Card
  profileCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 22, 
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  avatar: { width: 60, height: 60, borderRadius: 18, backgroundColor: '#f1f5f9' },
  profileInfo: { flex: 1, marginLeft: 16 },
  profileName: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  profileEmail: { fontSize: 14, color: '#64748b', marginTop: 2 },
  
  // Group Styling
  sectionLabel: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#94a3b8', 
    textTransform: 'uppercase', 
    marginBottom: 12, 
    marginLeft: 4,
    letterSpacing: 0.5 
  },
  group: { 
    backgroundColor: '#fff', 
    borderRadius: 22, 
    paddingHorizontal: 16, 
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  
  // Sign Out Row
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  logoutIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoutText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  
  // Footer
  emptyContainer: { marginTop: 40, alignItems: 'center' },
  emptyText: { color: '#94a3b8', fontSize: 15 },
  versionText: { 
    textAlign: 'center', 
    color: '#cbd5e1', 
    fontSize: 12, 
    marginTop: 10, 
    fontWeight: '600',
    letterSpacing: 1 
  }
});