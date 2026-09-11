package com.platform.repository;

import com.platform.entity.ProjectAgreement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectAgreementRepository extends JpaRepository<ProjectAgreement, String> {
    Optional<ProjectAgreement> findByProjectId(String projectId);
    boolean existsByProjectId(String projectId);
}
