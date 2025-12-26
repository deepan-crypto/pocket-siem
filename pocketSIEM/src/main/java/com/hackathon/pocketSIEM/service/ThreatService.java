package com.hackathon.pocketSIEM.service;

import com.hackathon.pocketSIEM.dto.*;
import com.hackathon.pocketSIEM.model.ThreatReport;
import com.hackathon.pocketSIEM.repository.ThreatReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ThreatService {

        private final ExternalThreatIntelligenceApi threatIntelligenceApi;
        private final ThreatReportRepository threatReportRepository;

        /**
         * Check IP reputation with caching
         */
        @Cacheable(value = "ipReputation", key = "#ipAddress")
        public ThreatReputationResponse checkIpReputation(String ipAddress) {
                log.info("Checking reputation for IP: {}", ipAddress);
                return threatIntelligenceApi.checkIpReputation(ipAddress);
        }

        /**
         * Report a new threat
         */
        public ThreatReport reportThreat(ThreatReportRequest request) {
                log.info("Received threat report for app: {}, IP: {}", request.getAppName(), request.getTargetIp());

                ThreatReport report = ThreatReport.builder()
                                .appName(request.getAppName())
                                .targetIp(request.getTargetIp())
                                .reportedAt(LocalDateTime.now())
                                .protocol(request.getProtocol())
                                .description(request.getDescription())
                                .deviceId(request.getDeviceId())
                                .userSeverity(request.getUserSeverity() != null ? request.getUserSeverity() : 0)
                                .build();

                return threatReportRepository.save(report);
        }

        public List<ThreatReport> getReportsForIp(String ipAddress) {
                return threatReportRepository.findByTargetIpOrderByReportedAtDesc(ipAddress);
        }

        public Integer getRecentReportCount(String ipAddress) {
                LocalDateTime since = LocalDateTime.now().minusHours(24);
                return threatReportRepository.countReportsForIpSince(ipAddress, since);
        }

        public List<ThreatReport> getReportsForApp(String appName) {
                return threatReportRepository.findByAppName(appName);
        }

        /**
         * Calculate device trust score (0-100) based on recent threats
         */
        public DeviceStatsResponse getDeviceStats() {
                log.info("Calculating device statistics");

                LocalDateTime last24Hours = LocalDateTime.now().minusHours(24);

                // Use database query instead of in-memory filtering
                List<ThreatReport> recentThreats = threatReportRepository.findByReportedAtAfter(last24Hours);

                // Calculate trust score (100 - threat severity)
                int threatSeverity = recentThreats.stream()
                                .mapToInt(ThreatReport::getUserSeverity)
                                .sum();
                int trustScore = Math.max(0, 100 - (threatSeverity / Math.max(1, recentThreats.size())));

                long criticalCount = recentThreats.stream()
                                .filter(t -> t.getUserSeverity() >= 75).count();
                long highCount = recentThreats.stream()
                                .filter(t -> t.getUserSeverity() >= 50 && t.getUserSeverity() < 75).count();
                long suspiciousCount = recentThreats.stream()
                                .filter(t -> t.getUserSeverity() >= 25 && t.getUserSeverity() < 50).count();

                return DeviceStatsResponse.builder()
                                .deviceTrustScore(trustScore)
                                .appsMonitored(25) // Mock data - integrate with VPN service
                                .threatsBlocked((int) recentThreats.stream().count())
                                .dataUsageBytes(1024L * 1024L * 512L) // Mock: 512MB
                                .criticalThreats((int) criticalCount)
                                .highThreats((int) highCount)
                                .suspiciousConnections((int) suspiciousCount)
                                .build();
        }

        /**
         * Get attack surface data points for the last hour
         */
        public List<AttackSurfaceDataPoint> getAttackSurfaceData() {
                log.info("Generating attack surface data");

                List<AttackSurfaceDataPoint> dataPoints = new ArrayList<>();
                LocalDateTime now = LocalDateTime.now();
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");

                // Generate 12 data points for the last hour (5-minute intervals)
                for (int i = 11; i >= 0; i--) {
                        LocalDateTime timePoint = now.minusMinutes((long) i * 5);
                        LocalDateTime timeRangeStart = timePoint.minusMinutes(5);

                        // Use database query instead of loading all data into memory
                        List<ThreatReport> threats = threatReportRepository
                                        .findByReportedAtBetween(timeRangeStart, timePoint);
                        long threatCount = threats.size();

                        dataPoints.add(AttackSurfaceDataPoint.builder()
                                        .timestamp(timePoint.atZone(java.time.ZoneId.systemDefault()).toInstant()
                                                        .toEpochMilli())
                                        .timeLabel(timePoint.format(formatter))
                                        .threatCount((int) threatCount)
                                        .networkTraffic((long) new Random().nextInt(10 * 1024 * 1024)) // Mock
                                        .build());
                }

                return dataPoints;
        }

        /**
         * Get active live network connections (mock data - integrate with VPN service)
         */
        public List<NetworkConnectionResponse> getLiveConnections() {
                log.info("Fetching live network connections");

                // Mock data - expanded to show more realistic network activity
                long now = System.currentTimeMillis();

                return Arrays.asList(
                                // Safe connections
                                NetworkConnectionResponse.builder()
                                                .appName("Chrome")
                                                .appPackage("com.android.chrome")
                                                .destinationIp("142.251.32.46")
                                                .port(443)
                                                .protocol("TCP")
                                                .status("SAFE")
                                                .dataTransferred(1024L * 512)
                                                .timestamp(now - 1000)
                                                .build(),
                                NetworkConnectionResponse.builder()
                                                .appName("Gmail")
                                                .appPackage("com.google.android.gm")
                                                .destinationIp("172.217.14.213")
                                                .port(993)
                                                .protocol("TCP")
                                                .status("SAFE")
                                                .dataTransferred(1024L * 256)
                                                .timestamp(now - 9000)
                                                .build(),
                                NetworkConnectionResponse.builder()
                                                .appName("WhatsApp")
                                                .appPackage("com.whatsapp")
                                                .destinationIp("157.240.241.61")
                                                .port(443)
                                                .protocol("TCP")
                                                .status("SAFE")
                                                .dataTransferred(1024L * 128)
                                                .timestamp(now - 15000)
                                                .build(),
                                NetworkConnectionResponse.builder()
                                                .appName("Instagram")
                                                .appPackage("com.instagram.android")
                                                .destinationIp("157.240.22.174")
                                                .port(443)
                                                .protocol("TCP")
                                                .status("SAFE")
                                                .dataTransferred(1024L * 1024 * 2)
                                                .timestamp(now - 22000)
                                                .build(),
                                NetworkConnectionResponse.builder()
                                                .appName("Spotify")
                                                .appPackage("com.spotify.music")
                                                .destinationIp("35.186.224.25")
                                                .port(443)
                                                .protocol("TCP")
                                                .status("SAFE")
                                                .dataTransferred(1024L * 1024 * 8)
                                                .timestamp(now - 30000)
                                                .build(),
                                NetworkConnectionResponse.builder()
                                                .appName("YouTube")
                                                .appPackage("com.google.android.youtube")
                                                .destinationIp("142.250.185.78")
                                                .port(443)
                                                .protocol("TCP")
                                                .status("SAFE")
                                                .dataTransferred(1024L * 1024 * 15)
                                                .timestamp(now - 45000)
                                                .build(),
                                NetworkConnectionResponse.builder()
                                                .appName("Netflix")
                                                .appPackage("com.netflix.mediaclient")
                                                .destinationIp("54.192.36.89")
                                                .port(443)
                                                .protocol("TCP")
                                                .status("SAFE")
                                                .dataTransferred(1024L * 1024 * 25)
                                                .timestamp(now - 60000)
                                                .build(),
                                NetworkConnectionResponse.builder()
                                                .appName("Google Maps")
                                                .appPackage("com.google.android.apps.maps")
                                                .destinationIp("142.251.33.110")
                                                .port(443)
                                                .protocol("TCP")
                                                .status("SAFE")
                                                .dataTransferred(1024L * 768)
                                                .timestamp(now - 75000)
                                                .build(),
                                NetworkConnectionResponse.builder()
                                                .appName("Telegram")
                                                .appPackage("org.telegram.messenger")
                                                .destinationIp("149.154.167.51")
                                                .port(443)
                                                .protocol("TCP")
                                                .status("SAFE")
                                                .dataTransferred(1024L * 384)
                                                .timestamp(now - 90000)
                                                .build(),
                                NetworkConnectionResponse.builder()
                                                .appName("Twitter")
                                                .appPackage("com.twitter.android")
                                                .destinationIp("104.244.42.193")
                                                .port(443)
                                                .protocol("TCP")
                                                .status("SAFE")
                                                .dataTransferred(1024L * 512)
                                                .timestamp(now - 105000)
                                                .build(),

                                // Suspicious connections
                                NetworkConnectionResponse.builder()
                                                .appName("Unknown App")
                                                .appPackage("com.suspicious.app")
                                                .destinationIp("45.142.182.99")
                                                .port(8080)
                                                .protocol("TCP")
                                                .status("SUSPICIOUS")
                                                .dataTransferred(1024L * 100)
                                                .timestamp(now - 18000)
                                                .build(),
                                NetworkConnectionResponse.builder()
                                                .appName("Background Service")
                                                .appPackage("com.unknown.service")
                                                .destinationIp("185.220.101.45")
                                                .port(9050)
                                                .protocol("TCP")
                                                .status("SUSPICIOUS")
                                                .dataTransferred(1024L * 64)
                                                .timestamp(now - 120000)
                                                .build(),
                                NetworkConnectionResponse.builder()
                                                .appName("Ad Network")
                                                .appPackage("com.adnetwork.sdk")
                                                .destinationIp("23.236.62.147")
                                                .port(80)
                                                .protocol("TCP")
                                                .status("SUSPICIOUS")
                                                .dataTransferred(1024L * 32)
                                                .timestamp(now - 135000)
                                                .build(),

                                // Malicious connections
                                NetworkConnectionResponse.builder()
                                                .appName("Banking Trojan")
                                                .appPackage("com.malicious.banking")
                                                .destinationIp("103.145.45.67")
                                                .port(443)
                                                .protocol("TCP")
                                                .status("MALICIOUS")
                                                .dataTransferred(1024L * 50)
                                                .timestamp(now - 28000)
                                                .build(),
                                NetworkConnectionResponse.builder()
                                                .appName("Data Exfiltrator")
                                                .appPackage("com.suspicious.tracker")
                                                .destinationIp("89.248.174.42")
                                                .port(4444)
                                                .protocol("TCP")
                                                .status("MALICIOUS")
                                                .dataTransferred(1024L * 1024 * 3)
                                                .timestamp(now - 150000)
                                                .build(),
                                NetworkConnectionResponse.builder()
                                                .appName("C2 Client")
                                                .appPackage("com.malware.c2")
                                                .destinationIp("198.51.100.42")
                                                .port(53)
                                                .protocol("UDP")
                                                .status("MALICIOUS")
                                                .dataTransferred(1024L * 16)
                                                .timestamp(now - 180000)
                                                .build());
        }
}
