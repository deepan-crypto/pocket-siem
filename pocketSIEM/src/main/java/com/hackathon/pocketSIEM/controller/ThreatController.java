package com.hackathon.pocketSIEM.controller;

import com.hackathon.pocketSIEM.dto.*;
import com.hackathon.pocketSIEM.model.ThreatReport;
import com.hackathon.pocketSIEM.service.ThreatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class ThreatController {
    
    private final ThreatService threatService;
    
    /**
     * GET /api/v1/reputation?ip={ip_address}
     * Check reputation of an IP address
     */
    @GetMapping("/reputation")
    public ResponseEntity<ThreatReputationResponse> getIpReputation(
            @RequestParam(name = "ip") String ipAddress) {
        
        log.info("Reputation check request for IP: {}", ipAddress);
        if (!isValidIpAddress(ipAddress)) {
            return ResponseEntity.badRequest().build();
        }
        
        ThreatReputationResponse response = threatService.checkIpReputation(ipAddress);
        return ResponseEntity.ok(response);
    }
    
    /**
     * POST /api/v1/report
     * Submit a new threat report
     */
    @PostMapping("/report")
    public ResponseEntity<ThreatReport> reportThreat(
            @Valid @RequestBody ThreatReportRequest request) {
        
        log.info("Processing threat report for app: {}, IP: {}", 
                 request.getAppName(), request.getTargetIp());
        
        ThreatReport savedReport = threatService.reportThreat(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReport);
    }
    
    @GetMapping("/reports/{ip}")
    public ResponseEntity<List<ThreatReport>> getReportsForIp(@PathVariable String ip) {
        if (!isValidIpAddress(ip)) {
            return ResponseEntity.badRequest().build();
        }
        List<ThreatReport> reports = threatService.getReportsForIp(ip);
        return ResponseEntity.ok(reports);
    }
    
    @GetMapping("/reports/app/{appName}")
    public ResponseEntity<List<ThreatReport>> getReportsForApp(@PathVariable String appName) {
        List<ThreatReport> reports = threatService.getReportsForApp(appName);
        return ResponseEntity.ok(reports);
    }
    
    @GetMapping("/reports/ip/{ip}/count")
    public ResponseEntity<Integer> getRecentReportCount(@PathVariable String ip) {
        if (!isValidIpAddress(ip)) {
            return ResponseEntity.badRequest().build();
        }
        Integer count = threatService.getRecentReportCount(ip);
        return ResponseEntity.ok(count);
    }
    
    /**
     * GET /api/v1/device-stats
     * Get device security statistics for dashboard
     */
    @GetMapping("/device-stats")
    public ResponseEntity<DeviceStatsResponse> getDeviceStats() {
        log.info("Fetching device statistics");
        DeviceStatsResponse stats = threatService.getDeviceStats();
        return ResponseEntity.ok(stats);
    }
    
    /**
     * GET /api/v1/attack-surface
     * Get attack surface data for last hour chart
     */
    @GetMapping("/attack-surface")
    public ResponseEntity<List<AttackSurfaceDataPoint>> getAttackSurfaceData() {
        log.info("Fetching attack surface data");
        List<AttackSurfaceDataPoint> data = threatService.getAttackSurfaceData();
        return ResponseEntity.ok(data);
    }
    
    /**
     * GET /api/v1/live-connections
     * Get active network connections for live monitor
     */
    @GetMapping("/live-connections")
    public ResponseEntity<List<NetworkConnectionResponse>> getLiveConnections() {
        log.info("Fetching live network connections");
        List<NetworkConnectionResponse> connections = threatService.getLiveConnections();
        return ResponseEntity.ok(connections);
    }
    
    private boolean isValidIpAddress(String ip) {
        String ipv4Pattern = "^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$";
        String ipv6Pattern = "^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$";
        return ip.matches(ipv4Pattern) || ip.matches(ipv6Pattern);
    }
}
