import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';


const COLORS = {
  primary: '#007AFF',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  border: '#E8E8E8',
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  white: '#FFFFFF',
  facebookBlue: '#1877F2',
};

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, loading } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSignUp = async () => {
    const { email, password } = form;

    // Basic Validation
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please fill in all fields to create an account.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password should be at least 6 characters long.');
      return;
    }

    try {
      const result = await signUp({ email: email.trim(), password });
      if (result) {
        router.push({
          pathname: '/verify',
          params: { email: email.trim() },
        });
      }
    } catch (error) {
      Alert.alert('Sign Up Error', 'Could not create account. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.inner}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Fill in your details to get started</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              placeholder="Email address"
              placeholderTextColor="#999"
              style={styles.input}
              value={form.email}
              onChangeText={(text) => updateForm('email', text)}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              editable={!loading}
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor="#999"
              style={styles.input}
              value={form.password}
              onChangeText={(text) => updateForm('password', text)}
              secureTextEntry
              autoComplete="password-new"
              editable={!loading}
            />

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.disabledButton]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity 
              style={styles.socialButton} 
              disabled={loading}
              onPress={() => {/* Add Google Logic */}}
            >
              <Ionicons name="logo-google" size={20} color={COLORS.textPrimary} style={{ marginRight: 10 }} />
              <Text style={styles.socialText}>Sign up with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.socialButton, { borderColor: COLORS.facebookBlue }]} 
              disabled={loading}
              onPress={() => {/* Add Facebook Logic */}}
            >
              <Ionicons name="logo-facebook" size={20} color={COLORS.facebookBlue} style={{ marginRight: 10 }} />
              <Text style={[styles.socialText, { color: COLORS.facebookBlue }]}>Sign up with Facebook</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.footer}
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.footerText}>
              Already have an account? <Text style={styles.link}>Log In</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  inner: { paddingHorizontal: 24, flexGrow: 1, justifyContent: 'center', paddingBottom: 20 },
  header: { marginBottom: 32 },
  title: { fontSize: 30, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: COLORS.textSecondary, marginTop: 6 },
  form: { width: '100%' },
  input: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  primaryButton: {
    backgroundColor: COLORS.textPrimary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: { backgroundColor: COLORS.textSecondary, opacity: 0.7 },
  buttonText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 32 },
  line: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { marginHorizontal: 12, color: '#AAA', fontWeight: '600', fontSize: 12 },
  socialContainer: { gap: 12 },
  socialButton: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  socialText: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  footer: { marginTop: 40, alignItems: 'center' },
  footerText: { color: COLORS.textSecondary, fontSize: 14 },
  link: { color: COLORS.primary, fontWeight: '700' },
});