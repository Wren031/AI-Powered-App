import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
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

const ACCENT_COLOR = '#FF768E';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleUpdate = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      return Alert.alert("Error", "Please fill in all fields.");
    }
    if (form.newPassword !== form.confirmPassword) {
      return Alert.alert("Error", "New passwords do not match.");
    }

    setLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Success", "Your password has been updated.", [
        { text: "Done", onPress: () => router.back() }
      ]);
    }, 1500);
  };

  const RequirementItem = ({ label, met }: { label: string; met: boolean }) => (
    <View style={styles.reqRow}>
      <Ionicons 
        name={met ? "checkmark-circle" : "ellipse-outline"} 
        size={16} 
        color={met ? "#10B981" : "#CBD5E1"} 
      />
      <Text style={[styles.reqText, met && styles.reqTextMet]}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Password</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Keep it secure</Text>
            <Text style={styles.infoSub}>Your new password should be different from previous ones to ensure account safety.</Text>
          </View>

          <View style={styles.form}>
            {/* Current Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  value={form.currentPassword}
                  onChangeText={(v) => setForm({ ...form, currentPassword: v })}
                  placeholder="Enter current password"
                  placeholderTextColor="#94a3b8"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            {/* New Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  value={form.newPassword}
                  onChangeText={(v) => setForm({ ...form, newPassword: v })}
                  placeholder="Create new password"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm New Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  value={form.confirmPassword}
                  onChangeText={(v) => setForm({ ...form, confirmPassword: v })}
                  placeholder="Repeat new password"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            {/* Requirements Checklist */}
            <View style={styles.requirementsContainer}>
              <RequirementItem label="At least 8 characters" met={form.newPassword.length >= 8} />
              <RequirementItem label="Includes a number or symbol" met={/[0-9!@#$%^&*]/.test(form.newPassword)} />
              <RequirementItem label="Passwords match" met={form.newPassword === form.confirmPassword && form.newPassword !== ''} />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.saveBtn, loading && styles.disabledBtn]} 
            onPress={handleUpdate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveBtnText}>Update Password</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  
  scrollContent: { padding: 24 },
  
  infoBox: { marginBottom: 32 },
  infoTitle: { fontSize: 22, fontWeight: '800', color: '#1E293B', marginBottom: 8 },
  infoSub: { fontSize: 14, color: '#64748B', lineHeight: 20 },
  
  form: { 
    backgroundColor: '#FFF', 
    borderRadius: 24, 
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 8, marginLeft: 4 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  input: { flex: 1, height: 56, fontSize: 16, color: '#1E293B', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 10 },
  
  requirementsContainer: { marginTop: 10, paddingHorizontal: 4 },
  reqRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  reqText: { fontSize: 13, color: '#94A3B8', marginLeft: 8, fontWeight: '500' },
  reqTextMet: { color: '#1E293B' },
  
  saveBtn: {
    backgroundColor: ACCENT_COLOR,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  disabledBtn: { backgroundColor: '#CBD5E1', shadowOpacity: 0 },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});