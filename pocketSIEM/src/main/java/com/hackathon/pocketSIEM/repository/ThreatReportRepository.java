package com.hackathon.pocketSIEM.repository;

import com.hackathon.pocketSIEM.model.ThreatReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ThreatReportRepository extends JpaRepository<ThreatReport, Long> {
    List<ThreatReport> findByTargetIp(String targetIp);
    List<ThreatReport> findByAppName(String appName);
    
    @Query("SELECT COUNT(t) FROM ThreatReport t WHERE t.targetIp = :ip AND t.reportedAt >= :since")
    Integer countReportsForIpSince(@Param("ip") String ip, @Param("since") LocalDateTime since);
    
    List<ThreatReport> findByTargetIpOrderByReportedAtDesc(String targetIp);
}
