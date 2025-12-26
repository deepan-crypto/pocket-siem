import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { TrustScoreGauge } from '@/components/TrustScoreGauge';
import { StatCard } from '@/components/StatCard';
import { colors, spacing, fontSize } from '@/constants/theme';
import { mockDeviceStats, mockTrafficData } from '@/data/mockData';

export default function Dashboard() {
  const screenWidth = Dimensions.get('window').width;

  const chartData = {
    labels: ['1h', '50m', '40m', '30m', '20m', '10m', 'Now'],
    datasets: [
      {
        data: mockTrafficData.map((d) => d.value),
        strokeWidth: 3,
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PocketSIEM</Text>
        <Text style={styles.subtitle}>Security Operations Center</Text>
      </View>

      <View style={styles.gaugeContainer}>
        <Text style={styles.sectionTitle}>DEVICE TRUST SCORE</Text>
        <TrustScoreGauge score={mockDeviceStats.trustScore} size={220} />
        <Text style={styles.gaugeSubtext}>
          Your device security posture
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>LIVE ATTACK SURFACE</Text>
        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={screenWidth - spacing.md * 2}
            height={200}
            chartConfig={{
              backgroundColor: colors.surface,
              backgroundGradientFrom: colors.surface,
              backgroundGradientTo: colors.surfaceElevated,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 230, 118, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(176, 176, 176, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: colors.primary,
              },
              propsForBackgroundLines: {
                strokeDasharray: '',
                stroke: colors.border,
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>
        <Text style={styles.chartLabel}>Network Traffic (connections/min)</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>QUICK STATS</Text>
        <View style={styles.statsContainer}>
          <StatCard
            title="Apps Monitored"
            value={mockDeviceStats.appsMonitored}
            icon="📱"
          />
          <StatCard
            title="Threats Blocked"
            value={mockDeviceStats.threatsBlocked}
            icon="🛡️"
          />
          <StatCard
            title="Data Usage"
            value={mockDeviceStats.dataUsage}
            icon="📊"
          />
        </View>
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl * 1.5,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  gaugeContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  gaugeSubtext: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginTop: spacing.md,
  },
  section: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  chartContainer: {
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
  chart: {
    borderRadius: 16,
  },
  chartLabel: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -spacing.xs,
  },
  footer: {
    height: spacing.xl,
  },
});
