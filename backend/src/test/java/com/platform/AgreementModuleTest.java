package com.platform;

import com.platform.dto.AgreementDtos.*;
import com.platform.entity.*;
import com.platform.repository.*;
import com.platform.service.AgreementService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@org.springframework.test.context.ActiveProfiles("dev")
public class AgreementModuleTest {

    @Autowired
    private AgreementService agreementService;

    @Autowired
    private ProjectAgreementRepository agreementRepository;

    @Autowired
    private PaymentMilestoneRepository paymentMilestoneRepository;

    @Autowired
    private AgreementAmendmentRepository amendmentRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    private User manager;
    private User client;
    private User developer;
    private Project project;

    @BeforeEach
    void setUp() {
        manager = userRepository.findByEmail("manager@demo.com").orElse(null);
        client = userRepository.findByEmail("client@demo.com").orElse(null);
        developer = userRepository.findByEmail("developer@demo.com").orElse(null);
        project = projectRepository.findAll().stream().findFirst().orElse(null);
    }

    @Test
    void testAgreementBaselineAndAccess() {
        assertNotNull(project, "Project must exist");
        Optional<AgreementDetailResponse> agOpt = agreementService.getAgreementByProjectId(project.getId());

        assertTrue(agOpt.isPresent(), "Agreement should be seeded for demo project");
        AgreementDetailResponse agreement = agOpt.get();

        assertEquals("LOCKED", agreement.status);
        assertNotNull(agreement.totalValue);
        assertTrue(agreement.totalValue.compareTo(BigDecimal.ZERO) > 0);
        assertEquals(4, agreement.verifiedBlockingDelayDays);
        assertNotNull(agreement.delayAttribution);
        assertFalse(agreement.paymentMilestones.isEmpty());
        assertFalse(agreement.responsibilities.isEmpty());
    }

    @Test
    void testPaymentMilestoneTriggerEvaluation() {
        assertNotNull(project);
        agreementService.checkAndTriggerPayments(project.getId(), 50, null);

        List<PaymentMilestone> triggered = paymentMilestoneRepository.findByAgreementIdAndStatus(
                "ag-scms-001", PaymentMilestone.PaymentStatus.TRIGGERED);

        assertFalse(triggered.isEmpty(), "At 50% progress, payment milestone 2 should be triggered");
        assertTrue(triggered.stream().anyMatch(p -> p.getTriggerValue() != null && p.getTriggerValue() <= 50.0));
    }

    @Test
    void testAmendmentCreationAndApproval() {
        assertNotNull(manager);
        assertNotNull(client);

        AmendmentCreateRequest req = new AmendmentCreateRequest();
        req.title = "Add Biometric Integration Module";
        req.category = AgreementAmendment.AmendmentCategory.SCOPE;
        req.reason = "Client requested biometric facial authentication hardware support";
        req.oldValue = "Excluded Modules: Biometric sensors";
        req.newValue = "Included Modules: Biometric facial recognition gateway";
        req.effectiveDate = LocalDate.now();

        AgreementDetailResponse created = agreementService.requestAmendment("ag-scms-001", req, client);
        assertNotNull(created);

        List<AgreementAmendment> pending = amendmentRepository.findByAgreementIdAndStatus(
                "ag-scms-001", AgreementAmendment.AmendmentStatus.REQUESTED);
        assertFalse(pending.isEmpty());

        AgreementAmendment target = pending.get(0);
        AmendmentReviewRequest reviewReq = new AmendmentReviewRequest();
        reviewReq.decision = "APPROVED";
        reviewReq.comments = "Approved by Project Manager";

        AgreementDetailResponse approved = agreementService.reviewAmendment(target.getId(), reviewReq, manager);
        assertNotNull(approved);

        AgreementAmendment updated = amendmentRepository.findById(target.getId()).orElse(null);
        assertNotNull(updated);
        assertEquals(AgreementAmendment.AmendmentStatus.APPROVED, updated.getStatus());
    }
}
