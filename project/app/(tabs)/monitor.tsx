import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ConnectionItem } from '@/components/ConnectionItem';
import { ThreatAlertModal } from '@/components/ThreatAlertModal';
import { colors, spacing, fontSize } from '@/constants/theme';
import { mockConnections, mockThreatAlert } from '@/data/mockData';

export default function Monitor() {
  const [showThreatModal, setShowThreatModal] = useState(false);

  const safeCount = mockConnections.filter((c) => c.status === 'safe').length;
  const suspiciousCount = mockConnections.filter(
    (c) => c.status === 'suspicious'
  ).length;
  const maliciousCount = mockConnections.filter(
    (c) => c.status === 'malicious'
  ).length;

  const handleBlock = () => {
    console.log('Connection blocked');
    setShowThreatModal(false);
  };

  const handleAllow = () => {
    console.log('Connection allowed');
    setShowThreatModal(false);
  };

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

      <FlatList
        data={mockConnections}
        renderItem={({ item }) => <ConnectionItem connection={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
});
