package com.hackathon.pocketSIEM.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThreatReputationResponse {
    private String ipAddress;
    private Integer riskScore;
    private String category;
    private String countryCode;
    private Integer reportCount;
    private String lastSeen;
    private Boolean isVpn;
    private Boolean isProxy;
    private String threatLevel;
}
