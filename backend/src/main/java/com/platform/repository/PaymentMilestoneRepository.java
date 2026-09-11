package com.platform.repository;

import com.platform.entity.PaymentMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentMilestoneRepository extends JpaRepository<PaymentMilestone, String> {
    List<PaymentMilestone> findByAgreementIdOrderByCreatedAtAsc(String agreementId);
    List<PaymentMilestone> findByAgreementIdAndStatus(String agreementId, PaymentMilestone.PaymentStatus status);
}
