package com.platform.service;

import com.platform.dto.TaskDtos;
import com.platform.entity.Notification;
import com.platform.entity.Project;
import com.platform.entity.Task;
import com.platform.entity.User;
import com.platform.exception.ResourceNotFoundException;
import com.platform.repository.ProjectRepository;
import com.platform.repository.TaskRepository;
import com.platform.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;
    private final NotificationService notificationService;
    private final MilestoneService milestoneService;
    private final RiskEngineService riskEngineService;
    private final AgreementService agreementService;

    public TaskService(TaskRepository taskRepository,
                       ProjectRepository projectRepository,
                       UserRepository userRepository,
                       AuditService auditService,
                       NotificationService notificationService,
                       MilestoneService milestoneService,
                       RiskEngineService riskEngineService,
                       @org.springframework.context.annotation.Lazy AgreementService agreementService) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
        this.notificationService = notificationService;
        this.milestoneService = milestoneService;
        this.riskEngineService = riskEngineService;
        this.agreementService = agreementService;
    }

    public List<Task> getTasksForProject(String projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    public List<Task> getTasksForUser(String userId) {
        return taskRepository.findByAssigneeId(userId);
    }

    public Task getTaskById(String taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + taskId));
    }

    @Transactional
    public Task createTask(TaskDtos.CreateTaskRequest request, User creator) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + request.getProjectId()));

        List<Task> existing = taskRepository.findByProjectId(request.getProjectId());
        String taskKey = String.format("%s-%d", project.getProjectKey(), existing.size() + 101);

        Task task = new Task();
        task.setTaskKey(taskKey);
        task.setProjectId(request.getProjectId());
        task.setMilestoneId(request.getMilestoneId());
        task.setTeamId(request.getTeamId());
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority() != null ? request.getPriority() : Task.Priority.MEDIUM);
        task.setStatus(request.getStatus() != null ? request.getStatus() : Task.TaskStatus.TO_DO);
        task.setStartDate(request.getStartDate() != null ? request.getStartDate() : LocalDate.now());
        task.setDueDate(request.getDueDate() != null ? request.getDueDate() : LocalDate.now().plusDays(7));
        task.setEstimatedHours(request.getEstimatedHours() > 0 ? request.getEstimatedHours() : 8.0);
        task.setInitialEstimate(task.getEstimatedHours());

        if (request.getAssigneeId() != null) {
            userRepository.findById(request.getAssigneeId()).ifPresent(task::setAssignee);
        }

        Task saved = taskRepository.save(task);

        auditService.log(saved.getProjectId(), creator, "TASK_CREATED", "TASK", saved.getId(),
                null, saved.getTitle(), "Created task " + saved.getTaskKey());

        if (task.getAssignee() != null) {
            notificationService.sendToUser(
                    task.getAssignee().getId(),
                    com.platform.entity.NotificationType.TASK_ASSIGNED,
                    "New Task Assigned: " + task.getTaskKey(),
                    "You have been assigned: " + task.getTitle(),
                    Notification.Severity.INFO,
                    saved.getProjectId(),
                    "TASK",
                    saved.getId(),
                    "/tasks/" + saved.getId(),
                    java.util.Map.of("taskKey", task.getTaskKey(), "taskId", saved.getId(), "priority", task.getPriority().name())
            );
        }

        notificationService.publishProjectEvent(saved.getProjectId(), "TASK_CREATED", "TASK", saved.getId(), saved);
        postTaskUpdate(saved);
        return saved;
    }

    @Transactional
    public Task updateTask(String taskId, TaskDtos.UpdateTaskRequest request, User actor) {
        Task task = getTaskById(taskId);
        User oldAssignee = task.getAssignee();
        Task.TaskStatus oldStatus = task.getStatus();

        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getMilestoneId() != null) task.setMilestoneId(request.getMilestoneId());
        if (request.getTeamId() != null) task.setTeamId(request.getTeamId());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());
        if (request.getEstimatedHours() != null) task.setEstimatedHours(request.getEstimatedHours());
        if (request.getActualHours() != null) task.setActualHours(request.getActualHours());

        if (request.getProgress() != null) {
            int oldProgress = task.getProgress();
            task.setProgress(request.getProgress());
            if (task.getProgress() == 100 && task.getStatus() != Task.TaskStatus.COMPLETED) {
                task.setStatus(Task.TaskStatus.COMPLETED);
            }
            auditService.log(task.getProjectId(), actor, "PROGRESS_UPDATED", "TASK", task.getId(),
                    oldProgress + "%", task.getProgress() + "%", "Updated progress of " + task.getTaskKey());
        }

        if (request.getStatus() != null && request.getStatus() != task.getStatus()) {
            task.setStatus(request.getStatus());
            auditService.log(task.getProjectId(), actor, "STATUS_CHANGED", "TASK", task.getId(),
                    oldStatus.name(), task.getStatus().name(), "Changed status of " + task.getTaskKey());
        }

        if (request.getAssigneeId() != null) {
            User newAssignee = userRepository.findById(request.getAssigneeId()).orElse(null);
            task.setAssignee(newAssignee);
            auditService.log(task.getProjectId(), actor, "TASK_REASSIGNED", "TASK", task.getId(),
                    oldAssignee != null ? oldAssignee.getFullName() : "None",
                    newAssignee != null ? newAssignee.getFullName() : "None",
                    "Reassigned task " + task.getTaskKey());

            if (newAssignee != null && (oldAssignee == null || !oldAssignee.getId().equals(newAssignee.getId()))) {
                notificationService.sendToUser(
                        newAssignee.getId(),
                        com.platform.entity.NotificationType.TASK_ASSIGNED,
                        "Task Assigned: " + task.getTaskKey(),
                        "You have been assigned: " + task.getTitle(),
                        Notification.Severity.INFO,
                        task.getProjectId(),
                        "TASK",
                        task.getId(),
                        "/tasks/" + task.getId(),
                        java.util.Map.of("taskKey", task.getTaskKey(), "taskId", task.getId())
                );
            }
            if (oldAssignee != null && (newAssignee == null || !oldAssignee.getId().equals(newAssignee.getId()))) {
                notificationService.sendToUser(
                        oldAssignee.getId(),
                        com.platform.entity.NotificationType.TASK_REASSIGNED,
                        "Task Reassigned: " + task.getTaskKey(),
                        "Task '" + task.getTitle() + "' was reassigned to " + (newAssignee != null ? newAssignee.getFullName() : "unassigned"),
                        Notification.Severity.INFO,
                        task.getProjectId(),
                        "TASK",
                        task.getId(),
                        "/tasks/" + task.getId(),
                        java.util.Map.of("taskKey", task.getTaskKey())
                );
            }
        }

        if (request.getIsBlocked() != null) {
            task.setBlocked(request.getIsBlocked());
            task.setBlockerReason(request.getBlockerReason());
        }

        Task saved = taskRepository.save(task);

        if (oldStatus != Task.TaskStatus.COMPLETED && saved.getStatus() == Task.TaskStatus.COMPLETED) {
            notificationService.sendToProjectManagers(
                    saved.getProjectId(),
                    com.platform.entity.NotificationType.TASK_COMPLETED,
                    "Task Completed: " + saved.getTaskKey(),
                    (actor != null ? actor.getFullName() : "Assignee") + " completed " + saved.getTitle(),
                    Notification.Severity.SUCCESS,
                    "TASK",
                    saved.getId(),
                    "/tasks/" + saved.getId(),
                    java.util.Map.of("taskKey", saved.getTaskKey())
            );
        }

        postTaskUpdate(saved);
        return saved;
    }

    @Transactional
    public Task updateProgress(String taskId, TaskDtos.ProgressUpdateRequest request, User actor) {
        Task task = getTaskById(taskId);
        int oldProgress = task.getProgress();
        Task.TaskStatus oldStatus = task.getStatus();
        task.setProgress(request.getProgress());
        if (request.getActualHours() != null) {
            task.setActualHours(request.getActualHours());
        }
        if (task.getProgress() == 100) {
            task.setStatus(Task.TaskStatus.COMPLETED);
        }

        auditService.log(task.getProjectId(), actor, "PROGRESS_UPDATED", "TASK", task.getId(),
                oldProgress + "%", task.getProgress() + "%", "Progress set to " + task.getProgress() + "%");

        Task saved = taskRepository.save(task);

        if (oldStatus != Task.TaskStatus.COMPLETED && saved.getStatus() == Task.TaskStatus.COMPLETED) {
            notificationService.sendToProjectManagers(
                    saved.getProjectId(),
                    com.platform.entity.NotificationType.TASK_COMPLETED,
                    "Task Completed: " + saved.getTaskKey(),
                    (actor != null ? actor.getFullName() : "Assignee") + " marked " + saved.getTitle() + " as 100% complete",
                    Notification.Severity.SUCCESS,
                    "TASK",
                    saved.getId(),
                    "/tasks/" + saved.getId(),
                    java.util.Map.of("taskKey", saved.getTaskKey())
            );
        }

        postTaskUpdate(saved);
        return saved;
    }

    @Transactional
    public Task updateStatus(String taskId, TaskDtos.StatusUpdateRequest request, User actor) {
        Task task = getTaskById(taskId);
        Task.TaskStatus old = task.getStatus();
        task.setStatus(request.getStatus());
        if (request.getStatus() == Task.TaskStatus.COMPLETED) {
            task.setProgress(100);
        }

        auditService.log(task.getProjectId(), actor, "STATUS_CHANGED", "TASK", task.getId(),
                old.name(), task.getStatus().name(), "Status changed to " + task.getStatus().name());

        Task saved = taskRepository.save(task);

        if (old != Task.TaskStatus.COMPLETED && saved.getStatus() == Task.TaskStatus.COMPLETED) {
            notificationService.sendToProjectManagers(
                    saved.getProjectId(),
                    com.platform.entity.NotificationType.TASK_COMPLETED,
                    "Task Completed: " + saved.getTaskKey(),
                    (actor != null ? actor.getFullName() : "Assignee") + " moved " + saved.getTitle() + " to COMPLETED",
                    Notification.Severity.SUCCESS,
                    "TASK",
                    saved.getId(),
                    "/tasks/" + saved.getId(),
                    java.util.Map.of("taskKey", saved.getTaskKey())
            );
        }

        postTaskUpdate(saved);
        return saved;
    }

    @Transactional
    public Task reportBlocker(String taskId, TaskDtos.BlockerReportRequest request, User reporter) {
        Task task = getTaskById(taskId);
        task.setBlocked(request.isBlocked());
        task.setBlockerReason(request.getBlockerReason());
        if (request.isBlocked()) {
            task.setStatus(Task.TaskStatus.BLOCKED);
        } else if (task.getStatus() == Task.TaskStatus.BLOCKED) {
            task.setStatus(Task.TaskStatus.IN_PROGRESS);
        }

        auditService.log(task.getProjectId(), reporter, request.isBlocked() ? "BLOCKER_REPORTED" : "BLOCKER_RESOLVED", "TASK", task.getId(),
                null, request.getBlockerReason(), "Blocker update: " + request.getBlockerReason());

        if (request.isBlocked()) {
            notificationService.sendToProjectManagers(
                    task.getProjectId(),
                    com.platform.entity.NotificationType.BLOCKER_REPORTED,
                    "CRITICAL: Blocker Reported on " + task.getTaskKey(),
                    String.format("%s reported blocker on '%s': %s", reporter.getFullName(), task.getTitle(), request.getBlockerReason()),
                    Notification.Severity.CRITICAL,
                    "TASK",
                    task.getId(),
                    "/projects/" + task.getProjectId() + "/tasks",
                    java.util.Map.of("taskKey", task.getTaskKey(), "taskId", task.getId(), "reason", request.getBlockerReason() != null ? request.getBlockerReason() : "")
            );
            notificationService.publishProjectEvent(
                    task.getProjectId(),
                    "BLOCKER_FLAGGED",
                    "TASK",
                    task.getId(),
                    java.util.Map.of("taskId", task.getId(), "taskKey", task.getTaskKey(), "isBlocked", true, "reason", request.getBlockerReason() != null ? request.getBlockerReason() : "", "status", "BLOCKED")
            );
        } else {
            notificationService.sendToProjectManagers(
                    task.getProjectId(),
                    com.platform.entity.NotificationType.BLOCKER_RESOLVED,
                    "Blocker Resolved: " + task.getTaskKey(),
                    String.format("%s resolved blocker on '%s'", reporter.getFullName(), task.getTitle()),
                    Notification.Severity.SUCCESS,
                    "TASK",
                    task.getId(),
                    "/projects/" + task.getProjectId() + "/tasks",
                    java.util.Map.of("taskKey", task.getTaskKey(), "taskId", task.getId())
            );
            notificationService.publishProjectEvent(
                    task.getProjectId(),
                    "BLOCKER_RESOLVED",
                    "TASK",
                    task.getId(),
                    java.util.Map.of("taskId", task.getId(), "taskKey", task.getTaskKey(), "isBlocked", false, "status", task.getStatus().name())
            );
        }

        Task saved = taskRepository.save(task);
        postTaskUpdate(saved);
        return saved;
    }

    private void postTaskUpdate(Task task) {
        if (task.getMilestoneId() != null) {
            milestoneService.recalculateMilestoneProgress(task.getMilestoneId());
        }
        riskEngineService.recalculateProjectRisks(task.getProjectId());
        notificationService.publishProjectEvent(task.getProjectId(), "TASK_UPDATED", "TASK", task.getId(), task);

        if (task.getProjectId() != null) {
            projectRepository.findById(task.getProjectId()).ifPresent(proj -> {
                agreementService.checkAndTriggerPayments(proj.getId(), proj.getOverallProgress(), task.getMilestoneId());
            });
        }
    }
}

