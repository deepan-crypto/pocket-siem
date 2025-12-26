export type ThreatLevel = 'safe' | 'suspicious' | 'malicious';

export interface NetworkConnection {
  id: string;
  appName: string;
  appIcon: string;
  destinationIp: string;
  protocol: 'TCP' | 'UDP';
  status: ThreatLevel;
  timestamp: Date;
  port: number;
  dataTransferred: number;
}

export interface ThreatAlert {
  id: string;
  appName: string;
  appIcon: string;
  maliciousIp: string;
  threatType: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface DeviceStats {
  trustScore: number;
  appsMonitored: number;
  threatsBlocked: number;
  dataUsage: string;
}

export interface TrafficDataPoint {
  timestamp: number;
  value: number;
}
