# PocketSIEM - Mobile Security Operations Center

A React Native mobile application built with Expo that provides a cyberpunk-themed security monitoring interface for Android devices.

## Features

### 🛡️ Dashboard
- **Device Trust Score**: Large circular gauge showing security posture (0-100%)
- **Live Attack Surface**: Line chart displaying network traffic over the last hour
- **Quick Stats**: Three cards showing Apps Monitored, Threats Blocked, and Data Usage

### 📡 Live Monitor
- Real-time scrolling list of active network connections
- Each connection displays:
  - App icon and name
  - Destination IP address
  - Protocol (TCP/UDP)
  - Color-coded status indicator (Green=Safe, Yellow=Suspicious, Red=Malicious)
  - Port number and data transferred

### ⚠️ Threat Alert Modal
- High-priority popup for detected threats
- Displays:
  - Threat severity badge
  - Source application
  - Malicious IP address
  - Threat type description
  - Timestamp
- Actions:
  - Block Connection (Red button)
  - Allow & Ignore (Gray button)

## Design Aesthetic

**Cyberpunk/Enterprise Security Theme:**
- Dark mode with neon green accents
- Data-dense but readable layouts
- Professional security operations center feel
- Color scheme:
  - Background: `#121212`
  - Surface: `#1E1E1E`
  - Primary: `#00E676` (Neon Green)
  - Error: `#CF6679`
  - Warning: `#FFC107`

## Tech Stack

- **React Native** with **Expo SDK 54**
- **Expo Router** for file-based navigation
- **TypeScript** for type safety
- **react-native-chart-kit** for data visualization
- **lucide-react-native** for icons

## Getting Started

### Prerequisites

- Node.js 18+
- Expo Go app on your device (or Android/iOS simulator)

### Installation

```bash
npm install
```

### Running the App

```bash
npm run dev
```

Scan the QR code with Expo Go to view the app on your device.

## Important Note About VPN Functionality

⚠️ **This app currently displays UI with mock data.**

Network traffic monitoring via VPN requires native Android code that isn't available in Expo Go. To implement real traffic monitoring:

1. Eject from Expo managed workflow
2. Implement native Android VPN Service
3. Bridge the native module to React Native

See `INTEGRATION_GUIDE.md` for detailed integration instructions.

## Project Structure

```
├── app/
│   ├── (tabs)/           # Tab navigation screens
│   │   ├── index.tsx     # Dashboard
│   │   └── monitor.tsx   # Live Monitor
│   └── _layout.tsx       # Root layout
├── components/           # Reusable UI components
├── constants/            # Theme and design tokens
├── types/                # TypeScript type definitions
└── data/                 # Mock data for demonstration
```

## Data Structures

The app uses well-defined TypeScript interfaces for easy backend integration:

- `NetworkConnection` - Network traffic data
- `ThreatAlert` - Security threat information
- `DeviceStats` - Device security metrics
- `TrafficDataPoint` - Time-series traffic data

See `types/security.ts` for complete definitions.

## Customization

### Change Color Scheme

Edit `constants/theme.ts` to customize colors, spacing, and font sizes.

### Add New Screens

Create new files in the `app/(tabs)/` directory with `export default` React components.

## Demo Features

- Tap **"Show Threat Alert Demo"** button in the Monitor screen to see the threat modal
- All data is currently mocked for demonstration purposes
- Ready for integration with real data sources

## Development

### Type Checking

```bash
npm run typecheck
```

### Building for Production

```bash
npm run build:web
```

## Next Steps

1. Review `INTEGRATION_GUIDE.md` for backend integration details
2. Implement native Android VPN service
3. Replace mock data with real data sources
4. Add data persistence layer
5. Implement notification system
6. Add user settings and configuration

## License

Private project

## Author

Built for PocketSIEM security monitoring application
