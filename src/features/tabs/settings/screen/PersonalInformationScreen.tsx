import { useProfileData } from '@/src/features/auth/hooks/useProfileData';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { memo, useMemo } from 'react';
import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const THEME = {
  accent: '#FF768E',
  accentLight: '#FF768E26',
  background: '#FDFDFF',
  surface: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  border: '#F1F5F9',
};

interface InfoRowProps {
  label: string;
  value?: string | null;
  icon: keyof typeof Ionicons.glyphMap;
}

const InfoRow = memo(({ label, value, icon }: InfoRowProps) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
      <Ionicons name={icon} size={20} color={THEME.accent} />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || 'Not provided'}</Text>
    </View>
  </View>
));

const SectionHeader = memo(({ title }: { title: string }) => (
  <Text style={styles.sectionHeading}>{title}</Text>
));

export default function PersonalInformationScreen() {
  const router = useRouter();
  const { profile, loading } = useProfileData();

  const fullName = useMemo(() => {
    const parts = [
      profile?.first_name,
      profile?.middle_name,
      profile?.last_name,
      profile?.suffix,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : 'User Name';
  }, [profile]);


  const avatarUri = useMemo(() => {
    return profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=FF768E&color=fff`;
  }, [profile?.avatar_url, fullName]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={THEME.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header Area */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.headerBtn}
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={24} color={THEME.textPrimary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Personal Profile</Text>
        
        <TouchableOpacity 
          style={styles.editBtn} 
          onPress={() => router.push('/setup-profile')}
          activeOpacity={0.7}
        >
          <Ionicons name="pencil-outline" size={20} color={THEME.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollPadding}
      >
        {/* Profile Hero */}
        <View style={styles.heroSection}>
          <View style={styles.avatarShadow}>
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatarImg}
            />
          </View>
          <Text style={styles.userName}>{fullName}</Text>
          <View style={styles.emailTag}>
            <Ionicons name="mail-outline" size={14} color={THEME.textSecondary} style={{ marginRight: 6 }} />
            <Text style={styles.userEmail}>{profile?.email}</Text>
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.contentBody}>
          <SectionHeader title="Basic Information" />
          <View style={styles.glassCard}>
            <InfoRow label="Gender" value={profile?.gender} icon="person-outline" />
            <View style={styles.innerDivider} />
            <InfoRow label="Birthday" value={profile?.date_of_birth} icon="calendar-outline" />
          </View>

          <SectionHeader title="Contact & Location" />
          <View style={styles.glassCard}>
            <InfoRow label="Phone" value={profile?.phone_number} icon="call-outline" />
            <View style={styles.innerDivider} />
            <InfoRow label="Residential Address" value={profile?.address} icon="map-outline" />
          </View>
        </View>

        {/* Secure Footer */}
        <View style={styles.footer}>
          <View style={styles.secureLine} />
          <View style={styles.secureBadge}>
            <Ionicons name="shield-checkmark" size={14} color={THEME.textMuted} />
            <Text style={styles.secureText}>Your data is private and encrypted</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: THEME.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  headerTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#0F172A', 
    letterSpacing: 0.3 
  },
  headerBtn: { 
    width: 40, 
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  editBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 12, 
    backgroundColor: THEME.accentLight, 
    justifyContent: 'center', 
    alignItems: 'center'
  },

  scrollPadding: { paddingBottom: 60 },

  // Hero Section
  heroSection: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
  },
  avatarShadow: {
    shadowColor: THEME.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarImg: { 
    width: 100, 
    height: 100, 
    borderRadius: 40, 
    backgroundColor: THEME.border 
  },
  userName: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: THEME.textPrimary, 
    marginTop: 16, 
    letterSpacing: -0.5 
  },
  emailTag: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 8, 
    backgroundColor: THEME.border, 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20 
  },
  userEmail: { 
    fontSize: 13, 
    color: THEME.textSecondary, 
    fontWeight: '600' 
  },

  // Content
  contentBody: { paddingHorizontal: 20 },
  sectionHeading: { 
    fontSize: 11, 
    fontWeight: '800', 
    color: THEME.textMuted, 
    textTransform: 'uppercase', 
    letterSpacing: 1.5, 
    marginTop: 24, 
    marginBottom: 10, 
    marginLeft: 4 
  },
  glassCard: { 
    backgroundColor: THEME.surface, 
    borderRadius: 24, 
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  
  // Rows
  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    paddingVertical: 12 
  },
  iconContainer: { 
    width: 40, 
    height: 40, 
    borderRadius: 14, 
    backgroundColor: '#F8FAFC', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 14,
    borderWidth: 1,
    borderColor: THEME.border
  },
  textContainer: { flex: 1, paddingTop: 2 },
  infoLabel: { 
    fontSize: 10, 
    fontWeight: '700', 
    color: THEME.textMuted, 
    textTransform: 'uppercase', 
    marginBottom: 2 
  },
  infoValue: { 
    fontSize: 15, 
    fontWeight: '500', 
    color: THEME.textPrimary, 
    lineHeight: 22 
  },
  innerDivider: { 
    height: 1, 
    backgroundColor: THEME.border, 
    marginLeft: 54 
  },

  // Footer
  footer: { 
    marginTop: 40, 
    alignItems: 'center' 
  },
  secureLine: { 
    width: 30, 
    height: 3, 
    backgroundColor: THEME.border, 
    borderRadius: 2, 
    marginBottom: 12 
  },
  secureBadge: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  secureText: { 
    color: THEME.textMuted, 
    fontSize: 12, 
    fontWeight: '600', 
    marginLeft: 6 
  }
});