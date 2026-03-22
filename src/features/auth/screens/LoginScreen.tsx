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

// Professional tip: Move theme constants to a separate file later
const COLORS = {
  primary: '#007AFF',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  border: '#E8E8E8',
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  error: '#FF3B30',
  white: '#FFFFFF',
  googleBlue: '#4285F4',
  facebookBlue: '#1877F2',
};

export default function LoginScreen() {
  const router = useRouter();
  const { login, signInWithGoogle, loading } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogin = async () => {
    const { email, password } = form;
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please enter your email and password.');
      return;
    }

    try {
      const success = await login({ email: email.trim(), password });
      if (success) {
        router.replace('/home');
      }
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid credentials. Please try again.');
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'facebook') => {
    setSocialLoading(provider);
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        Alert.alert('Coming Soon', 'Facebook integration is in progress.');
      }
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
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

            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry={!isPasswordVisible}
                style={styles.passwordInput}
                value={form.password}
                onChangeText={(text) => updateForm('password', text)}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                style={styles.eyeIcon}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              // onPress={() => router.push('/forgot-password')}
              style={styles.forgotPasswordContainer}
              disabled={loading}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.or}>OR</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => handleSocialSignIn('google')}
              disabled={!!socialLoading || loading}
            >
              {socialLoading === 'google' ? (
                <ActivityIndicator color={COLORS.textPrimary} />
              ) : (
                <>
                  <Ionicons name="logo-google" size={20} color={COLORS.textPrimary} style={{ marginRight: 10 }} />
                  <Text style={styles.socialText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialBtn, { borderColor: COLORS.facebookBlue }]}
              onPress={() => handleSocialSignIn('facebook')}
              disabled={!!socialLoading || loading}
            >
              <Ionicons name="logo-facebook" size={20} color={COLORS.facebookBlue} style={{ marginRight: 10 }} />
              <Text style={[styles.socialText, { color: COLORS.facebookBlue }]}>Continue with Facebook</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.footer}
            onPress={() => router.push('/signup')}
            disabled={loading}
          >
            <Text style={styles.footerText}>
              Don't have an account? <Text style={styles.link}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40, flexGrow: 1, justifyContent: 'center' },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: COLORS.textSecondary, marginTop: 4 },
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  passwordInput: { flex: 1, padding: 16, fontSize: 16, color: COLORS.textPrimary },
  eyeIcon: { paddingRight: 16 },
  forgotPasswordContainer: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotPasswordText: { color: COLORS.primary, fontWeight: '600', fontSize: 14 },
  primaryButton: {
    backgroundColor: COLORS.textPrimary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: { backgroundColor: COLORS.textSecondary, opacity: 0.7 },
  buttonText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 32 },
  line: { flex: 1, height: 1, backgroundColor: COLORS.border },
  or: { marginHorizontal: 16, color: '#AAA', fontWeight: '600', fontSize: 12 },
  socialContainer: { gap: 12 },
  socialBtn: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  socialText: { color: COLORS.textPrimary, fontWeight: '600', fontSize: 15 },
  footer: { marginTop: 40, alignItems: 'center' },
  footerText: { color: COLORS.textSecondary, fontSize: 15 },
  link: { color: COLORS.primary, fontWeight: '700' },
});