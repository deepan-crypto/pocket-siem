# PocketSIEM - Mobile Security Operations Center

A complete security monitoring solution combining a React Native frontend with a Spring Boot backend for real-time threat detection and response on Android devices.

## 🏗️ Architecture

- **Frontend**: React Native + Expo (Cyberpunk-themed UI)
- **Backend**: Spring Boot 3.2+ (Threat Intelligence Relay)
- **Database**: H2 (dev) / MySQL (production)
- **Authentication**: API Key-based (X-API-KEY header)

## Backend Features

- ✅ IP Reputation Checking with Caching
- ✅ Crowdsourced Threat Reporting
- ✅ API Key Authentication (X-API-KEY header)
- ✅ Device Trust Score Calculation (0-100%)
- ✅ Live Attack Surface Analytics (Last Hour)
- ✅ Real-time Network Connection Monitoring
- ✅ JPA/Hibernate ORM with H2/MySQL Support
- ✅ Spring Security Integration
- ✅ Global Exception Handling
- ✅ RESTful API with Input Validation

## Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- Node.js 18+ (for frontend)

### Build & Run Backend

```bash
cd /home/edith/Downloads/pocketSIEM/pocketSIEM
mvn clean install
mvn spring-boot:run
```

The backend server will start on `http://localhost:8080`

### Run Frontend

```bash
cd /home/edith/Downloads/pocketSIEM/project
npm install
npm run dev
```

## API Endpoints

### Dashboard Endpoints

#### 1. Get Device Statistics
```
GET /api/v1/device-stats
Header: X-API-KEY: sk-demo-key-12345
```

Response:
```json
{
  "deviceTrustScore": 85,
  "appsMonitored": 25,
  "threatsBlocked": 12,
  "dataUsageBytes": 536870912,
  "criticalThreats": 1,
  "highThreats": 3,
  "suspiciousConnections": 8
}
```

#### 2. Get Attack Surface Data (Last Hour)
```
GET /api/v1/attack-surface
Header: X-API-KEY: sk-demo-key-12345
```

Response:
```json
[
  {
    "timestamp": 1705329600000,
    "timeLabel": "10:00",
    "threatCount": 2,
    "networkTraffic": 5242880
  },
  {
    "timestamp": 1705330200000,
    "timeLabel": "10:05",
    "threatCount": 5,
    "networkTraffic": 10485760
  }
]
```

### Live Monitor Endpoints

#### 3. Get Live Network Connections
```
GET /api/v1/live-connections
Header: X-API-KEY: sk-demo-key-12345
```

Response:
```json
[
  {
    "appName": "Chrome",
    "appPackage": "com.android.chrome",
    "destinationIp": "142.251.32.46",
    "port": 443,
    "protocol": "TCP",
    "status": "SAFE",
    "dataTransferred": 524288,
    "timestamp": 1705330800000
  },
  {
    "appName": "Banking Trojan",
    "appPackage": "com.malicious.banking",
    "destinationIp": "103.145.45.67",
    "port": 443,
    "protocol": "TCP",
    "status": "MALICIOUS",
    "dataTransferred": 51200,
    "timestamp": 1705330770000
  }
]
```

### Threat Intelligence Endpoints

#### 4. Check IP Reputation
```
GET /api/v1/reputation?ip=8.8.8.8
Header: X-API-KEY: sk-demo-key-12345
```

Response:
```json
{
  "ipAddress": "8.8.8.8",
  "riskScore": 15,
  "category": "Safe",
  "countryCode": "US",
  "reportCount": 3,
  "lastSeen": "2024-01-15T10:30:00Z",
  "isVpn": false,
  "isProxy": false,
  "threatLevel": "SAFE"
}
```

#### 5. Submit Threat Report
```
POST /api/v1/report
Header: X-API-KEY: sk-demo-key-12345
Content-Type: application/json
```

Request Body:
```json
{
  "appName": "com.example.app",
  "targetIp": "192.168.1.100",
  "protocol": "TCP",
  "description": "Suspicious outbound connection",
  "deviceId": "device-hash-abc123",
  "userSeverity": 75
}
```

#### 6. Get Reports for IP
```
GET /api/v1/reports/192.168.1.100
Header: X-API-KEY: sk-demo-key-12345
```

#### 7. Get Reports for App
```
GET /api/v1/reports/app/com.example.app
Header: X-API-KEY: sk-demo-key-12345
```

#### 8. Get Recent Report Count
```
GET /api/v1/reports/ip/192.168.1.100/count
Header: X-API-KEY: sk-demo-key-12345
```

## Environment Configuration

### Set API Key
```bash
export API_KEY=your-secret-api-key-here
```

Or edit `pocketSIEM/src/main/resources/application.properties`:
```properties
app.security.api-key=your-secret-api-key-here
```

## Database Setup

### Development (H2 - In-Memory)
- Auto-creates tables on startup
- Access H2 console at `http://localhost:8080/h2-console`
- No configuration needed

### Production (MySQL)

1. Create database:
```sql
CREATE DATABASE pocketsiem;
```

2. Update `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/pocketsiem
spring.datasource.username=root
spring.datasource.password=your-password
spring.jpa.hibernate.ddl-auto=validate
```

3. Run with MySQL profile:
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=mysql"
```

## Caching

IP reputation results are cached in-memory for performance. To configure:

```properties
spring.cache.type=simple
# Cache is automatically invalidated for new IPs
```

## Security

- ✅ All endpoints require valid `X-API-KEY` header
- ✅ Stateless authentication (no sessions)
- ✅ CSRF disabled for API
- ✅ Input validation on all endpoints
- ✅ Proper HTTP status codes

### Security Best Practices
- Use strong API keys (min 32 characters)
- Rotate API keys regularly
- Use HTTPS in production
- Store credentials in environment variables, not in code
- Never commit `.properties` files with secrets to version control

## Project Structure

```
pocketSIEM/
├── pocketSIEM/                    # Backend (Spring Boot)
│   ├── src/main/java/com/hackathon/pocketSIEM/
│   │   ├── controller/            # REST endpoints
│   │   ├── service/               # Business logic
│   │   ├── repository/            # Data access
│   │   ├── model/                 # JPA entities
│   │   ├── dto/                   # Data transfer objects
│   │   ├── config/                # Spring configuration
│   │   ├── security/              # Authentication
│   │   └── exception/             # Error handling
│   ├── src/main/resources/
│   │   └── application.properties  # Configuration
│   └── pom.xml                    # Maven dependencies
│
└── project/                        # Frontend (React Native)
    ├── app/
    │   ├── (tabs)/                # Tab screens
    │   └── _layout.tsx            # Navigation
    ├── components/                # Reusable UI
    ├── constants/                 # Theme & tokens
    ├── types/                     # TypeScript types
    └── package.json               # Dependencies
```

## Testing the API

### Using cURL

```bash
# Check IP reputation
curl -X GET "http://localhost:8080/api/v1/reputation?ip=8.8.8.8" \
  -H "X-API-KEY: sk-demo-key-12345"

# Submit threat report
curl -X POST "http://localhost:8080/api/v1/report" \
  -H "X-API-KEY: sk-demo-key-12345" \
  -H "Content-Type: application/json" \
  -d '{
    "appName": "com.example.app",
    "targetIp": "192.168.1.1",
    "protocol": "TCP",
    "deviceId": "device-123",
    "userSeverity": 50
  }'

# Get device stats
curl -X GET "http://localhost:8080/api/v1/device-stats" \
  -H "X-API-KEY: sk-demo-key-12345"

# Get live connections
curl -X GET "http://localhost:8080/api/v1/live-connections" \
  -H "X-API-KEY: sk-demo-key-12345"
```

### Using Postman

1. Set base URL: `http://localhost:8080`
2. Add header to all requests: `X-API-KEY: sk-demo-key-12345`
3. Import API endpoints from endpoints list above

## Future Enhancements

- 🔗 Integration with AbuseIPDB and VirusTotal APIs
- 📊 Redis caching for distributed deployment
- ⏱️ Rate limiting per API key
- 🔔 Webhook support for real-time alerts
- 📈 Admin dashboard for threat analytics
- 🔐 OAuth2/JWT authentication
- 📱 WebSocket for real-time updates
- 🗄️ Database replication for high availability
- 📊 Advanced threat analytics and reporting
- 🤖 Machine learning for anomaly detection

## Troubleshooting

### Backend won't start
```bash
# Check if port 8080 is already in use
lsof -i :8080
# Kill the process if needed
kill -9 <PID>
```

### API Key not working
```bash
# Verify the API key in application.properties
grep "api-key" pocketSIEM/src/main/resources/application.properties
# Should match the X-API-KEY header in requests
```

### Database errors
```bash
# Check H2 console
open http://localhost:8080/h2-console
# URL: jdbc:h2:mem:pocketsiem_db
# User: sa (no password)
```

## License

Private project for PocketSIEM

## Support

For issues or feature requests, contact the development team.
