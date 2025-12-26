package com.hackathon.pocketSIEM.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThreatReportRequest {
    
    @NotBlank(message = "App name is required")
    private String appName;
    
    @NotBlank(message = "Target IP is required")
    @Pattern(
        regexp = "^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$|^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$",
        message = "Invalid IP address format"
    )
    private String targetIp;
    
    private String protocol;
    private String description;
    
    @NotBlank(message = "Device ID is required")
    private String deviceId;
    
    private Integer userSeverity;
}
