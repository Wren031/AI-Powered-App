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
const ACCENT_COLOR = '#FF768E'; 

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
    date_of_birth: new Date(2000, 0, 1).toISOString().split('T')[0],
    avatar_url: 'https://ui-avatars.com/api/?background=f1f5f9&color=cbd5e1&name=User',
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
        date_of_birth: profile.date_of_birth || '2000-01-01',
        avatar_url: profile.avatar_url || `https://ui-avatars.com/api/?background=FF768E&color=fff&name=${profile.first_name || 'U'}`,
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
        const formatted = [item.name, item.street, item.city, item.region]
          .filter(Boolean)
          .join(', ');
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
    if (!form.first_name.trim() || !form.last_name.trim()) {
      return Alert.alert("Required Fields", "Please enter your first and last name.");
    }
    const success = await saveFullProfile(form);
    if (success) router.replace('/(tabs)/home');
  };

  if (isInitialLoading) {
    return (
      <View style={styles.loaderCenter}>
        <ActivityIndicator size="large" color={ACCENT_COLOR} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Edit Profile</Text>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={pickImage} activeOpacity={0.9}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: form.avatar_url }} style={styles.avatarImage} />
                <View style={styles.editBadge}>
                  <Ionicons name="camera" size={18} color="#FFF" />
                </View>
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarHint}>Tap to change photo</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Legal Name</Text>
            
            <View style={styles.inputWrapper}>
              <Text style={styles.floatingLabel}>First Name</Text>
              <TextInput 
                style={styles.textInput} 
                value={form.first_name} 
                onChangeText={(v) => handleInputChange('first_name', v)} 
                placeholder="Enter first name"
                placeholderTextColor="#94a3b8" 
              />
            </View>

            {/* Middle Name Field - Added Back */}
            <View style={styles.inputWrapper}>
              <Text style={styles.floatingLabel}>Middle Name (Optional)</Text>
              <TextInput 
                style={styles.textInput} 
                value={form.middle_name} 
                onChangeText={(v) => handleInputChange('middle_name', v)} 
                placeholder="Enter middle name"
                placeholderTextColor="#94a3b8" 
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputWrapper, { flex: 2, marginRight: 12 }]}>
                <Text style={styles.floatingLabel}>Last Name</Text>
                <TextInput 
                  style={styles.textInput} 
                  value={form.last_name} 
                  onChangeText={(v) => handleInputChange('last_name', v)} 
                  placeholder="Surname"
                  placeholderTextColor="#94a3b8" 
                />
              </View>
              <View style={[styles.inputWrapper, { flex: 1 }]}>
                <Text style={styles.floatingLabel}>Suffix</Text>
                <TouchableOpacity style={styles.selectInput} onPress={() => showOptionPicker("Suffix", SUFFIX_OPTIONS, "suffix")}>
                  <Text style={styles.selectText}>{form.suffix || "None"}</Text>
                  <Ionicons name="chevron-down" size={14} color="#94a3b8" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Personal Details</Text>
            
            <View style={styles.inputWrapper}>
              <Text style={styles.floatingLabel}>Gender</Text>
              <TouchableOpacity style={styles.selectInput} onPress={() => showOptionPicker("Gender", GENDER_OPTIONS, "gender")}>
                <Text style={styles.selectText}>{form.gender || "Select gender"}</Text>
                <Ionicons name="transgender-outline" size={18} color={ACCENT_COLOR} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.floatingLabel}>Date of Birth</Text>
              <TouchableOpacity style={styles.selectInput} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.selectText}>{form.date_of_birth}</Text>
                <Ionicons name="calendar-outline" size={18} color={ACCENT_COLOR} />
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <View style={styles.datePickerCard}>
                <DateTimePicker 
                  value={new Date(form.date_of_birth)} 
                  mode="date" 
                  display={Platform.OS === 'ios' ? 'inline' : 'default'} 
                  onChange={onDateChange} 
                  maximumDate={new Date()} 
                  accentColor={ACCENT_COLOR}
                />
                {Platform.OS === 'ios' && (
                  <TouchableOpacity style={styles.dateDoneBtn} onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.dateDoneText}>Done</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Contact & Location</Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.floatingLabel}>Phone Number</Text>
              <TextInput 
                style={styles.textInput} 
                keyboardType="phone-pad" 
                value={form.phone_number} 
                onChangeText={(v) => handleInputChange('phone_number', v)} 
                placeholder="+63 000 000 0000"
                placeholderTextColor="#94a3b8" 
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.floatingLabel}>Home Address</Text>
              {form.address ? (
                <View style={styles.addressActive}>
                  <Text style={styles.addressValue} numberOfLines={2}>{form.address}</Text>
                  <TouchableOpacity onPress={fetchCurrentLocation} style={styles.addressRetry}>
                    {isLocating ? <ActivityIndicator size="small" color={ACCENT_COLOR} /> : <Ionicons name="locate" size={20} color={ACCENT_COLOR} />}
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.gpsButton} onPress={fetchCurrentLocation} disabled={isLocating}>
                  {isLocating ? (
                    <ActivityIndicator color={ACCENT_COLOR} />
                  ) : (
                    <>
                      <Ionicons name="navigate-circle" size={22} color={ACCENT_COLOR} />
                      <Text style={styles.gpsButtonText}>Locate via GPS</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.mainButton, (loading || !form.address) && styles.mainButtonDisabled]} 
            onPress={handleComplete} 
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.mainButtonText}>Save Changes</Text>}
          </TouchableOpacity>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  loaderCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  navHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFF' },
  navTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingBottom: 40 },
  avatarSection: { alignItems: 'center', paddingVertical: 30, backgroundColor: '#FFF', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  imageContainer: { position: 'relative' },
  avatarImage: { width: 110, height: 110, borderRadius: 40, backgroundColor: '#F1F5F9' },
  editBadge: { position: 'absolute', bottom: -4, right: -4, backgroundColor: ACCENT_COLOR, width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#FFF' },
  avatarHint: { marginTop: 12, fontSize: 13, color: '#94A3B8', fontWeight: '600' },
  formCard: { paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, marginTop: 10 },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 24 },
  inputWrapper: { marginBottom: 20 },
  floatingLabel: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 8, marginLeft: 4 },
  textInput: { backgroundColor: '#FFF', padding: 16, borderRadius: 16, fontSize: 16, color: '#1E293B', borderWidth: 1, borderColor: '#E2E8F0', fontWeight: '500' },
  row: { flexDirection: 'row' },
  selectInput: { backgroundColor: '#FFF', padding: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  selectText: { fontSize: 16, color: '#1E293B', fontWeight: '500' },
  gpsButton: { height: 56, borderRadius: 16, borderStyle: 'dashed', borderWidth: 1.5, borderColor: ACCENT_COLOR, backgroundColor: `${ACCENT_COLOR}05`, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  gpsButtonText: { fontSize: 15, color: ACCENT_COLOR, fontWeight: '700' },
  addressActive: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: ACCENT_COLOR, flexDirection: 'row', alignItems: 'center' },
  addressValue: { flex: 1, fontSize: 14, color: '#1E293B', fontWeight: '500', lineHeight: 20 },
  addressRetry: { marginLeft: 12, padding: 8, backgroundColor: `${ACCENT_COLOR}10`, borderRadius: 10 },
  datePickerCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 12, marginTop: -10, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  dateDoneBtn: { padding: 14, alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 12, marginTop: 10 },
  dateDoneText: { color: ACCENT_COLOR, fontWeight: '700' },
  mainButton: { backgroundColor: ACCENT_COLOR, marginHorizontal: 20, padding: 18, borderRadius: 20, alignItems: 'center', marginTop: 20, shadowColor: ACCENT_COLOR, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  mainButtonDisabled: { backgroundColor: '#CBD5E1', shadowOpacity: 0 },
  mainButtonText: { color: '#FFF', fontWeight: '800', fontSize: 17 }
});