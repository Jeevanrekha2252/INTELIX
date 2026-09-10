package com.platform.repository;

import com.platform.entity.RiskAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RiskAssessmentRepository extends JpaRepository<RiskAssessment, String> {
    List<RiskAssessment> findByProjectIdOrderByCalculatedAtDesc(String projectId);
    Optional<RiskAssessment> findTopByProjectIdAndTaskIdOrderByCalculatedAtDesc(String projectId, String taskId);
    Optional<RiskAssessment> findTopByProjectIdAndTaskIdIsNullOrderByCalculatedAtDesc(String projectId);
}
