import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Progress</Text>
          <Text style={styles.subtitle}>You're doing great this week!</Text>
        </View>

        {/* Main Progress Ring Placeholder */}
        <View style={styles.mainProgressCard}>
          <View style={styles.progressRingBase}>
            {/* This simulates a progress circle */}
            <View style={styles.progressRingActive} />
            <View style={styles.progressTextContainer}>
              <Text style={styles.percentageText}>75%</Text>
              <Text style={styles.goalText}>of weekly goal</Text>
            </View>
          </View>
        </View>

        {/* Detailed Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={20} color="#FF768E" />
            <Text style={styles.statValue}>1,240</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time" size={20} color="#38bdf8" />
            <Text style={styles.statValue}>4.5h</Text>
            <Text style={styles.statLabel}>Activity</Text>
          </View>
        </View>

        {/* Activity Bar Chart Simulation */}
        <Text style={styles.sectionHeader}>Activity Breakdown</Text>
        <View style={styles.chartContainer}>
          {[40, 70, 45, 90, 65, 80, 30].map((height, index) => (
            <View key={index} style={styles.barWrapper}>
              <View style={[styles.bar, { height: height }]} />
              <Text style={styles.barLabel}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100, 
  },
  header: {
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  mainProgressCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  progressRingBase: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 12,
    borderColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRingActive: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 12,
    borderColor: '#FF768E',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
  progressTextContainer: {
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1e293b',
  },
  goalText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 15,
  },
  chartContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  barWrapper: {
    alignItems: 'center',
  },
  bar: {
    width: 12,
    backgroundColor: '#FF768E',
    borderRadius: 6,
    opacity: 0.8,
  },
  barLabel: {
    marginTop: 8,
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
});