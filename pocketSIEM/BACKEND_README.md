# PocketSIEM Backend

Spring Boot REST API server for the PocketSIEM mobile security monitoring application.

## Overview

This backend provides threat intelligence relay services, IP reputation checking, and security analytics for the PocketSIEM mobile app. It uses Spring Boot 3.2.0 with an H2 in-memory database for development.

## Features

- **IP Reputation Check**: Query threat intelligence for any IP address
- **Threat Reporting**: Submit and track security threats
- **Device Statistics**: Calculate device trust scores based on threat reports
- **Attack Surface Analytics**: Generate time-series data for security visualization
- **Live Connection Monitoring**: API endpoints for real-time network monitoring
- **API Key Authentication**: Secure endpoints with X-API-KEY header

## Tech Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** - API Key authentication
- **Spring Data JPA** - Database access
- **H2 Database** - In-memory database (development)
- **MySQL Support** - Production database option
- **Lombok** - Reduce boilerplate code
- **SLF4J** - Logging

## Prerequisites

- Java 17 or higher
- Gradle 7+ (included via wrapper)

## Quick Start

### 1. Build the Project

```bash
./gradlew build
```

### 2. Run the Server

```bash
./gradlew bootRun
```

The server will start on `http://localhost:8080`

### 3. Verify Health

```bash
curl http://localhost:8080/actuator/health
```

Expected response:
```json
{
  "status": "UP"
}
```

## Configuration

### Application Properties

Located at `src/main/resources/application.properties`:

```properties
# Server Configuration
server.port=8080

# Database (H2 in-memory)
spring.datasource.url=jdbc:h2:mem:pocketsiem_db
spring.jpa.hibernate.ddl-auto=create-drop

# Security
app.security.api-key=your-custom-secret-key-here

# CORS - Configured in CorsConfig.java
```

### API Key Configuration

**Default API Key**: `your-custom-secret-key-here`

**Change for production**:
1. Edit `application.properties`
2. Update `app.security.api-key=your-new-key`
3. Update frontend `.env` file to match

## API Endpoints

### Public Endpoints

#### Health Check
```
GET /actuator/health
```

### Authenticated Endpoints

All require `X-API-KEY` header.

#### 1. Get Device Statistics
```
GET /api/v1/device-stats
X-API-KEY: your-custom-secret-key-here
```

Response:
```json
{
  "deviceTrustScore": 87,
  "appsMonitored": 25,
  "threatsBlocked": 12,
  "dataUsageBytes": 536870912,
  "criticalThreats": 2,
  "highThreats": 3,
  "suspiciousConnections": 7
}
```

#### 2. Get Attack Surface Data
```
GET /api/v1/attack-surface
X-API-KEY: your-custom-secret-key-here
```

Returns 12 data points for the last hour (5-minute intervals).

#### 3. Get Live Network Connections
```
GET /api/v1/live-connections
X-API-KEY: your-custom-secret-key-here
```

Returns array of active network connections with threat status.

#### 4. Check IP Reputation
```
GET /api/v1/reputation?ip=8.8.8.8
X-API-KEY: your-custom-secret-key-here
```

Response:
```json
{
  "ipAddress": "8.8.8.8",
  "riskScore": 45,
  "category": "Safe",
  "countryCode": "US",
  "reportCount": 0,
  "lastSeen": "2025-12-27T00:00:00Z",
  "isVpn": false,
  "isProxy": false,
  "threatLevel": "SAFE"
}
```

#### 5. Report a Threat
```
POST /api/v1/report
Content-Type: application/json
X-API-KEY: your-custom-secret-key-here

{
  "appName": "SuspiciousApp",
  "targetIp": "192.168.1.100",
  "protocol": "TCP",
  "description": "Unusual traffic pattern",
  "deviceId": "device-uuid",
  "userSeverity": 75
}
```

#### 6. Get Reports for IP
```
GET /api/v1/reports/{ip}
X-API-KEY: your-custom-secret-key-here
```

#### 7. Get Recent Report Count
```
GET /api/v1/reports/ip/{ip}/count
X-API-KEY: your-custom-secret-key-here
```

## Security

### CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:*` - Development
- `http://192.168.*.*:*` - Local network (for mobile testing)
- `http://10.*.*.*:*` - Private networks
- `exp://*` - Expo Go app

**Production**: Update `CorsConfig.java` to whitelist only your production domains.

### API Key Authentication

All endpoints except `/actuator/health` require the `X-API-KEY` header.

Configure the key in `application.properties`:
```properties
app.security.api-key=your-secure-production-key
```

## Development

### H2 Database Console

Access at: `http://localhost:8080/h2-console`

- JDBC URL: `jdbc:h2:mem:pocketsiem_db`
- Username: `sa`
- Password: (empty)

### Logging

- Application logs: `INFO` level
- Package logs: `DEBUG` level for `com.hackathon.pocketSIEM`

### Hot Reload

Spring Boot DevTools is not included by default. Add to `pom.xml` if needed:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

## Production Deployment

### 1. Switch to MySQL

Update `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/pocketsiem
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

### 2. Build Production JAR

```bash
./gradlew clean build -x test
```

### 3. Run Production Server

```bash
java -jar build/libs/pocketsiem-1.0.0.jar
```

### 4. Environment Variables

```bash
export SERVER_PORT=8080
export API_KEY=your-production-api-key
export SPRING_DATASOURCE_URL=jdbc:mysql://db-host:3306/pocketsiem
export SPRING_DATASOURCE_USERNAME=db_user
export SPRING_DATASOURCE_PASSWORD=db_password
```

## Testing

### Run Tests

```bash
./gradlew test
```

### Manual Testing with curl

```bash
# Test health
curl http://localhost:8080/actuator/health

# Test authenticated endpoint
curl -H "X-API-KEY: your-custom-secret-key-here" \
     http://localhost:8080/api/v1/device-stats

# Test IP reputation
curl -H "X-API-KEY: your-custom-secret-key-here" \
     "http://localhost:8080/api/v1/reputation?ip=8.8.8.8"
```

## Troubleshooting

### Mobile App Can't Connect

1. **Check firewall**: Ensure port 8080 is open
2. **Use correct IP**: Replace `localhost` with your computer's local IP
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig` or `ip addr`
3. **Verify API key**: Must match frontend configuration
4. **Check CORS**: Ensure your IP range is allowed in `CorsConfig.java`

### CORS Errors

If you see CORS errors in the mobile app:
1. Check `CorsConfig.java` allows your IP range
2. Verify the backend is running
3. Check that `X-API-KEY` header is being sent

### Database Issues

- H2 resets on restart (by design for development)
- For persistent data, switch to MySQL
- Check `application.properties` for database configuration

## Project Structure

```
src/main/java/com/hackathon/pocketSIEM/
├── config/
│   ├── CorsConfig.java           # CORS configuration
│   └── SecurityConfig.java       # Spring Security setup
├── controller/
│   └── ThreatController.java     # REST API endpoints
├── dto/
│   ├── AttackSurfaceDataPoint.java
│   ├── DeviceStatsResponse.java
│   ├── NetworkConnectionResponse.java
│   ├── ThreatReportRequest.java
│   └── ThreatReputationResponse.java
├── exception/
│   ├── ErrorResponse.java
│   └── GlobalExceptionHandler.java
├── model/
│   └── ThreatReport.java         # JPA entity
├── repository/
│   └── ThreatReportRepository.java
├── security/
│   ├── ApiKeyFilter.java         # Authentication filter
│   └── ApiKeyValidator.java      # API key validation
├── service/
│   ├── ExternalThreatIntelligenceApi.java
│   ├── MockThreatIntelligenceApi.java
│   └── ThreatService.java        # Business logic
└── PocketSiemApplication.java    # Main application
```

## License

Private project

## Support

For issues or questions, refer to the main project README.
