package com.hackathon.pocketSIEM.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReputationResponse {
    private String ip;
    private Integer riskScore; // 0-100
    private String category; // "Safe", "Suspicious", "Botnet", "Malware", etc.
    private Boolean isMalicious;
    private String source;
}
