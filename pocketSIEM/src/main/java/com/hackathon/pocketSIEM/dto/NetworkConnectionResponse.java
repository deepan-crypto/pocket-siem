package com.hackathon.pocketSIEM.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NetworkConnectionResponse {
    private String appName;
    private String appPackage;
    private String destinationIp;
    private Integer port;
    private String protocol; // TCP, UDP
    private String status; // "SAFE", "SUSPICIOUS", "MALICIOUS"
    private Long dataTransferred; // bytes
    private Long timestamp;
}
