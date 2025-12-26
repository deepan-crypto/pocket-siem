import API_BASE_URL, { DEFAULT_HEADERS, API_TIMEOUT } from '../config/api';

// Device Stats Response
export interface DeviceStats {
  deviceTrustScore: number;
  appsMonitored: number;
  threatsBlocked: number;
  dataUsageBytes: number;
  criticalThreats: number;
  highThreats: number;
  suspiciousConnections: number;
}

// Attack Surface Data Point
export interface AttackSurfaceDataPoint {
  timestamp: number;
  timeLabel: string;
  threatCount: number;
  networkTraffic: number;
}

// Network Connection
export interface NetworkConnection {
  appName: string;
  appPackage: string;
  destinationIp: string;
  port: number;
  protocol: string;
  status: 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS';
  dataTransferred: number;
  timestamp: number;
}

// IP Reputation
export interface IpReputation {
  ipAddress: string;
  riskScore: number;
  category: string;
  countryCode: string;
  reportCount: number;
  lastSeen: string;
  isVpn: boolean;
  isProxy: boolean;
  threatLevel: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

class ThreatService {
  private baseUrl: string = API_BASE_URL;

  /**
   * Get device statistics (Dashboard)
   */
  async getDeviceStats(): Promise<DeviceStats> {
    try {
      const response = await fetch(`${this.baseUrl}/device-stats`, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        timeout: API_TIMEOUT,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch device stats`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching device stats:', error);
      throw error;
    }
  }

  /**
   * Get attack surface data (Last Hour Chart)
   */
  async getAttackSurfaceData(): Promise<AttackSurfaceDataPoint[]> {
    try {
      const response = await fetch(`${this.baseUrl}/attack-surface`, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        timeout: API_TIMEOUT,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch attack surface data`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching attack surface data:', error);
      throw error;
    }
  }

  /**
   * Get live network connections (Live Monitor)
   */
  async getLiveConnections(): Promise<NetworkConnection[]> {
    try {
      const response = await fetch(`${this.baseUrl}/live-connections`, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        timeout: API_TIMEOUT,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch live connections`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching live connections:', error);
      throw error;
    }
  }

  /**
   * Check IP reputation
   */
  async checkIpReputation(ipAddress: string): Promise<IpReputation> {
    try {
      const response = await fetch(
        `${this.baseUrl}/reputation?ip=${encodeURIComponent(ipAddress)}`,
        {
          method: 'GET',
          headers: DEFAULT_HEADERS,
          timeout: API_TIMEOUT,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to check IP reputation`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error checking reputation for IP ${ipAddress}:`, error);
      throw error;
    }
  }

  /**
   * Report a threat
   */
  async reportThreat(threatData: {
    appName: string;
    targetIp: string;
    protocol?: string;
    description?: string;
    deviceId: string;
    userSeverity?: number;
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/report`, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(threatData),
        timeout: API_TIMEOUT,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to report threat`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error reporting threat:', error);
      throw error;
    }
  }

  /**
   * Get reports for a specific IP
   */
  async getReportsForIp(ipAddress: string) {
    try {
      const response = await fetch(`${this.baseUrl}/reports/${encodeURIComponent(ipAddress)}`, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        timeout: API_TIMEOUT,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch reports for IP`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching reports for IP ${ipAddress}:`, error);
      throw error;
    }
  }

  /**
   * Get recent report count for IP (last 24 hours)
   */
  async getRecentReportCount(ipAddress: string): Promise<number> {
    try {
      const response = await fetch(
        `${this.baseUrl}/reports/ip/${encodeURIComponent(ipAddress)}/count`,
        {
          method: 'GET',
          headers: DEFAULT_HEADERS,
          timeout: API_TIMEOUT,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch report count`);
      }

      const count = await response.json();
      return count;
    } catch (error) {
      console.error(`Error fetching report count for IP ${ipAddress}:`, error);
      throw error;
    }
  }
}

export default new ThreatService();
