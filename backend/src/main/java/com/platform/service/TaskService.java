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

    public TaskService(TaskRepository taskRepository,
                       ProjectRepository projectRepository,
                       UserRepository userRepository,
                       AuditService auditService,
                       NotificationService notificationService,
                       MilestoneService milestoneService,
                       RiskEngineService riskEngineService) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
        this.notificationService = notificationService;
        this.milestoneService = milestoneService;
        this.riskEngineService = riskEngineService;
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
            notificationService.sendNotification(
                    task.getAssignee().getId(),
                    "New Task Assigned: " + task.getTaskKey(),
                    "You have been assigned: " + task.getTitle(),
                    Notification.Severity.INFO,
                    "TASK",
                    "/tasks/" + saved.getId()
            );
        }

        postTaskUpdate(saved);
        return saved;
    }

    @Transactional
    public Task updateTask(String taskId, TaskDtos.UpdateTaskRequest request, User actor) {
        Task task = getTaskById(taskId);

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
            Task.TaskStatus oldStatus = task.getStatus();
            task.setStatus(request.getStatus());
            auditService.log(task.getProjectId(), actor, "STATUS_CHANGED", "TASK", task.getId(),
                    oldStatus.name(), task.getStatus().name(), "Changed status of " + task.getTaskKey());
        }

        if (request.getAssigneeId() != null) {
            User newAssignee = userRepository.findById(request.getAssigneeId()).orElse(null);
            User oldAssignee = task.getAssignee();
            task.setAssignee(newAssignee);
            auditService.log(task.getProjectId(), actor, "TASK_REASSIGNED", "TASK", task.getId(),
                    oldAssignee != null ? oldAssignee.getFullName() : "None",
                    newAssignee != null ? newAssignee.getFullName() : "None",
                    "Reassigned task " + task.getTaskKey());
        }

        if (request.getIsBlocked() != null) {
            task.setBlocked(request.getIsBlocked());
            task.setBlockerReason(request.getBlockerReason());
        }

        Task saved = taskRepository.save(task);
        postTaskUpdate(saved);
        return saved;
    }

    @Transactional
    public Task updateProgress(String taskId, TaskDtos.ProgressUpdateRequest request, User actor) {
        Task task = getTaskById(taskId);
        int oldProgress = task.getProgress();
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
        }

        auditService.log(task.getProjectId(), reporter, "BLOCKER_REPORTED", "TASK", task.getId(),
                null, request.getBlockerReason(), "Reported blocker: " + request.getBlockerReason());

        Project project = projectRepository.findById(task.getProjectId()).orElse(null);
        if (project != null && project.getProjectManager() != null) {
            notificationService.sendNotification(
                    project.getProjectManager().getId(),
                    "CRITICAL: Blocker Reported on " + task.getTaskKey(),
                    String.format("%s reported blocker on '%s': %s", reporter.getFullName(), task.getTitle(), request.getBlockerReason()),
                    Notification.Severity.CRITICAL,
                    "TASK",
                    "/projects/" + project.getId() + "/tasks"
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
    }
}
