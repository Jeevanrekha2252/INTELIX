package com.platform.repository;

import com.platform.entity.AgreementMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgreementMilestoneRepository extends JpaRepository<AgreementMilestone, String> {
    List<AgreementMilestone> findByAgreementId(String agreementId);
    void deleteByAgreementId(String agreementId);
}
