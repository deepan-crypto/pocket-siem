# PocketSIEM Integration Guide

## Overview

PocketSIEM is a mobile security application built with React Native and Expo. The UI is complete with a cyberpunk/enterprise security aesthetic, featuring:

- **Dashboard**: Trust score gauge, live traffic chart, and quick stats
- **Live Monitor**: Real-time connection list with threat status indicators
- **Threat Alert Modal**: High-priority threat notifications

## Important Limitations

⚠️ **Network Traffic Monitoring Limitation**: Expo Go does not support native VPN services required for actual network traffic monitoring. To implement real traffic monitoring, you'll need to:

1. **Eject from Expo** and create a custom development build, OR
2. **Develop native Android VPN module** using Android's VpnService API
3. **Bridge the native module** to React Native

This UI is ready for integration with your backend VPN service once implemented.

## Project Structure

```
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab navigation configuration
│   │   ├── index.tsx             # Dashboard screen
│   │   └── monitor.tsx           # Live Monitor screen
│   └── _layout.tsx               # Root layout
├── components/
│   ├── TrustScoreGauge.tsx       # Circular trust score gauge
│   ├── StatCard.tsx              # Quick stat card component
│   ├── ConnectionItem.tsx        # Network connection list item
│   └── ThreatAlertModal.tsx      # Threat alert modal
├── constants/
│   └── theme.ts                  # Color scheme and design tokens
├── types/
│   └── security.ts               # TypeScript interfaces
└── data/
    └── mockData.ts               # Placeholder data structures
```

## Data Structures

### NetworkConnection

```typescript
interface NetworkConnection {
  id: string;
  appName: string;
  appIcon: string;
  destinationIp: string;
  protocol: 'TCP' | 'UDP';
  status: 'safe' | 'suspicious' | 'malicious';
  timestamp: Date;
  port: number;
  dataTransferred: number;
}
```

### ThreatAlert

```typescript
interface ThreatAlert {
  id: string;
  appName: string;
  appIcon: string;
  maliciousIp: string;
  threatType: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}
```

### DeviceStats

```typescript
interface DeviceStats {
  trustScore: number;
  appsMonitored: number;
  threatsBlocked: number;
  dataUsage: string;
}
```

### TrafficDataPoint

```typescript
interface TrafficDataPoint {
  timestamp: number;
  value: number;
}
```

## Integration Steps

### 1. Replace Mock Data

Replace the imports in your screens from `@/data/mockData` to your actual data source:

```typescript
// Before
import { mockDeviceStats, mockConnections } from '@/data/mockData';

// After
import { useDeviceStats, useConnections } from '@/hooks/useSecurity';
```

### 2. Implement Real-time Updates

For live connection monitoring, use React state or a real-time data source:

```typescript
// app/(tabs)/monitor.tsx
import { useState, useEffect } from 'react';

export default function Monitor() {
  const [connections, setConnections] = useState<NetworkConnection[]>([]);

  useEffect(() => {
    // Subscribe to your VPN service events
    const subscription = VPNService.onConnectionUpdate((newConnection) => {
      setConnections((prev) => [newConnection, ...prev]);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ... rest of component
}
```

### 3. Implement Threat Detection Logic

When a malicious connection is detected, trigger the ThreatAlertModal:

```typescript
const [activeThreat, setActiveThreat] = useState<ThreatAlert | null>(null);

useEffect(() => {
  const subscription = ThreatDetectionService.onThreatDetected((threat) => {
    setActiveThreat(threat);
  });

  return () => subscription.unsubscribe();
}, []);

const handleBlock = async () => {
  if (activeThreat) {
    await VPNService.blockConnection(activeThreat.maliciousIp);
    setActiveThreat(null);
  }
};
```

### 4. Calculate Trust Score

Implement your trust score algorithm based on various security metrics:

```typescript
function calculateTrustScore(metrics: SecurityMetrics): number {
  const weights = {
    threatsBlocked: 0.3,
    unknownApps: 0.2,
    suspiciousConnections: 0.3,
    outdatedApps: 0.2,
  };

  // Your calculation logic
  return Math.round(score);
}
```

### 5. Implement Traffic Analytics

For the live attack surface chart, aggregate network traffic data:

```typescript
function aggregateTrafficData(
  connections: NetworkConnection[]
): TrafficDataPoint[] {
  // Group by time intervals (e.g., every 10 minutes)
  // Count connections per interval
  // Return array of TrafficDataPoint
}
```

## Native Android VPN Service Implementation

To implement actual network monitoring, you'll need to create a native Android module:

### 1. Create VPN Service (Kotlin/Java)

```kotlin
class PacketVpnService : VpnService() {
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Setup VPN
        val builder = Builder()
        builder.addAddress("10.0.0.2", 24)
        builder.addRoute("0.0.0.0", 0)
        builder.addDnsServer("8.8.8.8")

        val vpnInterface = builder.establish()

        // Monitor packets
        monitorTraffic(vpnInterface)

        return START_STICKY
    }

    private fun monitorTraffic(vpnInterface: ParcelFileDescriptor?) {
        // Read packets from vpnInterface
        // Parse packet headers
        // Send events to React Native
    }
}
```

### 2. Bridge to React Native

Create a native module to communicate with React Native:

```kotlin
class VPNModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "VPNService"

    @ReactMethod
    fun startMonitoring() {
        val intent = Intent(currentActivity, PacketVpnService::class.java)
        currentActivity?.startService(intent)
    }

    @ReactMethod
    fun blockConnection(ip: String) {
        // Implement blocking logic
    }
}
```

### 3. Add Required Permissions

In `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.BIND_VPN_SERVICE" />

<service
    android:name=".PacketVpnService"
    android:permission="android.permission.BIND_VPN_SERVICE">
    <intent-filter>
        <action android:name="android.net.VpnService" />
    </intent-filter>
</service>
```

## Color Scheme

The app uses a dark cyberpunk theme:

- **Background**: `#121212`
- **Surface**: `#1E1E1E`
- **Primary (Neon Green)**: `#00E676`
- **Error/Malicious**: `#CF6679`
- **Warning/Suspicious**: `#FFC107`

To customize colors, edit `constants/theme.ts`.

## Testing the UI

The app includes a demo button in the Monitor screen to trigger the Threat Alert Modal. This allows you to test the UI without implementing the VPN service first.

## Next Steps

1. Implement native Android VPN service
2. Create React Native bridge for VPN service
3. Replace mock data with real data sources
4. Implement threat detection algorithms
5. Add data persistence (consider Supabase for storing threat logs)
6. Add user settings screen
7. Implement notification system for critical threats
8. Add export functionality for security reports

## Support

For questions about the UI implementation, refer to the component files. For VPN service implementation, consult Android's VpnService documentation.
