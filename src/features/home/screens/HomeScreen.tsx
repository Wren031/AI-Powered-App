import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BarChart2, Camera, ChevronRight, Sparkles } from 'lucide-react-native';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Hooks
import { useProfileData } from '@/src/features/auth/hooks/useProfileData';

const { width } = Dimensions.get('window');
const COLORS = {
  primary: '#6366F1', // Modern Indigo
  secondary: '#EC4899', // Rose
  background: '#F8FAFC',
  card: '#FFFFFF',
  textMain: '#1E293B',
  textMuted: '#64748B',
  accent: '#F1F5F9'
};

// --- Custom Sub-Components ---

const ProgressBar = ({ progress, colors }: { progress: number; colors?: string[] }) => (
  <View style={styles.progressBg}>
    <LinearGradient
      colors={colors || ['#6366F1', '#A5B4FC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.progressFill, { width: `${progress}%` }]}
    />
  </View>
);

const ConditionCard = ({ title, value, percentage, subtext }: any) => (
  <View style={styles.conditionCard}>
    <View style={styles.conditionHeader}>
      <Text style={styles.conditionTitle} numberOfLines={1}>{title}</Text>
      <Text style={styles.conditionPercent}>{percentage}%</Text>
    </View>
    <ProgressBar progress={percentage} />
    <View style={styles.conditionFooter}>
      <Text style={styles.conditionValue}>{value}</Text>
      {subtext && <Text style={styles.conditionSubtext}>MSE {subtext}</Text>}
    </View>
  </View>
);

export default function HomeScreen() {
  const router = useRouter();
  const { profile, loading } = useProfileData();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Good morning,</Text>
          <Text style={styles.userName}>
            {profile?.first_name || 'User'} 👋
          </Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.push('/setup-profile')}
          style={styles.avatarContainer}
        >
          <Image 
            source={{ uri: profile?.avatar_url || 'https://via.placeholder.com/150' }} 
            style={styles.avatarThumb} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Skin Score Header Card */}
        <LinearGradient
          colors={[COLORS.primary, '#4F46E5']}
          style={styles.scoreCard}
        >
          <View style={styles.scoreHeader}>
            <View>
              <Text style={styles.scoreTitle}>Overall Skin Health</Text>
              <Text style={styles.scoreSub}>Based on your last scan</Text>
            </View>
            <View style={styles.whiteCircle}>
                <BarChart2 size={18} color={COLORS.primary} />
            </View>
          </View>
          
          <View style={styles.scoreMainRow}>
            <Text style={styles.scoreNumber}>78<Text style={styles.scoreSymbol}>%</Text></Text>
            <View style={styles.scoreInfo}>
                <Text style={styles.scoreStatus}>Healthy</Text>
                <View style={styles.miniProgressContainer}>
                    <View style={[styles.miniProgressFill, { width: '78%' }]} />
                </View>
            </View>
          </View>
        </LinearGradient>

        {/* Start Scan Button */}
        <TouchableOpacity 
          style={styles.scanButton} 
          onPress={() => router.push('/camera-scan')} 
          activeOpacity={0.9}
        >
          <View style={styles.scanInner}>
            <LinearGradient colors={['#F1F5F9', '#E2E8F0']} style={styles.iconCircle}>
                <Camera size={20} color={COLORS.textMain} />
            </LinearGradient>
            <View>
                <Text style={styles.scanText}>Start New Analysis</Text>
                <Text style={styles.scanSub}>AI-powered facial recognition</Text>
            </View>
          </View>
          <ChevronRight size={20} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* Skin Condition Grid */}
        <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Detailed Insights</Text>
            <Sparkles size={16} color={COLORS.secondary} />
        </View>
        <View style={styles.grid}>
          <ConditionCard title="Acne Detection" percentage={88} value="Clear" subtext="0.06" />
          <ConditionCard title="Texture" percentage={72} value="Mild" />
          <ConditionCard title="Pore Health" percentage={88} value="Fine" />
          <ConditionCard title="Hydration" percentage={25} value="Low" />
        </View>

        {/* Recommendations */}
        <Text style={styles.sectionHeading}>Recommended Routine</Text>
        <View style={styles.recGrid}>
          <TouchableOpacity style={styles.recCard}>
             <View style={[styles.recIconPlaceholder, { backgroundColor: '#EEF2FF' }]}>
                <Text style={{fontSize: 24}}>🧴</Text>
             </View>
             <Text style={styles.recTitle}>Moisturizer</Text>
             <Text style={styles.recSubtitle}>Morning & Night</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.recCard}>
             <View style={[styles.recIconPlaceholder, { backgroundColor: '#FFF7ED' }]}>
                <Text style={{fontSize: 24}}>☀️</Text>
             </View>
             <Text style={styles.recTitle}>Sunscreen</Text>
             <Text style={styles.recSubtitle}>SPF 50+</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: COLORS.card,
  },
  welcomeText: { fontSize: 14, color: COLORS.textMuted, fontWeight: '500' },
  userName: { fontSize: 24, fontWeight: '800', color: COLORS.textMain, marginTop: 2 },
  avatarContainer: {
    padding: 3,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  avatarThumb: { width: 44, height: 44, borderRadius: 22 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 28, marginBottom: 16 },
  sectionHeading: { fontSize: 18, fontWeight: '700', color: COLORS.textMain },
  
  // Score Card
  scoreCard: { 
    borderRadius: 28, 
    padding: 24, 
    ...Platform.select({
        ios: { shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 },
        android: { elevation: 8 }
    })
  },
  scoreHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  scoreTitle: { fontSize: 16, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
  scoreSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  whiteCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  scoreMainRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 20 },
  scoreNumber: { fontSize: 48, fontWeight: '800', color: '#FFF', letterSpacing: -1 },
  scoreSymbol: { fontSize: 20, fontWeight: '600' },
  scoreInfo: { marginLeft: 15, flex: 1, paddingBottom: 8 },
  scoreStatus: { color: '#FFF', fontWeight: '700', marginBottom: 6 },
  miniProgressContainer: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, width: '100%' },
  miniProgressFill: { height: '100%', backgroundColor: '#FFF', borderRadius: 3 },

  // Scan Button
  scanButton: { 
    backgroundColor: COLORS.card, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 20, 
    borderRadius: 24,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  scanInner: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconCircle: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  scanText: { fontSize: 16, fontWeight: '700', color: COLORS.textMain },
  scanSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },

  // Grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  conditionCard: { 
    backgroundColor: COLORS.card, 
    width: (width - 52) / 2, 
    borderRadius: 20, 
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  conditionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  conditionTitle: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted, flex: 1 },
  conditionPercent: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  progressBg: { width: '100%', height: 6, backgroundColor: COLORS.accent, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  conditionFooter: { marginTop: 12 },
  conditionValue: { fontSize: 18, fontWeight: '700', color: COLORS.textMain },
  conditionSubtext: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },

  // Recommendations
  recGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  recCard: { backgroundColor: COLORS.card, width: (width - 52) / 2, borderRadius: 24, padding: 20, alignItems: 'center' },
  recIconPlaceholder: { width: 64, height: 64, borderRadius: 20, marginBottom: 12, justifyContent: 'center', alignItems: 'center' },
  recTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textMain },
  recSubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 }
});