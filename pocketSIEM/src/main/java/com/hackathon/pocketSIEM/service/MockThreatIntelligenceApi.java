package com.hackathon.pocketSIEM.service;

import com.hackathon.pocketSIEM.dto.ThreatReputationResponse;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Random;

@Component
public class MockThreatIntelligenceApi implements ExternalThreatIntelligenceApi {
    
    private static final Random random = new Random();
    private static final String[] CATEGORIES = {"Safe", "Suspicious", "Malicious", "Botnet", "C2", "Ransomware", "Spyware"};
    
    @Override
    public ThreatReputationResponse checkIpReputation(String ipAddress) {
        int riskScore = random.nextInt(101);
        String category = CATEGORIES[random.nextInt(CATEGORIES.length)];
        String threatLevel = getThreatLevel(riskScore);
        
        return ThreatReputationResponse.builder()
            .ipAddress(ipAddress)
            .riskScore(riskScore)
            .category(category)
            .countryCode(getRandomCountryCode())
            .reportCount(random.nextInt(500))
            .lastSeen(Instant.now().toString())
            .isVpn(random.nextBoolean())
            .isProxy(random.nextBoolean())
            .threatLevel(threatLevel)
            .build();
    }
    
    private String getThreatLevel(int riskScore) {
        if (riskScore >= 75) return "CRITICAL";
        if (riskScore >= 50) return "HIGH";
        if (riskScore >= 25) return "MEDIUM";
        if (riskScore >= 10) return "LOW";
        return "SAFE";
    }
    
    private String getRandomCountryCode() {
        String[] countries = {"US", "CN", "RU", "IN", "BR", "GB", "DE", "FR", "JP", "AU"};
        return countries[random.nextInt(countries.length)];
    }
}
