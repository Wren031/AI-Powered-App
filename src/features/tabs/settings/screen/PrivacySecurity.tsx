import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const ACCENT_COLOR = '#FF768E';
const DANGER_COLOR = '#EF4444';

export default function PrivacySecurityScreen() {
  const router = useRouter();

    const handlePasswordChange = () => {
    router.push('/change-password'); 
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure? This action is permanent and all your data will be wiped.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete Forever", style: "destructive", onPress: () => console.log("Account Deleted") }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Minimal Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        
        {/* Security Section */}
        <Text style={styles.sectionLabel}>Security Settings</Text>
        <TouchableOpacity 
          style={styles.actionCard} 
          onPress={handlePasswordChange}
          activeOpacity={0.7}
        >
          <View style={styles.iconBox}>
            <Ionicons name="key-outline" size={22} color={ACCENT_COLOR} />
          </View>
          <View style={styles.textStack}>
            <Text style={styles.actionTitle}>Change Password</Text>
            <Text style={styles.actionSub}>Update your login credentials</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
        </TouchableOpacity>

        {/* Danger Zone */}
        <Text style={[styles.sectionLabel, { marginTop: 40 }]}>Danger Zone</Text>
        <TouchableOpacity 
          style={[styles.actionCard, styles.dangerCard]} 
          onPress={handleDeleteAccount}
          activeOpacity={0.7}
        >
          <View style={styles.dangerIconBox}>
            <Ionicons name="trash-bin-outline" size={22} color={DANGER_COLOR} />
          </View>
          <View style={styles.textStack}>
            <Text style={[styles.actionTitle, { color: DANGER_COLOR }]}>Delete Account</Text>
            <Text style={styles.actionSub}>Permanently remove all data</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.infoNote}>
          Managing your account security helps keep your personal information safe from unauthorized access.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },

  content: { padding: 20 },
  sectionLabel: { 
    fontSize: 12, 
    fontWeight: '800', 
    color: '#94A3B8', 
    textTransform: 'uppercase', 
    letterSpacing: 1.2, 
    marginBottom: 12,
    marginLeft: 4
  },

  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  dangerCard: {
    borderColor: '#FEE2E2',
    backgroundColor: '#FFF5F5',
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: `${ACCENT_COLOR}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  dangerIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFE4E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  textStack: { flex: 1 },
  actionTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 2 },
  actionSub: { fontSize: 13, color: '#94A3B8', fontWeight: '500' },

  infoNote: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 20,
    paddingHorizontal: 20,
  }
});