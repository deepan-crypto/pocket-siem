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
                    .timestamp(timePoint.atZone(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli())
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

        // Mock data - replace with actual VPN service data
        return Arrays.asList(
                NetworkConnectionResponse.builder()
                        .appName("Chrome")
                        .appPackage("com.android.chrome")
                        .destinationIp("142.251.32.46")
                        .port(443)
                        .protocol("TCP")
                        .status("SAFE")
                        .dataTransferred(1024L * 512)
                        .timestamp(System.currentTimeMillis())
                        .build(),
                NetworkConnectionResponse.builder()
                        .appName("Gmail")
                        .appPackage("com.google.android.gm")
                        .destinationIp("172.217.14.213")
                        .port(993)
                        .protocol("TCP")
                        .status("SAFE")
                        .dataTransferred(1024L * 256)
                        .timestamp(System.currentTimeMillis() - 10000)
                        .build(),
                NetworkConnectionResponse.builder()
                        .appName("Unknown App")
                        .appPackage("com.suspicious.app")
                        .destinationIp("45.142.182.99")
                        .port(8080)
                        .protocol("TCP")
                        .status("SUSPICIOUS")
                        .dataTransferred(1024L * 100)
                        .timestamp(System.currentTimeMillis() - 20000)
                        .build(),
                NetworkConnectionResponse.builder()
                        .appName("Banking Trojan")
                        .appPackage("com.malicious.banking")
                        .destinationIp("103.145.45.67")
                        .port(443)
                        .protocol("TCP")
                        .status("MALICIOUS")
                        .dataTransferred(1024L * 50)
                        .timestamp(System.currentTimeMillis() - 30000)
                        .build());
    }
}
