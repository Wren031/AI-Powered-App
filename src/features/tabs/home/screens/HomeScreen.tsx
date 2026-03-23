import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  BarChart2,
  Bell,
  Camera,
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react-native';
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
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Hooks - Ensure this path is correct for your project
import { useProfileData } from '@/src/features/auth/hooks/useProfileData';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#6366F1',
  accent: '#FF768E',
  background: '#F8FAFC',
  card: '#FFFFFF',
  greetingText: '#8E9AAF', // The blue-grey from your image
  userNameText: '#1A1A1A',
  textSub: '#64748B',
  notificationRed: '#FF0000',
};

export default function HomeScreen() {
  const router = useRouter();
  const { profile, loading } = useProfileData();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        
        <View style={styles.header}>
          <View style={styles.headerLeft}>

            <TouchableOpacity 
              onPress={() => router.push('/personal-info')}
              activeOpacity={0.8}
            >

              <Image 
                source={{ uri: profile?.avatar_url || 'https://via.placeholder.com/150' }} 
                style={styles.avatarThumb} 
              />
            </TouchableOpacity>
            
            <View style={styles.textContainer}>
              <Text style={styles.welcomeText}>Good Morning,</Text>
              <Text style={styles.userName}>
                {profile?.first_name || 'Wren'} {profile?.last_name || 'Javier'}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.7}>
            <View style={styles.bellIconContainer}>
              <Bell size={26} color="#000" fill="#000" />
              <View style={styles.notificationDot} />
            </View>
          </TouchableOpacity>
        </View>

        {/* --- MAIN CONTENT CARD --- */}
        <LinearGradient
          colors={[COLORS.accent, '#FD5D7A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroContent}>
            <View>
              <Text style={styles.heroLabel}>Today's Goal</Text>
              <Text style={styles.heroValue}>1,250 kcal</Text>
            </View>
            <Sparkles color="white" size={30} opacity={0.9} />
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '65%' }]} />
          </View>
          <Text style={styles.heroSubtext}>You've completed 65% of your daily target.</Text>
        </LinearGradient>

        {/* --- QUICK ACTIONS GRID --- */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={styles.actionItem} 
            onPress={() => router.push('/camera-scan')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
              <Camera color={COLORS.primary} size={24} />
            </View>
            <Text style={styles.actionLabel}>Scan Food</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionItem} 
            onPress={() => router.push('/progress')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#FFF1F2' }]}>
              <BarChart2 color={COLORS.accent} size={24} />
            </View>
            <Text style={styles.actionLabel}>Analytics</Text>
          </TouchableOpacity>
        </View>

        {/* --- RECENT ACTIVITY --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityIcon}>
            <Zap size={20} color={COLORS.primary} />
          </View>
          <View style={styles.activityInfo}>
            <Text style={styles.activityTitle}>Protein Shake Logged</Text>
            <Text style={styles.activityTime}>Today, 09:41 AM</Text>
          </View>
          <ChevronRight size={20} color={COLORS.textSub} />
        </View>

        {/* Padding for Floating Tab Bar - Crucial so content isn't hidden */}
        <View style={{ height: 110 }} />
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  // Header Styles matching your Image
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarThumb: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#E2E8F0',
  },
  textContainer: {
    marginLeft: 15,
  },
  welcomeText: {
    fontSize: 20,
    color: COLORS.greetingText,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.userNameText,
    marginTop: -2,
  },
  notificationBtn: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  bellIconContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.notificationRed,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  // Hero Card Styles
  heroCard: {
    borderRadius: 28,
    padding: 24,
    marginBottom: 30,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroValue: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 5,
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  heroSubtext: {
    color: '#FFFFFF',
    fontSize: 13,
    opacity: 0.9,
  },
  // Section Styles
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.userNameText,
    marginBottom: 15,
  },
  seeAll: {
    color: COLORS.accent,
    fontWeight: '600',
    fontSize: 14,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 30,
  },
  actionItem: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.userNameText,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 18,
    borderRadius: 22,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.userNameText,
  },
  activityTime: {
    fontSize: 13,
    color: COLORS.textSub,
    marginTop: 2,
  },
});