import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
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
import { useProfile } from '../hooks/useProfile';

const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];
const SUFFIX_OPTIONS = ["None", "Jr.", "Sr.", "II", "III", "IV", "V"];

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { saveFullProfile, profile, loading, fetchProfile } = useProfile();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [form, setForm] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    gender: '',
    phone_number: '',
    address: '',
    date_of_birth: new Date().toISOString().split('T')[0],
    avatar_url: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        if (fetchProfile) await fetchProfile();
      } catch (e) {
        console.error("Error loading profile:", e);
      } finally {
        setIsInitialLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name || '',
        middle_name: profile.middle_name || '',
        last_name: profile.last_name || '',
        suffix: profile.suffix || '',
        gender: profile.gender || '',
        phone_number: profile.phone_number || '',
        address: profile.address || '',
        date_of_birth: profile.date_of_birth || new Date().toISOString().split('T')[0],
        avatar_url: profile.avatar_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      });
    }
  }, [profile]);

  const handleInputChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Gallery access is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) handleInputChange('avatar_url', result.assets[0].uri);
  };

  const fetchCurrentLocation = async () => {
    setIsLocating(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return Alert.alert('Permission Denied', 'Location required.');
      
      let location = await Location.getCurrentPositionAsync({});
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const item = reverseGeocode[0];
        const formatted = `${item.name || ''} ${item.street || ''}, ${item.city}, ${item.region}`.trim();
        handleInputChange('address', formatted);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not fetch location.');
    } finally {
      setIsLocating(false);
    }
  };

  const showOptionPicker = (title: string, options: string[], field: string) => {
    Alert.alert(title, "Choose an option", [
      ...options.map((option) => ({
        text: option,
        onPress: () => handleInputChange(field, option === "None" ? "" : option),
      })),
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) handleInputChange('date_of_birth', selectedDate.toISOString().split('T')[0]);
  };

  const handleComplete = async () => {
    // Basic Name Validation
    if (!form.first_name.trim() || !form.last_name.trim()) {
      return Alert.alert("Required Fields", "First and Last Name are required.");
    }

    // --- BIRTHDAY VALIDATION (2025 Check) ---
    const birthYear = new Date(form.date_of_birth).getFullYear();
    if (birthYear >= 2025) {
      return Alert.alert(
        "Invalid Birthday", 
        "Please select a valid date of birth. Year 2025 and above are not allowed."
      );
    }

    const success = await saveFullProfile(form);
    if (success) router.replace('/(tabs)/home');
  };

  if (isInitialLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Account Setup</Text>
            <Text style={styles.subtitle}>Keep your information up to date.</Text>
          </View>

          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: form.avatar_url }} style={styles.avatarImage} />
                <View style={styles.editBadge}><Ionicons name="camera" size={14} color="#FFF" /></View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>Name Details</Text>
            <TextInput style={styles.input} placeholder="First Name *" value={form.first_name} onChangeText={(v) => handleInputChange('first_name', v)} placeholderTextColor="#999" />
            <TextInput style={styles.input} placeholder="Middle Name (Optional)" value={form.middle_name} onChangeText={(v) => handleInputChange('middle_name', v)} placeholderTextColor="#999" />
            
            <View style={styles.row}>
              <TextInput style={[styles.input, { flex: 2, marginRight: 12 }]} placeholder="Last Name *" value={form.last_name} onChangeText={(v) => handleInputChange('last_name', v)} placeholderTextColor="#999" />
              <TouchableOpacity style={[styles.selector, { flex: 1 }]} onPress={() => showOptionPicker("Suffix", SUFFIX_OPTIONS, "suffix")}>
                <Text style={[styles.selectorText, !form.suffix && { color: '#999' }]}>{form.suffix || "Suffix"}</Text>
                <Ionicons name="chevron-down" size={14} color="#999" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionLabel}>Identity & Contact</Text>
            <TouchableOpacity style={styles.selector} onPress={() => showOptionPicker("Gender", GENDER_OPTIONS, "gender")}>
              <Text style={[styles.selectorText, !form.gender && { color: '#999' }]}>{form.gender || "Select Gender"}</Text>
              <Ionicons name="chevron-down" size={14} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.selector} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.selectorText}>📅 Birthday: {form.date_of_birth}</Text>
              <Text style={{ fontSize: 12, color: '#007AFF', fontWeight: '600' }}>Change</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <View style={styles.datePickerWrapper}>
                <DateTimePicker 
                  value={new Date(form.date_of_birth)} 
                  mode="date" 
                  display={Platform.OS === 'ios' ? 'inline' : 'default'} 
                  onChange={onDateChange} 
                  // Prevents selecting a date in 2025+ visually
                  maximumDate={new Date(2024, 11, 31)} 
                />
                {Platform.OS === 'ios' && (
                  <TouchableOpacity style={styles.confirmBtn} onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.confirmBtnText}>Confirm Date</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" value={form.phone_number} onChangeText={(v) => handleInputChange('phone_number', v)} placeholderTextColor="#999" />

            <View style={styles.addressHeader}>
              <Text style={styles.sectionLabel}>Address</Text>
              <TouchableOpacity onPress={fetchCurrentLocation} disabled={isLocating} style={styles.gpsBadge}>
                {isLocating ? <ActivityIndicator size="small" color="#007AFF" /> : <Text style={styles.gpsText}>📍 Use GPS</Text>}
              </TouchableOpacity>
            </View>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Home Address" multiline value={form.address} onChangeText={(v) => handleInputChange('address', v)} placeholderTextColor="#999" />
          </View>

          <TouchableOpacity style={[styles.primaryBtn, loading && styles.disabledBtn]} onPress={handleComplete} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Save Profile</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  navHeader: { paddingHorizontal: 16, paddingTop: 8 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },
  scrollContent: { padding: 24, paddingTop: 16, paddingBottom: 60 },
  header: { marginBottom: 30 },
  title: { fontSize: 32, fontWeight: '800', color: '#1A1A1A', letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: '#6C757D', marginTop: 4 },
  avatarSection: { alignItems: 'center', marginBottom: 35 },
  imageContainer: { position: 'relative' },
  avatarImage: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#FFF', borderWidth: 3, borderColor: '#FFF' },
  editBadge: { position: 'absolute', bottom: 2, right: 2, backgroundColor: '#007AFF', width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#F8F9FA' },
  formSection: { marginBottom: 10 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#ADB5BD', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  row: { flexDirection: 'row' },
  input: { backgroundColor: '#FFF', padding: 16, borderRadius: 14, marginBottom: 16, fontSize: 16, borderWidth: 1, borderColor: '#E9ECEF', color: '#1A1A1A' },
  textArea: { height: 90, textAlignVertical: 'top' },
  selector: { backgroundColor: '#FFF', padding: 16, borderRadius: 14, marginBottom: 16, borderWidth: 1, borderColor: '#E9ECEF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectorText: { fontSize: 16, color: '#1A1A1A' },
  datePickerWrapper: { backgroundColor: '#FFF', borderRadius: 14, padding: 10, marginBottom: 16, borderWidth: 1, borderColor: '#E9ECEF' },
  confirmBtn: { padding: 12, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E9ECEF' },
  confirmBtnText: { color: '#007AFF', fontWeight: '700', fontSize: 16 },
  addressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  gpsBadge: { backgroundColor: '#E7F1FF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  gpsText: { color: '#007AFF', fontWeight: '700', fontSize: 12 },
  primaryBtn: { backgroundColor: '#1A1A1A', padding: 20, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  disabledBtn: { backgroundColor: '#6C757D' },
  primaryBtnText: { color: '#FFF', fontWeight: '700', fontSize: 17 }
});