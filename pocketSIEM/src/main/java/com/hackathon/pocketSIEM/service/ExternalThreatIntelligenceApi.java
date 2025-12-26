package com.hackathon.pocketSIEM.service;

import com.hackathon.pocketSIEM.dto.ThreatReputationResponse;

public interface ExternalThreatIntelligenceApi {
    ThreatReputationResponse checkIpReputation(String ipAddress);
}
