package com.hackathon.pocketSIEM.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "threat_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThreatReport {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String appName;
    
    @Column(nullable = false)
    private String targetIp;
    
    @Column(nullable = false)
    private LocalDateTime reportedAt;
    
    @Column(length = 50)
    private String protocol;
    
    @Column(length = 500)
    private String description;
    
    @Column(nullable = false)
    private String deviceId;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer userSeverity = 0;
    
    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
