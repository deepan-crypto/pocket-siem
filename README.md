## Setup

### Prerequisites
- Node.js and npm (or yarn)
- EAS CLI installed globally

### Installation

Install EAS CLI:
```bash
npm install -g eas-cli
```

Or with yarn:
```bash
yarn global add eas-cli
```

## Building

To build for Android with preview profile:
```bash
eas build --platform android --profile preview
```

## Troubleshooting

### Backend Connection Issues on APK

If the backend is not connecting after installing the APK:

1. **Check API Endpoint Configuration**
   - Verify the backend URL in your app configuration is correct
   - For preview/production builds, use your actual backend server URL (not `localhost` or `127.0.0.1`)
   - Example: `https://your-backend-domain.com` instead of `http://localhost:3000`

2. **Verify Network Permissions**
   - Ensure `android:usesCleartextTraffic="true"` is set in AndroidManifest.xml if using HTTP (not recommended for production)
   - Use HTTPS for production backends

3. **Check Firewall/Network Access**
   - Ensure your device can reach the backend server
   - Test backend connectivity from your phone's browser if possible

4. **Environment-Specific Configuration**
   - Use different API endpoints for development, preview, and production builds
   - Set these via environment variables or build profiles in `eas.json`

---

For issues or feature requests, contact the development team.
