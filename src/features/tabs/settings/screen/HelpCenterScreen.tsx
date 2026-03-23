import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const ACCENT_COLOR = '#FF768E';

export default function HelpCenterScreen() {
  const router = useRouter();

  const HelpCard = ({ icon, title, subtitle, onPress }: any) => (
    <TouchableOpacity style={styles.helpCard} onPress={onPress}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={24} color={ACCENT_COLOR} />
      </View>
      <View style={styles.textStack}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSub}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollPadding}>
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>How can we help?</Text>
          <Text style={styles.heroSub}>Search our help articles or contact support directly.</Text>
        </View>

        <View style={styles.section}>
          <HelpCard 
            icon="chatbubbles-outline" 
            title="Live Chat" 
            subtitle="Chat with our support team" 
            onPress={() => {}} 
          />
          <HelpCard 
            icon="mail-outline" 
            title="Email Support" 
            subtitle="Get a response within 24 hours" 
            onPress={() => Linking.openURL('mailto:support@yourapp.com')} 
          />
          <HelpCard 
            icon="book-outline" 
            title="FAQ" 
            subtitle="Common questions & answers" 
            onPress={() => {}} 
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Available 9:00 AM - 6:00 PM</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#FFF' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  scrollPadding: { padding: 20 },
  heroSection: { marginBottom: 30, marginTop: 10 },
  heroTitle: { fontSize: 26, fontWeight: '800', color: '#1E293B', marginBottom: 8 },
  heroSub: { fontSize: 15, color: '#64748B', lineHeight: 22 },
  section: { gap: 16 },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconBox: { width: 50, height: 50, borderRadius: 16, backgroundColor: `${ACCENT_COLOR}10`, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  textStack: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  cardSub: { fontSize: 13, color: '#94A3B8', marginTop: 2 },
  footer: { marginTop: 40, alignItems: 'center' },
  footerText: { color: '#CBD5E1', fontSize: 12, fontWeight: '600' }
});