package com.platform.service;

import com.platform.dto.PlatformDtos;
import com.platform.entity.DeliverableApproval;
import com.platform.entity.Notification;
import com.platform.entity.Project;
import com.platform.entity.User;
import com.platform.exception.ResourceNotFoundException;
import com.platform.repository.DeliverableApprovalRepository;
import com.platform.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApprovalService {

    private final DeliverableApprovalRepository approvalRepository;
    private final ProjectRepository projectRepository;
    private final AuditService auditService;
    private final NotificationService notificationService;

    public ApprovalService(DeliverableApprovalRepository approvalRepository,
                           ProjectRepository projectRepository,
                           AuditService auditService,
                           NotificationService notificationService) {
        this.approvalRepository = approvalRepository;
        this.projectRepository = projectRepository;
        this.auditService = auditService;
        this.notificationService = notificationService;
    }

    public List<DeliverableApproval> getApprovalsForProject(String projectId) {
        return approvalRepository.findByProjectIdOrderBySubmittedDateDesc(projectId);
    }

    @Transactional
    public DeliverableApproval makeDecision(String id, PlatformDtos.DeliverableDecision decision, User client) {
        DeliverableApproval approval = approvalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deliverable not found: " + id));

        approval.setStatus(decision.getStatus());
        approval.setComments(decision.getComments());
        approval.setDecidedBy(client);
        approval.setDecisionDate(LocalDateTime.now());

        DeliverableApproval saved = approvalRepository.save(approval);

        auditService.log(approval.getProjectId(), client, "DELIVERABLE_DECISION", "DELIVERABLE", saved.getId(),
                "PENDING", decision.getStatus().name(), "Client decided: " + decision.getStatus() + " on " + saved.getDeliverableName());

        Project project = projectRepository.findById(approval.getProjectId()).orElse(null);
        if (project != null && project.getProjectManager() != null) {
            notificationService.sendNotification(
                    project.getProjectManager().getId(),
                    "Deliverable Sign-off: " + saved.getDeliverableName(),
                    String.format("%s marked '%s' as %s", client.getFullName(), saved.getDeliverableName(), decision.getStatus().name()),
                    decision.getStatus() == DeliverableApproval.ApprovalStatus.APPROVED ? Notification.Severity.SUCCESS : Notification.Severity.WARNING,
                    "APPROVAL",
                    "/projects/" + project.getId() + "/approvals"
            );
        }

        return saved;
    }
}
