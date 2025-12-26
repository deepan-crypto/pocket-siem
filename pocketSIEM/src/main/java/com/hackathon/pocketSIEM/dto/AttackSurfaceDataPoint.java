package com.hackathon.pocketSIEM.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttackSurfaceDataPoint {
    private Long timestamp;
    private String timeLabel; // "10:00", "10:15", etc.
    private Integer threatCount; // Number of threats at this time
    private Long networkTraffic; // bytes
}
