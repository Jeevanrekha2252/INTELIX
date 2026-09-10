package com.platform.service;

import com.platform.entity.Project;
import com.platform.entity.RiskAssessment;
import com.platform.entity.RiskLevel;
import com.platform.entity.Task;
import com.platform.entity.TaskDependency;
import com.platform.entity.User;
import com.platform.repository.ProjectRepository;
import com.platform.repository.RiskAssessmentRepository;
import com.platform.repository.TaskDependencyRepository;
import com.platform.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class RiskEngineService {

    private final TaskRepository taskRepository;
    private final TaskDependencyRepository dependencyRepository;
    private final RiskAssessmentRepository riskAssessmentRepository;
    private final ProjectRepository projectRepository;

    public RiskEngineService(TaskRepository taskRepository,
                             TaskDependencyRepository dependencyRepository,
                             RiskAssessmentRepository riskAssessmentRepository,
                             ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.dependencyRepository = dependencyRepository;
        this.riskAssessmentRepository = riskAssessmentRepository;
        this.projectRepository = projectRepository;
    }

    public static class TaskRiskResult {
        public int score;
        public RiskLevel level;
        public double progressRisk;
        public double deadlineRisk;
        public double dependencyRisk;
        public double workloadRisk;
        public double blockerRisk;
        public int confidenceScore;
        public String confidenceRating;
        public List<String> explanation = new ArrayList<>();
        public String recommendedAction;
        public LocalDateTime calculatedAt = LocalDateTime.now();
    }

    public TaskRiskResult calculateTaskRisk(Task task) {
        TaskRiskResult result = new TaskRiskResult();

        if (task.getStatus() == Task.TaskStatus.COMPLETED) {
            result.score = 0;
            result.level = RiskLevel.LOW;
            result.confidenceScore = 95;
            result.confidenceRating = "GOOD";
            result.explanation.add("Task is completed.");
            result.recommendedAction = "No action needed.";
            return result;
        }

        LocalDate today = LocalDate.now();

        // 1. Progress Risk (0 - 100)
        LocalDate startDate = task.getStartDate() != null ? task.getStartDate() : task.getCreatedAt().toLocalDate();
        long totalDays = Math.max(1, ChronoUnit.DAYS.between(startDate, task.getDueDate()));
        long elapsedDays = Math.max(0, ChronoUnit.DAYS.between(startDate, today));
        double expectedProgress = Math.min(100.0, ((double) elapsedDays / totalDays) * 100.0);
        double progressGap = Math.max(0.0, expectedProgress - task.getProgress());
        result.progressRisk = Math.min(100.0, progressGap * 1.5);
        if (progressGap > 15) {
            result.explanation.add(String.format("Actual progress (%d%%) is %.0f%% behind expected progress (%.0f%%).",
                    task.getProgress(), progressGap, expectedProgress));
        }

        // 2. Deadline Risk (0 - 100)
        long daysUntilDue = ChronoUnit.DAYS.between(today, task.getDueDate());
        if (daysUntilDue < 0) {
            result.deadlineRisk = 100.0;
            result.explanation.add(String.format("Task is overdue by %d days.", Math.abs(daysUntilDue)));
        } else if (daysUntilDue <= 2 && task.getProgress() < 70) {
            result.deadlineRisk = 90.0;
            result.explanation.add(String.format("Critical deadline: Only %d days remaining with %d%% progress.", daysUntilDue, task.getProgress()));
        } else if (daysUntilDue <= 5 && task.getProgress() < 50) {
            result.deadlineRisk = 65.0;
            result.explanation.add(String.format("Deadline approaching in %d days.", daysUntilDue));
        } else {
            result.deadlineRisk = Math.max(0.0, 50.0 - (daysUntilDue * 5.0));
        }

        // 3. Dependency Risk (0 - 100)
        List<TaskDependency> deps = dependencyRepository.findBySuccessorTaskId(task.getId());
        double depScore = 0.0;
        int incompletePreds = 0;
        for (TaskDependency dep : deps) {
            Optional<Task> predOpt = taskRepository.findById(dep.getPredecessorTaskId());
            if (predOpt.isPresent()) {
                Task pred = predOpt.get();
                if (pred.getStatus() != Task.TaskStatus.COMPLETED) {
                    incompletePreds++;
                    if (pred.isBlocked() || pred.getDueDate().isBefore(today)) {
                        depScore += 50.0;
                    } else if (pred.getProgress() < 50) {
                        depScore += 30.0;
                    } else {
                        depScore += 15.0;
                    }
                }
            }
        }
        result.dependencyRisk = Math.min(100.0, depScore);
        if (incompletePreds > 0) {
            result.explanation.add(String.format("%d predecessor task(s) remain incomplete in dependency chain.", incompletePreds));
        }

        // 4. Workload Risk (0 - 100)
        if (task.getAssignee() != null) {
            List<Task> activeUserTasks = taskRepository.findByAssigneeId(task.getAssignee().getId())
                    .stream().filter(t -> t.getStatus() != Task.TaskStatus.COMPLETED).toList();
            double totalHours = activeUserTasks.stream().mapToDouble(Task::getEstimatedHours).sum();
            int weeklyCapacity = task.getAssignee().getCapacityHoursPerWeek();
            double utilization = (totalHours / Math.max(1, weeklyCapacity)) * 100.0;
            if (utilization > 100.0) {
                result.workloadRisk = Math.min(100.0, 50.0 + (utilization - 100.0));
                result.explanation.add(String.format("Assignee is overloaded (%.0f%% capacity allocated).", utilization));
            } else if (utilization > 85.0) {
                result.workloadRisk = 40.0;
            } else {
                result.workloadRisk = 10.0;
            }
        } else {
            result.workloadRisk = 50.0;
            result.explanation.add("Task currently has no assigned owner.");
        }

        // 5. Blocker Risk (0 - 100)
        if (task.isBlocked()) {
            result.blockerRisk = 100.0;
            result.explanation.add(String.format("Active blocker reported: %s",
                    task.getBlockerReason() != null ? task.getBlockerReason() : "Unspecified blocker"));
        } else {
            result.blockerRisk = 0.0;
        }

        // Weighted Heuristic:
        // Risk = 0.30 * Progress + 0.25 * Deadline + 0.20 * Dependency + 0.15 * Workload + 0.10 * Blocker
        double totalRisk = (0.30 * result.progressRisk)
                + (0.25 * result.deadlineRisk)
                + (0.20 * result.dependencyRisk)
                + (0.15 * result.workloadRisk)
                + (0.10 * result.blockerRisk);

        result.score = (int) Math.round(totalRisk);

        if (result.score <= 30) {
            result.level = RiskLevel.LOW;
            result.recommendedAction = "Maintain standard delivery cadence.";
        } else if (result.score <= 60) {
            result.level = RiskLevel.MEDIUM;
            result.recommendedAction = "Monitor progress velocity and check predecessor status.";
        } else {
            result.level = RiskLevel.HIGH;
            if (task.isBlocked()) {
                result.recommendedAction = "Escalate and unblock predecessor dependencies immediately.";
            } else if (result.workloadRisk > 60) {
                result.recommendedAction = "Reallocate developer capacity or assign co-developer.";
            } else {
                result.recommendedAction = "Fast-track implementation and prioritize API integration.";
            }
        }

        // Data confidence
        int conf = 90;
        if (task.getActualHours() == 0 && task.getStatus() == Task.TaskStatus.IN_PROGRESS) conf -= 15;
        if (task.getEstimatedHours() <= 0) conf -= 20;
        if (task.getAssignee() == null) conf -= 10;
        result.confidenceScore = Math.max(30, conf);
        result.confidenceRating = result.confidenceScore >= 80 ? "GOOD" : (result.confidenceScore >= 60 ? "MODERATE" : "POOR");

        return result;
    }

    @Transactional
    public void recalculateProjectRisks(String projectId) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        double totalWeightedRisk = 0;
        int count = 0;

        for (Task task : tasks) {
            TaskRiskResult tr = calculateTaskRisk(task);
            task.setRiskScore(tr.score);
            task.setRiskLevel(tr.level);
            taskRepository.save(task);

            // Save history snapshot
            RiskAssessment ra = new RiskAssessment();
            ra.setProjectId(projectId);
            ra.setTaskId(task.getId());
            ra.setRiskScore(tr.score);
            ra.setRiskLevel(tr.level);
            ra.setProgressRisk(tr.progressRisk);
            ra.setDeadlineRisk(tr.deadlineRisk);
            ra.setDependencyRisk(tr.dependencyRisk);
            ra.setWorkloadRisk(tr.workloadRisk);
            ra.setBlockerRisk(tr.blockerRisk);
            ra.setConfidenceScore(tr.confidenceScore);
            ra.setConfidenceRating(tr.confidenceRating);
            ra.setExplanation(String.join("; ", tr.explanation));
            ra.setRecommendedAction(tr.recommendedAction);
            riskAssessmentRepository.save(ra);

            if (task.getStatus() != Task.TaskStatus.COMPLETED) {
                totalWeightedRisk += tr.score;
                count++;
            }
        }

        final int avgRisk = count > 0 ? (int) Math.round(totalWeightedRisk / count) : 10;
        final long overdueCount = tasks.stream().filter(t -> t.getDueDate().isBefore(LocalDate.now()) && t.getStatus() != Task.TaskStatus.COMPLETED).count();
        final int health = Math.max(10, Math.min(100, 100 - (int)(avgRisk * 0.75 + overdueCount * 8)));

        projectRepository.findById(projectId).ifPresent(p -> {
            p.setRiskLevel(avgRisk <= 30 ? RiskLevel.LOW : (avgRisk <= 60 ? RiskLevel.MEDIUM : RiskLevel.HIGH));
            p.setHealthScore(health);
            p.setHealthStatus(health >= 80 ? "HEALTHY" : (health >= 50 ? "AT_RISK" : "CRITICAL"));
            projectRepository.save(p);
        });
    }
}
