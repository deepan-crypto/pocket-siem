import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { ThreatAlert } from '@/types/security';
import { colors, fontSize, spacing } from '@/constants/theme';

interface ThreatAlertModalProps {
  visible: boolean;
  threat: ThreatAlert | null;
  onBlock: () => void;
  onAllow: () => void;
}

export function ThreatAlertModal({
  visible,
  threat,
  onBlock,
  onAllow,
}: ThreatAlertModalProps) {
  if (!threat) return null;

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getSeverityColor = () => {
    switch (threat.severity) {
      case 'critical':
        return colors.error;
      case 'high':
        return colors.malicious;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.suspicious;
      default:
        return colors.textTertiary;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={onAllow}>
        <View style={styles.container}>
          <View style={styles.alertHeader}>
            <Text style={styles.alertIcon}>⚠️</Text>
            <Text style={styles.alertTitle}>THREAT DETECTED!</Text>
            <View
              style={[
                styles.severityBadge,
                { backgroundColor: getSeverityColor() },
              ]}
            >
              <Text style={styles.severityText}>
                {threat.severity.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.appInfo}>
              <Text style={styles.appIcon}>{threat.appIcon}</Text>
              <View style={styles.appDetails}>
                <Text style={styles.label}>Source Application</Text>
                <Text style={styles.value}>{threat.appName}</Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoRow}>
              <Text style={styles.label}>Malicious IP</Text>
              <Text style={[styles.value, styles.monospace]}>
                {threat.maliciousIp}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Threat Type</Text>
              <Text style={styles.value}>{threat.threatType}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Detected At</Text>
              <Text style={styles.value}>{formatTimestamp(threat.timestamp)}</Text>
            </View>

            <View style={styles.separator} />

            <Text style={styles.warning}>
              This connection has been identified as potentially malicious. It is
              recommended to block this connection immediately.
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.blockButton]}
              onPress={onBlock}
              activeOpacity={0.8}
            >
              <Text style={styles.blockButtonText}>🛡️ Block Connection</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.allowButton]}
              onPress={onAllow}
              activeOpacity={0.8}
            >
              <Text style={styles.allowButtonText}>Allow & Ignore</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: colors.error,
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  alertHeader: {
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  alertIcon: {
    fontSize: fontSize.xxxl * 1.5,
    marginBottom: spacing.sm,
  },
  alertTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.error,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  severityBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  severityText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1,
  },
  content: {
    padding: spacing.lg,
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  appIcon: {
    fontSize: fontSize.xxxl,
    marginRight: spacing.md,
  },
  appDetails: {
    flex: 1,
  },
  infoRow: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs / 2,
  },
  value: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: '600',
  },
  monospace: {
    fontFamily: 'monospace',
    color: colors.error,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  warning: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  actions: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockButton: {
    backgroundColor: colors.error,
  },
  blockButtonText: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.text,
    letterSpacing: 1,
  },
  allowButton: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  allowButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
