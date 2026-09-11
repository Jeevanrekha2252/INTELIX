package com.platform.service;

import com.platform.dto.AgreementDtos.*;
import com.platform.entity.*;
import com.platform.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class AgreementService {

    private final ProjectAgreementRepository agreementRepository;
    private final AgreementMilestoneRepository agreementMilestoneRepository;
    private final PaymentMilestoneRepository paymentMilestoneRepository;
    private final AgreementResponsibilityRepository responsibilityRepository;
    private final AgreementAmendmentRepository amendmentRepository;
    private final ProjectRepository projectRepository;
    private final MilestoneRepository milestoneRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public AgreementService(ProjectAgreementRepository agreementRepository,
                            AgreementMilestoneRepository agreementMilestoneRepository,
                            PaymentMilestoneRepository paymentMilestoneRepository,
                            AgreementResponsibilityRepository responsibilityRepository,
                            AgreementAmendmentRepository amendmentRepository,
                            ProjectRepository projectRepository,
                            MilestoneRepository milestoneRepository,
                            UserRepository userRepository,
                            NotificationService notificationService) {
        this.agreementRepository = agreementRepository;
        this.agreementMilestoneRepository = agreementMilestoneRepository;
        this.paymentMilestoneRepository = paymentMilestoneRepository;
        this.responsibilityRepository = responsibilityRepository;
        this.amendmentRepository = amendmentRepository;
        this.projectRepository = projectRepository;
        this.milestoneRepository = milestoneRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public Optional<AgreementDetailResponse> getAgreementByProjectId(String projectId) {
        return agreementRepository.findByProjectId(projectId).map(this::mapToDetailResponse);
    }

    @Transactional(readOnly = true)
    public Optional<AgreementDetailResponse> getAgreementById(String id) {
        return agreementRepository.findById(id).map(this::mapToDetailResponse);
    }

    @Transactional
    public AgreementDetailResponse createOrUpdateDraft(AgreementCreateRequest req, User currentUser) {
        Project project = projectRepository.findById(req.projectId)
                .orElseThrow(() -> new RuntimeException("Project not found: " + req.projectId));

        ProjectAgreement agreement = agreementRepository.findByProjectId(req.projectId)
                .orElse(new ProjectAgreement());

        if (agreement.getId() == null) {
            agreement.setId("ag-" + UUID.randomUUID().toString().substring(0, 8));
            agreement.setProject(project);
            agreement.setCreatedAt(LocalDateTime.now());
            agreement.setCreatedBy(currentUser);
        }

        agreement.setTotalValue(req.totalValue != null ? req.totalValue : (project.getBudget() != null ? BigDecimal.valueOf(project.getBudget()) : BigDecimal.ZERO));
        agreement.setCurrency(req.currency != null ? req.currency : "USD");
        agreement.setBaselineStartDate(req.baselineStartDate != null ? req.baselineStartDate : (project.getStartDate() != null ? project.getStartDate() : LocalDate.now()));
        agreement.setBaselineEndDate(req.baselineEndDate != null ? req.baselineEndDate : (project.getEndDate() != null ? project.getEndDate() : LocalDate.now().plusMonths(3)));
        agreement.setCurrentForecastEndDate(req.currentForecastEndDate != null ? req.currentForecastEndDate : agreement.getBaselineEndDate());
        agreement.setVerifiedBlockingDelayDays(req.verifiedBlockingDelayDays != null ? req.verifiedBlockingDelayDays : 0);
        agreement.setDelayAttribution(req.delayAttribution != null ? req.delayAttribution : "None");
        agreement.setReviewPeriodDays(req.reviewPeriodDays != null ? req.reviewPeriodDays : 5);
        agreement.setApprovalPeriodDays(req.approvalPeriodDays != null ? req.approvalPeriodDays : 3);
        agreement.setScopeObjective(req.scopeObjective);
        agreement.setIncludedModules(req.includedModules);
        agreement.setExcludedModules(req.excludedModules);
        agreement.setAssumptions(req.assumptions);
        agreement.setAgreedDeliverables(req.agreedDeliverables);
        agreement.setStatus(ProjectAgreement.AgreementStatus.DRAFT);
        agreement.setUpdatedAt(LocalDateTime.now());

        agreement = agreementRepository.save(agreement);

        // Update milestones if provided
        if (req.milestones != null && !req.milestones.isEmpty()) {
            agreementMilestoneRepository.deleteByAgreementId(agreement.getId());
            for (AgreementMilestoneItem item : req.milestones) {
                AgreementMilestone am = new AgreementMilestone();
                am.setId("agm-" + UUID.randomUUID().toString().substring(0, 8));
                am.setAgreement(agreement);
                am.setName(item.name != null ? item.name : "Agreed Milestone");
                am.setDescription(item.description);
                am.setTargetDate(item.targetDate != null ? item.targetDate : agreement.getBaselineEndDate());
                am.setDeliverables(item.deliverables);
                am.setCompletionRequirement(item.completionRequirement);
                am.setAcceptanceCriteria(item.acceptanceCriteria);
                if (item.milestoneId != null) {
                    milestoneRepository.findById(item.milestoneId).ifPresent(am::setMilestone);
                }
                agreementMilestoneRepository.save(am);
            }
        }

        // Update payment schedule if provided
        if (req.paymentSchedule != null && !req.paymentSchedule.isEmpty()) {
            paymentMilestoneRepository.deleteAll(paymentMilestoneRepository.findByAgreementIdOrderByCreatedAtAsc(agreement.getId()));
            for (PaymentScheduleItem item : req.paymentSchedule) {
                PaymentMilestone pm = new PaymentMilestone();
                pm.setId("pay-" + UUID.randomUUID().toString().substring(0, 8));
                pm.setAgreement(agreement);
                pm.setTitle(item.title != null ? item.title : "Payment Stage");
                pm.setTriggerType(item.triggerType != null ? item.triggerType : PaymentMilestone.TriggerType.PERCENTAGE);
                pm.setTriggerValue(item.triggerValue);
                pm.setTargetDate(item.targetDate != null ? item.targetDate : agreement.getBaselineEndDate());
                pm.setPaymentPercentage(item.paymentPercentage != null ? item.paymentPercentage : BigDecimal.ZERO);
                pm.setPaymentAmount(item.paymentAmount != null ? item.paymentAmount : BigDecimal.ZERO);
                pm.setStatus(PaymentMilestone.PaymentStatus.PENDING);
                paymentMilestoneRepository.save(pm);
            }
        }

        // Update responsibilities if provided
        if (req.responsibilities != null && !req.responsibilities.isEmpty()) {
            responsibilityRepository.deleteAll(responsibilityRepository.findByAgreementId(agreement.getId()));
            for (ResponsibilityItem item : req.responsibilities) {
                AgreementResponsibility resp = new AgreementResponsibility();
                resp.setId("resp-" + UUID.randomUUID().toString().substring(0, 8));
                resp.setAgreement(agreement);
                resp.setOwnerRole(item.ownerRole != null ? item.ownerRole : AgreementResponsibility.OwnerRole.CLIENT);
                resp.setTitle(item.title);
                resp.setDescription(item.description);
                resp.setDueDate(item.dueDate);
                resp.setStatus(item.status != null ? item.status : AgreementResponsibility.ResponsibilityStatus.AGREED);
                responsibilityRepository.save(resp);
            }
        }

        return mapToDetailResponse(agreement);
    }

    @Transactional
    public AgreementDetailResponse submitToClient(String agreementId, User currentUser) {
        ProjectAgreement agreement = agreementRepository.findById(agreementId)
                .orElseThrow(() -> new RuntimeException("Agreement not found: " + agreementId));

        agreement.setStatus(ProjectAgreement.AgreementStatus.SENT_TO_CLIENT);
        agreement.setApprovedByManager(currentUser);
        agreement.setUpdatedAt(LocalDateTime.now());
        agreement = agreementRepository.save(agreement);

        // Notify client in real time
        notificationService.sendToClient(
                agreement.getProject().getId(),
                NotificationType.AGREEMENT_SUBMITTED,
                "Project Agreement Submitted for Review",
                String.format("Manager %s has submitted the project baseline terms and agreement for %s.",
                        currentUser.getFullName(), agreement.getProject().getName()),
                Notification.Severity.HIGH,
                "AGREEMENT",
                agreement.getId(),
                "/projects/" + agreement.getProject().getId() + "/agreement",
                null
        );

        return mapToDetailResponse(agreement);
    }

    @Transactional
    public AgreementDetailResponse clientDecision(String agreementId, AgreementReviewRequest req, User currentUser) {
        ProjectAgreement agreement = agreementRepository.findById(agreementId)
                .orElseThrow(() -> new RuntimeException("Agreement not found: " + agreementId));

        boolean isApproved = "APPROVED".equalsIgnoreCase(req.decision) || "APPROVE".equalsIgnoreCase(req.action);
        String notes = req.comments != null ? req.comments : req.reviewNotes;

        if (isApproved) {
            agreement.setStatus(ProjectAgreement.AgreementStatus.CLIENT_APPROVED);
            agreement.setApprovedByClient(currentUser);
            agreement.setApprovedAt(LocalDateTime.now());
            agreement.setEffectiveDate(LocalDate.now());

            notificationService.sendToProjectManagers(
                    agreement.getProject().getId(),
                    NotificationType.AGREEMENT_APPROVED,
                    "Project Agreement Approved by Client",
                    String.format("Client %s has approved the project terms and baseline agreement for %s.",
                            currentUser.getFullName(), agreement.getProject().getName()),
                    Notification.Severity.HIGH,
                    "AGREEMENT",
                    agreement.getId(),
                    "/projects/" + agreement.getProject().getId() + "/agreement",
                    null
            );
        } else {
            agreement.setStatus(ProjectAgreement.AgreementStatus.CHANGES_REQUESTED);
            notificationService.sendToProjectManagers(
                    agreement.getProject().getId(),
                    NotificationType.AGREEMENT_CHANGES_REQUESTED,
                    "Changes Requested on Project Agreement",
                    String.format("Client %s requested revisions: %s",
                            currentUser.getFullName(), notes != null ? notes : "Please review scope and terms."),
                    Notification.Severity.MEDIUM,
                    "AGREEMENT",
                    agreement.getId(),
                    "/projects/" + agreement.getProject().getId() + "/agreement",
                    null
            );
        }

        agreement.setUpdatedAt(LocalDateTime.now());
        return mapToDetailResponse(agreementRepository.save(agreement));
    }

    @Transactional
    public AgreementDetailResponse lockAgreement(String agreementId, User currentUser) {
        ProjectAgreement agreement = agreementRepository.findById(agreementId)
                .orElseThrow(() -> new RuntimeException("Agreement not found: " + agreementId));

        agreement.setStatus(ProjectAgreement.AgreementStatus.LOCKED);
        agreement.setUpdatedAt(LocalDateTime.now());

        // Activate project status for task execution
        Project project = agreement.getProject();
        project.setStatus(Project.ProjectStatus.ACTIVE);
        projectRepository.save(project);

        agreement = agreementRepository.save(agreement);

        notificationService.sendToProjectManagers(
                project.getId(),
                NotificationType.AGREEMENT_LOCKED,
                "Project Baseline Sealed & Activated",
                String.format("Project %s is now officially LOCKED and ACTIVE for task execution.", project.getName()),
                Notification.Severity.INFO,
                "AGREEMENT",
                agreement.getId(),
                "/projects/" + project.getId() + "/agreement",
                null
        );

        notificationService.sendToClient(
                project.getId(),
                NotificationType.AGREEMENT_LOCKED,
                "Project Agreement Sealed & Activated",
                String.format("Project %s baseline terms are locked and development is officially active.", project.getName()),
                Notification.Severity.INFO,
                "AGREEMENT",
                agreement.getId(),
                "/projects/" + project.getId() + "/agreement",
                null
        );

        return mapToDetailResponse(agreement);
    }

    @Transactional
    public void checkAndTriggerPayments(String projectId, int currentProgress, String completedMilestoneId) {
        Optional<ProjectAgreement> agreementOpt = agreementRepository.findByProjectId(projectId);
        if (agreementOpt.isEmpty()) return;

        ProjectAgreement agreement = agreementOpt.get();
        List<PaymentMilestone> paymentMilestones = paymentMilestoneRepository.findByAgreementIdAndStatus(
                agreement.getId(), PaymentMilestone.PaymentStatus.PENDING);

        for (PaymentMilestone pm : paymentMilestones) {
            boolean shouldTrigger = false;

            if (pm.getTriggerType() == PaymentMilestone.TriggerType.PERCENTAGE) {
                if (pm.getTriggerValue() != null && currentProgress >= pm.getTriggerValue()) {
                    shouldTrigger = true;
                }
            } else if (pm.getTriggerType() == PaymentMilestone.TriggerType.MILESTONE_COMPLETION) {
                if (completedMilestoneId != null && pm.getMilestone() != null &&
                        completedMilestoneId.equals(pm.getMilestone().getId())) {
                    shouldTrigger = true;
                }
            }

            if (shouldTrigger) {
                pm.setStatus(PaymentMilestone.PaymentStatus.TRIGGERED);
                pm.setTriggeredAt(LocalDateTime.now());
                paymentMilestoneRepository.save(pm);

                // Send real-time notification to Manager and Client ONLY
                String msg = String.format("Payment threshold reached (%s). Commercial payment of %s $%,.2f is now triggered.",
                        pm.getTitle(), agreement.getCurrency(), pm.getPaymentAmount());

                notificationService.sendToProjectManagers(
                        projectId,
                        NotificationType.PAYMENT_TRIGGERED,
                        "Payment Milestone Triggered",
                        msg,
                        Notification.Severity.HIGH,
                        "PAYMENT",
                        pm.getId(),
                        "/projects/" + projectId + "/agreement",
                        null
                );

                notificationService.sendToClient(
                        projectId,
                        NotificationType.PAYMENT_TRIGGERED,
                        "Payment Milestone Due",
                        msg,
                        Notification.Severity.HIGH,
                        "PAYMENT",
                        pm.getId(),
                        "/projects/" + projectId + "/agreement",
                        null
                );
            }
        }
    }

    @Transactional
    public AgreementDetailResponse recordPayment(String paymentMilestoneId, User currentUser) {
        PaymentMilestone pm = paymentMilestoneRepository.findById(paymentMilestoneId)
                .orElseThrow(() -> new RuntimeException("Payment milestone not found: " + paymentMilestoneId));

        pm.setStatus(PaymentMilestone.PaymentStatus.PAID);
        pm.setPaidAt(LocalDateTime.now());
        paymentMilestoneRepository.save(pm);

        ProjectAgreement agreement = pm.getAgreement();

        notificationService.sendToProjectManagers(
                agreement.getProject().getId(),
                NotificationType.PAYMENT_RECEIVED,
                "Payment Confirmed",
                String.format("Payment for '%s' ($%,.2f) has been confirmed.", pm.getTitle(), pm.getPaymentAmount()),
                Notification.Severity.INFO,
                "PAYMENT",
                pm.getId(),
                "/projects/" + agreement.getProject().getId() + "/agreement",
                null
        );

        notificationService.sendToClient(
                agreement.getProject().getId(),
                NotificationType.PAYMENT_RECEIVED,
                "Payment Receipt Acknowledged",
                String.format("Payment receipt for '%s' ($%,.2f) confirmed.", pm.getTitle(), pm.getPaymentAmount()),
                Notification.Severity.INFO,
                "PAYMENT",
                pm.getId(),
                "/projects/" + agreement.getProject().getId() + "/agreement",
                null
        );

        return mapToDetailResponse(agreement);
    }

    @Transactional
    public AgreementDetailResponse requestAmendment(String agreementId, AmendmentCreateRequest req, User currentUser) {
        ProjectAgreement agreement = agreementRepository.findById(agreementId)
                .orElseThrow(() -> new RuntimeException("Agreement not found: " + agreementId));

        List<AgreementAmendment> existing = amendmentRepository.findByAgreementIdOrderByAmendmentNumberAsc(agreementId);
        int nextNum = existing.size() + 1;

        String title = req.title != null ? req.title : (req.fieldName != null ? req.fieldName : "Amendment #" + nextNum);
        AgreementAmendment.AmendmentCategory category = req.category;
        if (category == null && req.changeCategory != null) {
            try {
                category = AgreementAmendment.AmendmentCategory.valueOf(req.changeCategory.toUpperCase());
            } catch (Exception ignored) {}
        }

        AgreementAmendment amendment = new AgreementAmendment();
        amendment.setId("amend-" + UUID.randomUUID().toString().substring(0, 8));
        amendment.setAgreement(agreement);
        amendment.setAmendmentNumber(nextNum);
        amendment.setTitle(title);
        amendment.setCategory(category != null ? category : AgreementAmendment.AmendmentCategory.SCOPE);
        amendment.setReason(req.reason);
        amendment.setOldValue(req.oldValue != null ? req.oldValue : "N/A");
        amendment.setNewValue(req.newValue != null ? req.newValue : "N/A");
        amendment.setRequestedBy(currentUser);
        amendment.setStatus(AgreementAmendment.AmendmentStatus.REQUESTED);
        amendment.setEffectiveDate(req.effectiveDate != null ? req.effectiveDate : LocalDate.now());
        amendment.setCreatedAt(LocalDateTime.now());

        amendmentRepository.save(amendment);

        // Notify counterpart
        if (currentUser.getRole() == Role.CLIENT) {
            notificationService.sendToProjectManagers(
                    agreement.getProject().getId(),
                    NotificationType.AMENDMENT_REQUESTED,
                    "Baseline Amendment Requested by Client",
                    String.format("Client requested Amendment #%d: %s", nextNum, title),
                    Notification.Severity.HIGH,
                    "AMENDMENT",
                    amendment.getId(),
                    "/projects/" + agreement.getProject().getId() + "/agreement",
                    null
            );
        } else {
            notificationService.sendToClient(
                    agreement.getProject().getId(),
                    NotificationType.AMENDMENT_REQUESTED,
                    "Baseline Amendment Proposed by Manager",
                    String.format("Manager proposed Amendment #%d: %s", nextNum, title),
                    Notification.Severity.HIGH,
                    "AMENDMENT",
                    amendment.getId(),
                    "/projects/" + agreement.getProject().getId() + "/agreement",
                    null
            );
        }

        return mapToDetailResponse(agreement);
    }

    @Transactional
    public AgreementDetailResponse reviewAmendment(String amendmentId, AmendmentReviewRequest req, User currentUser) {
        AgreementAmendment amendment = amendmentRepository.findById(amendmentId)
                .orElseThrow(() -> new RuntimeException("Amendment not found: " + amendmentId));

        ProjectAgreement agreement = amendment.getAgreement();

        boolean isApproved = "APPROVED".equalsIgnoreCase(req.decision) ||
                "APPROVE".equalsIgnoreCase(req.action) ||
                Boolean.TRUE.equals(req.approved);

        if (isApproved) {
            amendment.setStatus(AgreementAmendment.AmendmentStatus.APPROVED);
            amendment.setReviewedBy(currentUser);
            amendment.setApprovedAt(LocalDateTime.now());
            amendmentRepository.save(amendment);

            // Apply amendment to baseline where appropriate
            if (amendment.getCategory() == AgreementAmendment.AmendmentCategory.DEADLINE) {
                agreement.setDelayAttribution(amendment.getReason());
            }

            agreement.setVersion(agreement.getVersion() + 1);
            agreement.setUpdatedAt(LocalDateTime.now());
            agreement = agreementRepository.save(agreement);

            notificationService.sendToProjectManagers(
                    agreement.getProject().getId(),
                    NotificationType.AMENDMENT_APPROVED,
                    "Amendment Approved",
                    String.format("Amendment #%d (%s) was approved and integrated into baseline v%d.",
                            amendment.getAmendmentNumber(), amendment.getTitle(), agreement.getVersion()),
                    Notification.Severity.HIGH,
                    "AMENDMENT",
                    amendment.getId(),
                    "/projects/" + agreement.getProject().getId() + "/agreement",
                    null
            );

            notificationService.sendToClient(
                    agreement.getProject().getId(),
                    NotificationType.AMENDMENT_APPROVED,
                    "Amendment Enacted into Baseline",
                    String.format("Amendment #%d (%s) enacted into active baseline v%d.",
                            amendment.getAmendmentNumber(), amendment.getTitle(), agreement.getVersion()),
                    Notification.Severity.INFO,
                    "AMENDMENT",
                    amendment.getId(),
                    "/projects/" + agreement.getProject().getId() + "/agreement",
                    null
            );
        } else {
            amendment.setStatus(AgreementAmendment.AmendmentStatus.REJECTED);
            amendment.setReviewedBy(currentUser);
            amendmentRepository.save(amendment);
        }

        return mapToDetailResponse(agreement);
    }

    private AgreementDetailResponse mapToDetailResponse(ProjectAgreement agreement) {
        AgreementDetailResponse res = new AgreementDetailResponse();
        res.id = agreement.getId();
        res.projectId = agreement.getProject().getId();
        res.projectKey = agreement.getProject().getProjectKey();
        res.projectName = agreement.getProject().getName();
        res.version = agreement.getVersion();
        res.status = agreement.getStatus().name();
        res.totalValue = agreement.getTotalValue();
        res.currency = agreement.getCurrency();
        res.effectiveDate = agreement.getEffectiveDate();
        res.baselineStartDate = agreement.getBaselineStartDate();
        res.baselineEndDate = agreement.getBaselineEndDate();
        res.currentForecastEndDate = agreement.getCurrentForecastEndDate();
        res.verifiedBlockingDelayDays = agreement.getVerifiedBlockingDelayDays();
        res.delayAttribution = agreement.getDelayAttribution();
        res.reviewPeriodDays = agreement.getReviewPeriodDays();
        res.approvalPeriodDays = agreement.getApprovalPeriodDays();
        res.scopeObjective = agreement.getScopeObjective();
        res.includedModules = agreement.getIncludedModules();
        res.excludedModules = agreement.getExcludedModules();
        res.assumptions = agreement.getAssumptions();
        res.agreedDeliverables = agreement.getAgreedDeliverables();
        res.createdByName = agreement.getCreatedBy() != null ? agreement.getCreatedBy().getFullName() : "System";
        res.approvedByManagerName = agreement.getApprovedByManager() != null ? agreement.getApprovedByManager().getFullName() : null;
        res.approvedByClientName = agreement.getApprovedByClient() != null ? agreement.getApprovedByClient().getFullName() : null;
        res.createdAt = agreement.getCreatedAt();
        res.approvedAt = agreement.getApprovedAt();

        res.milestones = agreementMilestoneRepository.findByAgreementId(agreement.getId());
        res.paymentMilestones = paymentMilestoneRepository.findByAgreementIdOrderByCreatedAtAsc(agreement.getId());
        res.responsibilities = responsibilityRepository.findByAgreementId(agreement.getId());
        res.amendments = amendmentRepository.findByAgreementIdOrderByAmendmentNumberAsc(agreement.getId());

        BigDecimal paid = BigDecimal.ZERO;
        BigDecimal nextAmt = null;
        Double nextTrig = null;

        for (PaymentMilestone pm : res.paymentMilestones) {
            if (pm.getStatus() == PaymentMilestone.PaymentStatus.PAID) {
                paid = paid.add(pm.getPaymentAmount());
            } else if (nextAmt == null && (pm.getStatus() == PaymentMilestone.PaymentStatus.PENDING || pm.getStatus() == PaymentMilestone.PaymentStatus.TRIGGERED)) {
                nextAmt = pm.getPaymentAmount();
                nextTrig = pm.getTriggerValue();
            }
        }

        res.totalPaidAmount = paid;
        res.nextPaymentAmount = nextAmt;
        res.nextPaymentTrigger = nextTrig;

        return res;
    }
}
