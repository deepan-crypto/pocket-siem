package com.hackathon.pocketSIEM.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceStatsResponse {
    private Integer deviceTrustScore; // 0-100
    private Integer appsMonitored;
    private Integer threatsBlocked;
    private Long dataUsageBytes;
    private Integer criticalThreats;
    private Integer highThreats;
    private Integer suspiciousConnections;
}
