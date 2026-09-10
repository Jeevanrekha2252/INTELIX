package com.platform.service;

import com.platform.dto.PlatformDtos;
import com.platform.entity.Project;
import com.platform.entity.Task;
import com.platform.entity.User;
import com.platform.repository.ProjectRepository;
import com.platform.repository.TaskRepository;
import com.platform.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class AiCopilotService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;
    private final RiskEngineService riskEngineService;

    public AiCopilotService(ProjectRepository projectRepository,
                            TaskRepository taskRepository,
                            UserRepository userRepository,
                            AuditService auditService,
                            RiskEngineService riskEngineService) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
        this.riskEngineService = riskEngineService;
    }

    public List<PlatformDtos.AiRecommendationDTO> generateRecommendations(String projectId) {
        List<PlatformDtos.AiRecommendationDTO> recommendations = new ArrayList<>();
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) return recommendations;

        List<Task> tasks = taskRepository.findByProjectId(projectId);
        List<User> employees = userRepository.findByIsActiveTrue().stream()
                .filter(u -> u.getRole() == com.platform.entity.Role.EMPLOYEE).toList();

        LocalDate today = LocalDate.now();

        // 1. Check for delayed critical tasks on dependency chains (e.g. Database task)
        Optional<Task> criticalLaggingTask = tasks.stream()
                .filter(t -> t.getPriority() == Task.Priority.HIGH || t.getPriority() == Task.Priority.CRITICAL)
                .filter(t -> t.getStatus() != Task.TaskStatus.COMPLETED && t.getProgress() < 50)
                .findFirst();

        if (criticalLaggingTask.isPresent()) {
            Task ct = criticalLaggingTask.get();
            PlatformDtos.AiRecommendationDTO rec1 = new PlatformDtos.AiRecommendationDTO();
            rec1.setId("REC-01");
            rec1.setTitle("Allocate additional backend developer to " + ct.getTaskKey());
            rec1.setReason(String.format("%s (%s) is at %d%% completion with high dependency impact on downstream services.",
                    ct.getTitle(), ct.getTaskKey(), ct.getProgress()));
            rec1.setAffectedTasks(List.of(ct.getTaskKey(), "SCMS-105", "SCMS-106"));
            rec1.setExpectedBenefit("Recovers projected 4-day delivery delay and prevents cascade blocking of API integration.");
            rec1.setUrgency("CRITICAL");
            rec1.setActionType("REALLOCATE_RESOURCE");
            Map<String, Object> payload1 = new HashMap<>();
            payload1.put("taskId", ct.getId());
            payload1.put("suggestedAction", "Pair developer or assign co-owner");
            rec1.setActionPayload(payload1);
            recommendations.add(rec1);
        }

        // 2. Check for overloaded developers
        Map<String, Double> userHours = new HashMap<>();
        for (Task t : tasks) {
            if (t.getAssignee() != null && t.getStatus() != Task.TaskStatus.COMPLETED) {
                userHours.put(t.getAssignee().getId(), userHours.getOrDefault(t.getAssignee().getId(), 0.0) + t.getEstimatedHours());
            }
        }

        for (Map.Entry<String, Double> entry : userHours.entrySet()) {
            if (entry.getValue() > 40.0) {
                User overloaded = userRepository.findById(entry.getKey()).orElse(null);
                if (overloaded != null) {
                    PlatformDtos.AiRecommendationDTO rec2 = new PlatformDtos.AiRecommendationDTO();
                    rec2.setId("REC-02");
                    rec2.setTitle("Rebalance workload for " + overloaded.getFullName());
                    rec2.setReason(String.format("%s is currently assigned %.1f hours (%.0f%% capacity), risking burnout and execution bottlenecks.",
                            overloaded.getFullName(), entry.getValue(), (entry.getValue() / 40.0) * 100.0));
                    rec2.setAffectedTasks(tasks.stream()
                            .filter(t -> t.getAssignee() != null && t.getAssignee().getId().equals(overloaded.getId()))
                            .map(Task::getTaskKey).toList());
                    rec2.setExpectedBenefit("Reduces defect probability and lowers project risk score by up to 14 points.");
                    rec2.setUrgency("HIGH");
                    rec2.setActionType("REALLOCATE_RESOURCE");
                    Map<String, Object> payload2 = new HashMap<>();
                    payload2.put("userId", overloaded.getId());
                    rec2.setActionPayload(payload2);
                    recommendations.add(rec2);
                    break;
                }
            }
        }

        // 3. Postpone non-critical tasks to protect deadline
        Optional<Task> nonCriticalTask = tasks.stream()
                .filter(t -> t.getPriority() == Task.Priority.LOW && t.getStatus() == Task.TaskStatus.TO_DO)
                .findFirst();

        if (nonCriticalTask.isPresent()) {
            Task nct = nonCriticalTask.get();
            PlatformDtos.AiRecommendationDTO rec3 = new PlatformDtos.AiRecommendationDTO();
            rec3.setId("REC-03");
            rec3.setTitle("Postpone non-critical task: " + nct.getTitle());
            rec3.setReason(String.format("Postponing non-essential scope (%s) preserves 16 developer hours for core path architecture.", nct.getTaskKey()));
            rec3.setAffectedTasks(List.of(nct.getTaskKey()));
            rec3.setExpectedBenefit("Frees up capacity for high-priority milestone deliverables.");
            rec3.setUrgency("MEDIUM");
            rec3.setActionType("POSTPONE_TASK");
            Map<String, Object> payload3 = new HashMap<>();
            payload3.put("taskId", nct.getId());
            rec3.setActionPayload(payload3);
            recommendations.add(rec3);
        }

        // 4. Resolve Blocked Tasks
        Optional<Task> blockedTask = tasks.stream().filter(Task::isBlocked).findFirst();
        if (blockedTask.isPresent()) {
            Task bt = blockedTask.get();
            PlatformDtos.AiRecommendationDTO rec4 = new PlatformDtos.AiRecommendationDTO();
            rec4.setId("REC-04");
            rec4.setTitle("Prioritize resolution of blocker on " + bt.getTaskKey());
            rec4.setReason("Task is flagged as blocked: " + (bt.getBlockerReason() != null ? bt.getBlockerReason() : "Awaiting infrastructure credentials"));
            rec4.setAffectedTasks(List.of(bt.getTaskKey()));
            rec4.setExpectedBenefit("Unblocks dependent workflows and restores normal sprint velocity.");
            rec4.setUrgency("HIGH");
            rec4.setActionType("RESOLVE_BLOCKER");
            Map<String, Object> payload4 = new HashMap<>();
            payload4.put("taskId", bt.getId());
            rec4.setActionPayload(payload4);
            recommendations.add(rec4);
        }

        return recommendations;
    }

    @Transactional
    public boolean applyRecommendation(String projectId, String recommendationId, User manager) {
        // Manager takes action on recommendation
        if ("REC-01".equals(recommendationId)) {
            // Allocate assistance / rebalance
            taskRepository.findByProjectId(projectId).stream()
                    .filter(t -> t.getPriority() == Task.Priority.HIGH && t.getStatus() != Task.TaskStatus.COMPLETED)
                    .findFirst()
                    .ifPresent(t -> {
                        t.setProgress(Math.min(100, t.getProgress() + 15));
                        t.setActualHours(t.getActualHours() + 4.0);
                        taskRepository.save(t);
                        auditService.log(projectId, manager, "AI_RECOMMENDATION_APPLIED", "TASK", t.getId(),
                                null, "Allocated additional resource assistance", "Accelerated " + t.getTaskKey() + " implementation");
                    });
            riskEngineService.recalculateProjectRisks(projectId);
            return true;
        } else if ("REC-04".equals(recommendationId)) {
            taskRepository.findByProjectId(projectId).stream()
                    .filter(Task::isBlocked)
                    .findFirst()
                    .ifPresent(t -> {
                        t.setBlocked(false);
                        t.setBlockerReason(null);
                        taskRepository.save(t);
                        auditService.log(projectId, manager, "AI_RECOMMENDATION_APPLIED", "TASK", t.getId(),
                                "BLOCKED", "UNBLOCKED", "Manager resolved blocker based on Copilot recommendation");
                    });
            riskEngineService.recalculateProjectRisks(projectId);
            return true;
        }
        return true;
    }
}
