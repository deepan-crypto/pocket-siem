import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NetworkConnection } from '@/types/security';
import { colors, fontSize, spacing } from '@/constants/theme';

interface ConnectionItemProps {
  connection: NetworkConnection;
}

export function ConnectionItem({ connection }: ConnectionItemProps) {
  const [relativeTime, setRelativeTime] = useState('');

  const getStatusColor = () => {
    switch (connection.status) {
      case 'safe':
        return colors.safe;
      case 'suspicious':
        return colors.suspicious;
      case 'malicious':
        return colors.malicious;
      default:
        return colors.textTertiary;
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Update relative time every second
  useEffect(() => {
    const updateTime = () => {
      setRelativeTime(formatRelativeTime(connection.timestamp));
    };

    updateTime(); // Initial update
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [connection.timestamp]);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{connection.appIcon}</Text>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.appName}>{connection.appName}</Text>
          <Text style={styles.protocol}>{connection.protocol}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.ip}>{connection.destinationIp}</Text>
          <Text style={styles.port}>:{connection.port}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.timestamp}>{relativeTime}</Text>
          <Text style={styles.data}>{formatBytes(connection.dataTransferred)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    marginRight: spacing.md,
    position: 'relative',
  },
  icon: {
    fontSize: fontSize.xxxl,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  appName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  protocol: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 4,
  },
  ip: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  port: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    fontFamily: 'monospace',
  },
  timestamp: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
  data: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: '600',
  },
});
