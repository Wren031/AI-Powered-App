import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function AboutUsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          {/* Replace with your actual App Logo */}
          <View style={styles.logoPlaceholder}>
            <Ionicons name="rocket" size={60} color="#FF768E" />
          </View>
          <Text style={styles.appName}>YourApp Name</Text>
          <Text style={styles.version}>Version 1.0.4</Text>
        </View>

        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>
            We are dedicated to providing the best experience for our users. Our mission is to simplify your daily tasks through innovative technology and intuitive design.
          </Text>
        </View>

        <View style={styles.linkSection}>
          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.linkText}>Terms of Service</Text>
            <Ionicons name="open-outline" size={16} color="#94A3B8" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.linkText}>Privacy Policy</Text>
            <Ionicons name="open-outline" size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <Text style={styles.copyright}>© 2026 YourCompany Inc.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#FFF' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, padding: 24, alignItems: 'center' },
  logoContainer: { alignItems: 'center', marginTop: 40, marginBottom: 40 },
  logoPlaceholder: { width: 120, height: 120, borderRadius: 40, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  appName: { fontSize: 24, fontWeight: '800', color: '#1E293B', marginTop: 20 },
  version: { fontSize: 14, color: '#94A3B8', fontWeight: '600', marginTop: 4 },
  descriptionBox: { backgroundColor: '#FFF', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9' },
  descriptionText: { fontSize: 15, color: '#64748B', lineHeight: 24, textAlign: 'center' },
  linkSection: { width: '100%', marginTop: 30 },
  linkRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  linkText: { fontSize: 15, fontWeight: '600', color: '#475569' },
  divider: { height: 1, backgroundColor: '#F1F5F9' },
  copyright: { marginTop: 'auto', marginBottom: 20, color: '#CBD5E1', fontSize: 12, fontWeight: '600' }
});