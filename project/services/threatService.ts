import API_BASE_URL, { DEFAULT_HEADERS, API_TIMEOUT, fetchWithTimeout } from '../config/api';

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
      const response = await fetchWithTimeout(
        `${this.baseUrl}/device-stats`,
        {
          method: 'GET',
          headers: DEFAULT_HEADERS,
        },
        API_TIMEOUT
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch device stats`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error fetching device stats:', error);
      // Provide user-friendly error message
      if (error.message.includes('timeout')) {
        throw new Error('Request timed out. Please check your network connection.');
      }
      throw new Error('Failed to load device statistics. Please try again.');
    }
  }

  /**
   * Get attack surface data (Last Hour Chart)
   */
  async getAttackSurfaceData(): Promise<AttackSurfaceDataPoint[]> {
    try {
      const response = await fetchWithTimeout(
        `${this.baseUrl}/attack-surface`,
        {
          method: 'GET',
          headers: DEFAULT_HEADERS,
        },
        API_TIMEOUT
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch attack surface data`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error fetching attack surface data:', error);
      if (error.message.includes('timeout')) {
        throw new Error('Request timed out. Please check your network connection.');
      }
      throw new Error('Failed to load attack surface data. Please try again.');
    }
  }

  /**
   * Get live network connections (Live Monitor)
   */
  async getLiveConnections(): Promise<NetworkConnection[]> {
    try {
      const response = await fetchWithTimeout(
        `${this.baseUrl}/live-connections`,
        {
          method: 'GET',
          headers: DEFAULT_HEADERS,
        },
        API_TIMEOUT
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch live connections`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error fetching live connections:', error);
      if (error.message.includes('timeout')) {
        throw new Error('Request timed out. Please check your network connection.');
      }
      throw new Error('Failed to load network connections. Please try again.');
    }
  }

  /**
   * Check IP reputation
   */
  async checkIpReputation(ipAddress: string): Promise<IpReputation> {
    try {
      const response = await fetchWithTimeout(
        `${this.baseUrl}/reputation?ip=${encodeURIComponent(ipAddress)}`,
        {
          method: 'GET',
          headers: DEFAULT_HEADERS,
        },
        API_TIMEOUT
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to check IP reputation`);
      }

      return await response.json();
    } catch (error: any) {
      console.error(`Error checking reputation for IP ${ipAddress}:`, error);
      if (error.message.includes('timeout')) {
        throw new Error('Request timed out. Please check your network connection.');
      }
      throw new Error('Failed to check IP reputation. Please try again.');
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
      const response = await fetchWithTimeout(
        `${this.baseUrl}/report`,
        {
          method: 'POST',
          headers: DEFAULT_HEADERS,
          body: JSON.stringify(threatData),
        },
        API_TIMEOUT
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to report threat`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error reporting threat:', error);
      if (error.message.includes('timeout')) {
        throw new Error('Request timed out. Please check your network connection.');
      }
      throw new Error('Failed to report threat. Please try again.');
    }
  }

  /**
   * Get reports for a specific IP
   */
  async getReportsForIp(ipAddress: string) {
    try {
      const response = await fetchWithTimeout(
        `${this.baseUrl}/reports/${encodeURIComponent(ipAddress)}`,
        {
          method: 'GET',
          headers: DEFAULT_HEADERS,
        },
        API_TIMEOUT
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch reports for IP`);
      }

      return await response.json();
    } catch (error: any) {
      console.error(`Error fetching reports for IP ${ipAddress}:`, error);
      if (error.message.includes('timeout')) {
        throw new Error('Request timed out. Please check your network connection.');
      }
      throw new Error('Failed to fetch threat reports. Please try again.');
    }
  }

  /**
   * Get recent report count for IP (last 24 hours)
   */
  async getRecentReportCount(ipAddress: string): Promise<number> {
    try {
      const response = await fetchWithTimeout(
        `${this.baseUrl}/reports/ip/${encodeURIComponent(ipAddress)}/count`,
        {
          method: 'GET',
          headers: DEFAULT_HEADERS,
        },
        API_TIMEOUT
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch report count`);
      }

      const count = await response.json();
      return count;
    } catch (error: any) {
      console.error(`Error fetching report count for IP ${ipAddress}:`, error);
      if (error.message.includes('timeout')) {
        throw new Error('Request timed out. Please check your network connection.');
      }
      throw new Error('Failed to fetch report count. Please try again.');
    }
  }
}

export default new ThreatService();
