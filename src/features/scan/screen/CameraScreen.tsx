import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { useRouter } from 'expo-router';
import { RefreshCcw, X, Zap } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { analyzeSkinWithGemini } from '../../services/gimini';

const { width, height } = Dimensions.get('window');

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [facing, setFacing] = useState<CameraType>('front');
  
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const scanAnim = useRef(new Animated.Value(0)).current;

  const startScanningAnimation = () => {
    scanAnim.setValue(0);
    Animated.loop(Animated.sequence([
      Animated.timing(scanAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      Animated.timing(scanAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
    ])).start();
  };

  const handleCapture = async () => {
    if (!cameraRef.current || isProcessing) return;
    try {
      setIsProcessing(true);
      startScanningAnimation();

      // 1. Capture at Max Quality
      const photo = await cameraRef.current.takePictureAsync({ 
        quality: 1, 
      });

      // 2. CLINICAL NORMALIZATION (GCash-style processing)
      const processed = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 1200 } }],
        { 
          compress: 0.8, 
          format: ImageManipulator.SaveFormat.JPEG, 
          base64: true 
        }
      );

      if (processed.base64) {
        // 3. Send to Gemini
        const results = await analyzeSkinWithGemini(processed.base64);
        
        // Pass to results screen
        router.push({ 
          pathname: '/result-scan', 
          params: { data: JSON.stringify(results) } 
        });
      }
    } catch (e: any) {
      console.error(e);
      Alert.alert("Analysis Failed", e.message || "Please ensure you have a stable connection and good lighting.");
    } finally { 
      setIsProcessing(false); 
      scanAnim.stopAnimation();
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text style={{marginBottom: 20, color: '#666'}}>Camera access is required for analysis</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.btn}>
            <Text style={styles.btnText}>Enable Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const translateY = scanAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 360] });

  return (
    <View style={styles.container}>
      <CameraView 
        style={StyleSheet.absoluteFill} 
        facing={facing} 
        ref={cameraRef} 
        enableTorch={flash === 'on'}
      />
      
      {/* GCash-Style Mask Overlay (The "Hole" in the middle) */}
      <View style={styles.maskContainer} pointerEvents="none">
        <View style={styles.maskTop} />
        <View style={styles.maskMiddle}>
          <View style={styles.maskSide} />
          <View style={styles.cutout}>
             {isProcessing && (
                <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />
             )}
          </View>
          <View style={styles.maskSide} />
        </View>
        <View style={styles.maskBottom} />
      </View>

      {/* Control Layer */}
      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <X color="white" size={24} />
          </TouchableOpacity>
          <View style={{flexDirection: 'row', gap: 10}}>
            <TouchableOpacity onPress={() => setFacing(f => f === 'front' ? 'back' : 'front')} style={styles.iconBtn}>
                <RefreshCcw color="white" size={20} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFlash(f => f === 'on' ? 'off' : 'on')} style={styles.iconBtn}>
                <Zap color={flash === 'on' ? "#FFD700" : "white"} size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.instructionBox} pointerEvents="none">
          <Text style={styles.guideText}>
            {isProcessing ? "ANALYZING SKIN..." : "CENTER YOUR FACE"}
          </Text>
          <Text style={styles.subText}>Ensure good lighting for accuracy</Text>
        </View>

        <View style={styles.bottomBar}>
          {isProcessing ? (
            <View style={styles.loadingBox}>
                <ActivityIndicator size="small" color="#007DFF" />
                <Text style={{color: 'white', fontWeight: 'bold'}}>Processing Pixels...</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.shutterOuter} onPress={handleCapture}>
                <View style={styles.shutterInner} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  
  // GCash Mask Logic
  maskContainer: { ...StyleSheet.absoluteFillObject, zIndex: 1 },
  maskTop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' },
  maskBottom: { flex: 2, backgroundColor: 'rgba(0,0,0,0.7)' },
  maskMiddle: { flexDirection: 'row', height: 360 },
  maskSide: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' },
  cutout: { width: 260, height: 360, borderRadius: 130, borderWidth: 2, borderColor: '#007DFF', overflow: 'hidden' },
  
  // UI Layer
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 2, justifyContent: 'space-between', paddingVertical: 60 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  instructionBox: { alignItems: 'center' },
  guideText: { color: 'white', fontSize: 18, fontWeight: '800', letterSpacing: 1 },
  subText: { color: 'rgba(255,255,255,0.6)', marginTop: 5, fontSize: 12 },
  scanLine: { width: '100%', height: 4, backgroundColor: '#007DFF', shadowColor: '#007DFF', shadowOpacity: 1, shadowRadius: 10, elevation: 10 },
  bottomBar: { alignItems: 'center', marginBottom: 20 },
  shutterOuter: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: 'white', justifyContent: 'center', alignItems: 'center' },
  shutterInner: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'white' },
  loadingBox: { flexDirection: 'row', gap: 12, backgroundColor: 'rgba(0,0,0,0.8)', paddingHorizontal: 25, paddingVertical: 15, borderRadius: 30, alignItems: 'center' },
  btn: { paddingHorizontal: 40, paddingVertical: 15, backgroundColor: '#007DFF', borderRadius: 30 },
  btnText: { color: 'white', fontWeight: 'bold' }
});