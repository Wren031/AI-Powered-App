import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle2, ChevronLeft, ShieldAlert, Zap } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const THEME = { 
  primary: '#6366F1', 
  high: '#F43F5E', // Red for 70-100
  med: '#F59E0B',  // Orange for 30-70
  low: '#10B981',  // Green for 0-30
  dark: '#0F172A'
};

export default function ResultScreen() {
    const { data } = useLocalSearchParams();
    const router = useRouter();
    const results = data ? JSON.parse(data as string) : null;

    if (!results) return null;

    const getScoreColor = (score: number) => {
        if (score > 70) return THEME.high;
        if (score > 30) return THEME.med;
        return THEME.low;
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}><ChevronLeft color={THEME.dark} size={28} /></TouchableOpacity>
                <Text style={styles.headerTitle}>SCAN ANALYSIS</Text>
                <Zap color={THEME.primary} size={20} fill={THEME.primary} />
            </View>

            <ScrollView contentContainerStyle={{padding: 20}}>
                
                {/* Overall Health Score Card */}
                <View style={styles.scoreCard}>
                    <Text style={styles.scoreLabel}>SKIN HEALTH SCORE</Text>
                    <Text style={[styles.scoreValue, {color: getScoreColor(100 - results.overall_score)}]}>
                        {results.overall_score}
                    </Text>
                    <Text style={styles.scoreSub}>out of 100</Text>
                </View>

                {/* Quantitative List */}
                <Text style={styles.sectionHeader}>DETECTION SCORES (1-100)</Text>
                {results.detections.sort((a:any, b:any) => b.score - a.score).map((item: any, i: number) => (
                    <View key={i} style={styles.row}>
                        <View style={styles.rowInfo}>
                            <Text style={styles.rowLabel}>{item.label}</Text>
                            <View style={[styles.scoreBadge, {backgroundColor: getScoreColor(item.score) + '15'}]}>
                                <Text style={[styles.badgeText, {color: getScoreColor(item.score)}]}>
                                    {item.score > 70 ? 'SEVERE' : item.score > 30 ? 'MODERATE' : 'STABLE'}
                                </Text>
                            </View>
                        </View>
                        
                        <View style={styles.meterContainer}>
                            <View style={[styles.meterFill, { width: `${item.score}%`, backgroundColor: getScoreColor(item.score) }]} />
                        </View>
                        <Text style={styles.percentageText}>{item.score}/100 Severity</Text>
                    </View>
                ))}

                {/* Advice Section */}
                <View style={styles.adviceBox}>
                    <View style={styles.adviceHeader}>
                        <ShieldAlert size={18} color={THEME.primary} />
                        <Text style={styles.adviceTitle}>CLINICAL ADVICE</Text>
                    </View>
                    <Text style={styles.adviceText}>{results.advice}</Text>
                </View>

                <TouchableOpacity style={styles.finalBtn} onPress={() => router.replace('/')}>
                    <LinearGradient colors={['#4F46E5', '#3730A3']} style={styles.gradient}>
                        <CheckCircle2 color="white" size={20} />
                        <Text style={styles.finalText}>SAVE REPORT</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <Text style={styles.footerNote}>AI Analysis: Results based on visual pixel density.</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#FFF' },
    headerTitle: { fontWeight: '900', fontSize: 14, color: '#64748B', letterSpacing: 1 },
    scoreCard: { backgroundColor: '#FFF', padding: 30, borderRadius: 32, alignItems: 'center', marginBottom: 25, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15, elevation: 2 },
    scoreLabel: { fontSize: 12, fontWeight: '800', color: '#94A3B8', marginBottom: 10 },
    scoreValue: { fontSize: 72, fontWeight: '900' },
    scoreSub: { fontSize: 14, fontWeight: '600', color: '#64748B' },
    sectionHeader: { fontSize: 13, fontWeight: '900', color: '#475569', marginBottom: 15, marginTop: 10 },
    row: { backgroundColor: '#FFF', padding: 20, borderRadius: 24, marginBottom: 12 },
    rowInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    rowLabel: { fontSize: 17, fontWeight: '800', color: THEME.dark },
    scoreBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    badgeText: { fontSize: 10, fontWeight: '900' },
    meterContainer: { height: 10, backgroundColor: '#F1F5F9', borderRadius: 5, overflow: 'hidden' },
    meterFill: { height: '100%', borderRadius: 5 },
    percentageText: { fontSize: 11, fontWeight: '700', color: '#94A3B8', marginTop: 8, textAlign: 'right' },
    adviceBox: { backgroundColor: '#EEF2FF', padding: 20, borderRadius: 24, marginTop: 15 },
    adviceHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    adviceTitle: { fontWeight: '900', fontSize: 13, color: THEME.primary },
    adviceText: { color: '#334155', lineHeight: 22, fontWeight: '500' },
    finalBtn: { marginTop: 30, borderRadius: 20, overflow: 'hidden' },
    gradient: { padding: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
    finalText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
    footerNote: { textAlign: 'center', fontSize: 11, color: '#94A3B8', marginTop: 25, marginBottom: 40 }
});