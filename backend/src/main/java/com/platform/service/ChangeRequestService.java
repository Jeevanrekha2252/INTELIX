package com.platform.service;

import com.platform.dto.PlatformDtos;
import com.platform.dto.TaskDtos;
import com.platform.entity.*;
import com.platform.exception.ResourceNotFoundException;
import com.platform.repository.ChangeRequestRepository;
import com.platform.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChangeRequestService {

    private final ChangeRequestRepository changeRequestRepository;
    private final ProjectRepository projectRepository;
    private final TaskService taskService;
    private final AuditService auditService;
    private final NotificationService notificationService;

    public ChangeRequestService(ChangeRequestRepository changeRequestRepository,
                                ProjectRepository projectRepository,
                                TaskService taskService,
                                AuditService auditService,
                                NotificationService notificationService) {
        this.changeRequestRepository = changeRequestRepository;
        this.projectRepository = projectRepository;
        this.taskService = taskService;
        this.auditService = auditService;
        this.notificationService = notificationService;
    }

    public List<ChangeRequest> getChangeRequestsForProject(String projectId) {
        return changeRequestRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
    }

    public ChangeRequest getChangeRequestById(String id) {
        return changeRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Change Request not found: " + id));
    }

    @Transactional
    public ChangeRequest createChangeRequest(PlatformDtos.ChangeRequestCreate dto, User client) {
        Project project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + dto.getProjectId()));

        List<ChangeRequest> existing = changeRequestRepository.findByProjectIdOrderByCreatedAtDesc(dto.getProjectId());
        String crKey = String.format("CR-%s-%03d", project.getProjectKey(), existing.size() + 1);

        ChangeRequest cr = new ChangeRequest();
        cr.setCrKey(crKey);
        cr.setProjectId(dto.getProjectId());
        cr.setTitle(dto.getTitle());
        cr.setDescription(dto.getDescription());
        cr.setModule(dto.getModule() != null && !dto.getModule().trim().isEmpty() ? dto.getModule() : "General");
        cr.setPriority(dto.getPriority() != null ? dto.getPriority() : Task.Priority.MEDIUM);
        cr.setRequestedBy(client);
        cr.setStatus(ChangeRequest.ChangeRequestStatus.SUBMITTED);

        ChangeRequest saved = changeRequestRepository.save(cr);

        auditService.log(project.getId(), client, "CHANGE_REQUEST_SUBMITTED", "CHANGE_REQUEST", saved.getId(),
                null, saved.getTitle(), "Client submitted change request " + saved.getCrKey());

        notificationService.sendToProjectManagers(
                project.getId(),
                com.platform.entity.NotificationType.CHANGE_REQUEST_CREATED,
                "New Change Request: " + saved.getCrKey(),
                String.format("Client %s submitted CR: %s", client.getFullName(), saved.getTitle()),
                Notification.Severity.WARNING,
                "CHANGE_REQUEST",
                saved.getId(),
                "/projects/" + project.getId() + "/change-requests",
                java.util.Map.of("crKey", saved.getCrKey(), "crId", saved.getId(), "priority", saved.getPriority().name())
        );

        notificationService.publishProjectEvent(project.getId(), "CHANGE_REQUEST_CREATED", "CHANGE_REQUEST", saved.getId(), saved);

        return saved;
    }

    @Transactional
    public ChangeRequest reviewChangeRequest(String id, PlatformDtos.ChangeRequestReview dto, User manager) {
        ChangeRequest cr = getChangeRequestById(id);
        cr.setStatus(dto.getStatus());
        cr.setManagerResponse(dto.getManagerResponse());

        ChangeRequest saved = changeRequestRepository.save(cr);

        auditService.log(cr.getProjectId(), manager, "CHANGE_REQUEST_REVIEWED", "CHANGE_REQUEST", cr.getId(),
                null, dto.getStatus().name(), "Manager responded to CR " + cr.getCrKey() + ": " + dto.getStatus());

        com.platform.entity.NotificationType notifType = switch (dto.getStatus()) {
            case APPROVED -> com.platform.entity.NotificationType.CHANGE_REQUEST_APPROVED;
            case REJECTED -> com.platform.entity.NotificationType.CHANGE_REQUEST_REJECTED;
            case NEEDS_CLARIFICATION -> com.platform.entity.NotificationType.CHANGE_REQUEST_NEEDS_CLARIFICATION;
            default -> com.platform.entity.NotificationType.CHANGE_REQUEST_CREATED;
        };

        Notification.Severity sev = dto.getStatus() == ChangeRequest.ChangeRequestStatus.APPROVED ? Notification.Severity.SUCCESS : Notification.Severity.WARNING;

        notificationService.sendToUser(
                cr.getRequestedBy().getId(),
                notifType,
                "Change Request " + dto.getStatus().name() + ": " + cr.getCrKey(),
                "Your change request was reviewed: " + (dto.getManagerResponse() != null ? dto.getManagerResponse() : dto.getStatus().name()),
                sev,
                cr.getProjectId(),
                "CHANGE_REQUEST",
                cr.getId(),
                "/projects/" + cr.getProjectId() + "/change-requests",
                java.util.Map.of("crKey", cr.getCrKey(), "status", dto.getStatus().name())
        );

        notificationService.publishProjectEvent(cr.getProjectId(), "CHANGE_REQUEST_UPDATED", "CHANGE_REQUEST", saved.getId(), saved);

        return saved;
    }

    @Transactional
    public Task convertToTask(String id, User manager) {
        ChangeRequest cr = getChangeRequestById(id);

        TaskDtos.CreateTaskRequest tr = new TaskDtos.CreateTaskRequest();
        tr.setProjectId(cr.getProjectId());
        tr.setTitle("[CR] " + cr.getTitle());
        tr.setDescription(cr.getDescription() + "\n\nOriginating Change Request: " + cr.getCrKey());
        tr.setPriority(cr.getPriority());
        tr.setStatus(Task.TaskStatus.TO_DO);
        tr.setEstimatedHours(16.0);

        Task createdTask = taskService.createTask(tr, manager);

        cr.setStatus(ChangeRequest.ChangeRequestStatus.CONVERTED_TO_TASK);
        cr.setLinkedTaskId(createdTask.getId());
        changeRequestRepository.save(cr);

        auditService.log(cr.getProjectId(), manager, "CR_CONVERTED_TO_TASK", "TASK", createdTask.getId(),
                cr.getCrKey(), createdTask.getTaskKey(), "Converted CR " + cr.getCrKey() + " into task " + createdTask.getTaskKey());

        notificationService.publishProjectEvent(cr.getProjectId(), "CHANGE_REQUEST_UPDATED", "CHANGE_REQUEST", cr.getId(), cr);

        return createdTask;
    }
}

