package com.platform.repository;

import com.platform.entity.AgreementResponsibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgreementResponsibilityRepository extends JpaRepository<AgreementResponsibility, String> {
    List<AgreementResponsibility> findByAgreementId(String agreementId);
    List<AgreementResponsibility> findByAgreementIdAndOwnerRole(String agreementId, AgreementResponsibility.OwnerRole ownerRole);
}
