package com.platform.repository;

import com.platform.entity.AgreementAmendment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgreementAmendmentRepository extends JpaRepository<AgreementAmendment, String> {
    List<AgreementAmendment> findByAgreementIdOrderByAmendmentNumberAsc(String agreementId);
    List<AgreementAmendment> findByAgreementIdAndStatus(String agreementId, AgreementAmendment.AmendmentStatus status);
}
