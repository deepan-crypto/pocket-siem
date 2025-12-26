import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ConnectionItem } from '@/components/ConnectionItem';
import { ThreatAlertModal } from '@/components/ThreatAlertModal';
import { colors, spacing, fontSize } from '@/constants/theme';
import { mockThreatAlert } from '@/data/mockData';
import threatService from '@/services/threatService';
import type { NetworkConnection as BackendConnection } from '@/services/threatService';

// Local type for frontend display with app icons
interface LocalNetworkConnection {
  id: string;
  appName: string;
  appPackage: string;
  appIcon: string;
  destinationIp: string;
  port: number;
  protocol: string;
  status: 'safe' | 'suspicious' | 'malicious';
  dataTransferred: number;
  timestamp: Date;
}

export default function Monitor() {
  const [connections, setConnections] = useState<LocalNetworkConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showThreatModal, setShowThreatModal] = useState(false);

  // Map backend status to frontend format and add icons
  const mapBackendConnection = (conn: BackendConnection): LocalNetworkConnection => {
    const statusMap = {
      'SAFE': 'safe' as const,
      'SUSPICIOUS': 'suspicious' as const,
      'MALICIOUS': 'malicious' as const,
    };

    const iconMap: Record<string, string> = {
      'chrome': '🌐',
      'gmail': '📧',
      'whatsapp': '💬',
      'banking': '🏦',
      'spotify': '🎵',
      'unknown': '❓',
      'system': '⚙️',
    };

    const appKey = conn.appName.toLowerCase().replace(/\s+/g, '');
    const icon = iconMap[appKey] || iconMap['unknown'];

    return {
      id: `${conn.appPackage}-${conn.timestamp}`,
      appName: conn.appName,
      appPackage: conn.appPackage,
      appIcon: icon,
      destinationIp: conn.destinationIp,
      port: conn.port,
      protocol: conn.protocol,
      status: statusMap[conn.status] || 'suspicious',
      dataTransferred: conn.dataTransferred,
      timestamp: new Date(conn.timestamp),
    };
  };

  const fetchConnections = async () => {
    try {
      const data = await threatService.getLiveConnections();
      const mappedConnections = data.map(mapBackendConnection);
      setConnections(mappedConnections);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch connections:', err);
      setError(err.message || 'Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchConnections();

    // Auto-refresh every 3 seconds for live updates
    const interval = setInterval(() => {
      fetchConnections();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const safeCount = connections.filter((c) => c.status === 'safe').length;
  const suspiciousCount = connections.filter((c) => c.status === 'suspicious').length;
  const maliciousCount = connections.filter((c) => c.status === 'malicious').length;

  const handleBlock = () => {
    console.log('Connection blocked');
    setShowThreatModal(false);
  };

  const handleAllow = () => {
    console.log('Connection allowed');
    setShowThreatModal(false);
  };

  if (loading && connections.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading network connections...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Live Monitor</Text>
        <Text style={styles.subtitle}>Active Network Connections</Text>
      </View>

      <View style={styles.statusBar}>
        <View style={styles.statusItem}>
          <View style={[styles.statusIndicator, { backgroundColor: colors.safe }]} />
          <Text style={styles.statusText}>{safeCount} Safe</Text>
        </View>
        <View style={styles.statusItem}>
          <View
            style={[styles.statusIndicator, { backgroundColor: colors.suspicious }]}
          />
          <Text style={styles.statusText}>{suspiciousCount} Suspicious</Text>
        </View>
        <View style={styles.statusItem}>
          <View
            style={[styles.statusIndicator, { backgroundColor: colors.malicious }]}
          />
          <Text style={styles.statusText}>{maliciousCount} Malicious</Text>
        </View>
      </View>

      <View style={styles.demoButtonContainer}>
        <TouchableOpacity
          style={styles.demoButton}
          onPress={() => setShowThreatModal(true)}
        >
          <Text style={styles.demoButtonText}>⚠️ Show Threat Alert Demo</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <TouchableOpacity onPress={fetchConnections} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={connections}
        renderItem={({ item }) => <ConnectionItem connection={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={fetchConnections}
      />

      <ThreatAlertModal
        visible={showThreatModal}
        threat={mockThreatAlert}
        onBlock={handleBlock}
        onAllow={handleAllow}
      />
    </View>
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
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.xs,
  },
  statusText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  listContent: {
    padding: spacing.md,
  },
  demoButtonContainer: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  demoButton: {
    backgroundColor: colors.error,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  demoButtonText: {
    fontSize: fontSize.sm,
    fontWeight: 'bold',
    color: colors.text,
    letterSpacing: 1,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  errorContainer: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.error + '20',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.error,
  },
  retryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.error,
    borderRadius: 4,
  },
  retryText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
});
