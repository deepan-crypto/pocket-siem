package com.hackathon.pocketSIEM.service;

import com.hackathon.pocketSIEM.dto.ReputationResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
@Slf4j
public class ExternalThreatIntelligenceClient {
    
    private static final String[] CATEGORIES = {"Safe", "Low Risk", "Suspicious", "Botnet", "Malware"};
    private final Random random = new Random();
    
    /**
     * Mock call to external threat intelligence API (AbuseIPDB, VirusTotal, etc.)
     * TODO: Replace with actual API integration
     */
    public ReputationResponse checkReputation(String ip) {
        log.debug("Calling mock external threat intelligence API for IP: {}", ip);
        
        // Mock implementation: generate random risk score
        int riskScore = random.nextInt(101);
        String category = CATEGORIES[random.nextInt(CATEGORIES.length)];
        
        // Simulate specific threat patterns for testing
        if (ip.contains("185.220.101")) {
            riskScore = 85;
            category = "Malware";
        } else if (ip.contains("198.51.100")) {
            riskScore = 60;
            category = "Botnet";
        }
        
        return ReputationResponse.builder()
            .ip(ip)
            .riskScore(riskScore)
            .category(category)
            .isMalicious(riskScore >= 70)
            .source("MockExternalAPI")
            .build();
    }
}
