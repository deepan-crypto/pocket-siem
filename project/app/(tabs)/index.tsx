import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { TrustScoreGauge } from '@/components/TrustScoreGauge';
import { StatCard } from '@/components/StatCard';
import { colors, spacing, fontSize } from '@/constants/theme';
import threatService from '@/services/threatService';

export default function Dashboard() {
  const [deviceStats, setDeviceStats] = useState<any>(null);
  const [chartData, setChartData] = useState<number[]>([]);
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const screenWidth = Dimensions.get('window').width;

  const fetchDashboardData = async () => {
    try {
      // Fetch device stats
      const stats = await threatService.getDeviceStats();
      setDeviceStats(stats);

      // Fetch attack surface data for chart
      const surfaceData = await threatService.getAttackSurfaceData();

      // Extract chart data (last 7 data points for better visibility)
      const last7 = surfaceData.slice(-7);
      const data = last7.map(point => point.threatCount);
      const labels = last7.map(point => point.timeLabel);

      setChartData(data);
      setChartLabels(labels);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchDashboardData();

    // Auto-refresh every 5 seconds for live updates
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatDataUsage = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    return `${(mb / 1024).toFixed(1)} GB`;
  };

  if (loading && !deviceStats) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading security dashboard...</Text>
      </View>
    );
  }

  const lineChartData = {
    labels: chartLabels.length > 0 ? chartLabels : ['Loading...'],
    datasets: [
      {
        data: chartData.length > 0 ? chartData : [0],
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

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      <View style={styles.gaugeContainer}>
        <Text style={styles.sectionTitle}>DEVICE TRUST SCORE</Text>
        <TrustScoreGauge
          score={deviceStats?.deviceTrustScore || 0}
          size={220}
        />
        <Text style={styles.gaugeSubtext}>
          Your device security posture
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>LIVE ATTACK SURFACE</Text>
        <View style={styles.chartContainer}>
          <LineChart
            data={lineChartData}
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
        <Text style={styles.chartLabel}>Threat Activity (last hour)</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>QUICK STATS</Text>
        <View style={styles.statsContainer}>
          <StatCard
            title="Apps Monitored"
            value={deviceStats?.appsMonitored || 0}
            icon="📱"
          />
          <StatCard
            title="Threats Blocked"
            value={deviceStats?.threatsBlocked || 0}
            icon="🛡️"
          />
          <StatCard
            title="Data Usage"
            value={formatDataUsage(deviceStats?.dataUsageBytes || 0)}
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  errorBanner: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.error + '20',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error,
    textAlign: 'center',
  },
});
