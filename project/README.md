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
- **Java 17+** (for backend server)

### Backend Setup (REQUIRED)

The app requires a running backend server to function properly.

#### 1. Start the Backend

```bash
cd ../pocketSIEM
./gradlew bootRun
```

The backend will start on `http://localhost:8080`

See [Backend README](../pocketSIEM/BACKEND_README.md) for detailed instructions.

### Frontend Installation

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure your backend URL:

```env
# For local development on the same machine
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1

# For testing on physical device (replace with your computer's IP)
# EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:8080/api/v1

# For Android emulator
# EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8080/api/v1

# API Key (must match backend configuration)
EXPO_PUBLIC_API_KEY=your-custom-secret-key-here
```

**Important**: 
- When using Expo Go on a physical device, replace `localhost` with your computer's IP address
- Get your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- Ensure your device and computer are on the same network

#### 3. Run the App

```bash
npm run dev
```

Scan the QR code with Expo Go to view the app on your device.

## Connecting to Backend

### Development Mode Options

1. **iOS Simulator**: Use `localhost` - works out of the box
2. **Android Emulator**: Use `10.0.2.2` instead of `localhost`
3. **Physical Device (Expo Go)**: Use your computer's local IP (e.g., `192.168.1.100`)

### Testing the Connection

1. Start the backend server
2. Start the Expo dev server
3. Open the app in Expo Go
4. If the Dashboard loads with data, the connection is successful
5. If you see errors, check:
   - Backend is running (`curl http://localhost:8080/actuator/health`)
   - `.env` file has correct IP address
   - API key matches backend configuration
   - Firewall allows connections on port 8080

## Important Note About VPN Functionality

⚠️ **The app can connect to a live backend for threat intelligence.**

The frontend currently displays:
- **Live data from backend** when properly configured
- **Mock data fallback** if backend is unavailable

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
├── config/               # API and app configuration
│   └── api.ts           # API base URL and fetch helpers
├── constants/            # Theme and design tokens
├── services/             # API service layer
│   └── threatService.ts # Backend API calls
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
- Dashboard displays live data from backend or falls back to mock data
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

## Troubleshooting

### "Network request failed" errors

1. **Check backend is running**: `curl http://localhost:8080/actuator/health`
2. **Verify .env configuration**: Ensure API URL and key are correct
3. **Check network**: Device and computer must be on same WiFi
4. **Firewall**: Allow port 8080 through your firewall
5. **Use IP address**: Replace `localhost` with actual IP for physical devices

### Dashboard shows no data

1. Check browser/Expo console for error messages
2. Verify backend endpoints return data
3. Check API key matches between frontend and backend
4. Try the backend API directly: `curl -H "X-API-KEY: your-custom-secret-key-here" http://localhost:8080/api/v1/device-stats`

### CORS errors

If you see CORS-related errors:
1. Ensure backend `CorsConfig.java` allows your IP range
2. Restart the backend server after making changes
3. Clear app cache and reload

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
