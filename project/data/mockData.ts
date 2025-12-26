import {
  NetworkConnection,
  ThreatAlert,
  DeviceStats,
  TrafficDataPoint,
} from '@/types/security';

export const mockDeviceStats: DeviceStats = {
  trustScore: 87,
  appsMonitored: 42,
  threatsBlocked: 156,
  dataUsage: '2.4 GB',
};

export const mockTrafficData: TrafficDataPoint[] = [
  { timestamp: Date.now() - 3600000, value: 12 },
  { timestamp: Date.now() - 3000000, value: 19 },
  { timestamp: Date.now() - 2400000, value: 25 },
  { timestamp: Date.now() - 1800000, value: 15 },
  { timestamp: Date.now() - 1200000, value: 32 },
  { timestamp: Date.now() - 600000, value: 28 },
  { timestamp: Date.now(), value: 22 },
];

export const mockConnections: NetworkConnection[] = [
  {
    id: '1',
    appName: 'Chrome',
    appIcon: '🌐',
    destinationIp: '142.250.185.206',
    protocol: 'TCP',
    status: 'safe',
    timestamp: new Date(),
    port: 443,
    dataTransferred: 1024,
  },
  {
    id: '2',
    appName: 'WhatsApp',
    appIcon: '💬',
    destinationIp: '157.240.241.61',
    protocol: 'TCP',
    status: 'safe',
    timestamp: new Date(),
    port: 443,
    dataTransferred: 2048,
  },
  {
    id: '3',
    appName: 'Unknown App',
    appIcon: '❓',
    destinationIp: '185.220.101.45',
    protocol: 'TCP',
    status: 'suspicious',
    timestamp: new Date(),
    port: 8080,
    dataTransferred: 512,
  },
  {
    id: '4',
    appName: 'System Service',
    appIcon: '⚙️',
    destinationIp: '198.51.100.42',
    protocol: 'UDP',
    status: 'malicious',
    timestamp: new Date(),
    port: 53,
    dataTransferred: 256,
  },
  {
    id: '5',
    appName: 'Gmail',
    appIcon: '📧',
    destinationIp: '172.217.16.109',
    protocol: 'TCP',
    status: 'safe',
    timestamp: new Date(),
    port: 993,
    dataTransferred: 4096,
  },
  {
    id: '6',
    appName: 'Spotify',
    appIcon: '🎵',
    destinationIp: '35.186.224.25',
    protocol: 'TCP',
    status: 'safe',
    timestamp: new Date(),
    port: 443,
    dataTransferred: 8192,
  },
];

export const mockThreatAlert: ThreatAlert = {
  id: '1',
  appName: 'Unknown App',
  appIcon: '❓',
  maliciousIp: '198.51.100.42',
  threatType: 'Command & Control Server',
  timestamp: new Date(),
  severity: 'critical',
};
