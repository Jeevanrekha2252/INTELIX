package com.platform.service;

import com.platform.dto.PlatformDtos;
import com.platform.entity.Project;
import com.platform.entity.Task;
import com.platform.repository.ProjectRepository;
import com.platform.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class PredictionService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public PredictionService(ProjectRepository projectRepository, TaskRepository taskRepository) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
    }

    public PlatformDtos.PredictionDTO calculateProjectPrediction(String projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));

        List<Task> tasks = taskRepository.findByProjectId(projectId);
        LocalDate today = LocalDate.now();

        double totalEstimatedHours = 0.0;
        double totalActualHours = 0.0;
        double remainingEffortHours = 0.0;
        int completedTasks = 0;
        int delayedTasks = 0;
        int blockedTasks = 0;

        for (Task t : tasks) {
            totalEstimatedHours += t.getEstimatedHours();
            totalActualHours += t.getActualHours();

            if (t.getStatus() == Task.TaskStatus.COMPLETED) {
                completedTasks++;
            } else {
                double taskRemaining = t.getEstimatedHours() * (1.0 - (t.getProgress() / 100.0));
                remainingEffortHours += Math.max(0.5, taskRemaining);

                if (t.getDueDate().isBefore(today)) {
                    delayedTasks++;
                }
                if (t.isBlocked()) {
                    blockedTasks++;
                }
            }
        }

        long elapsedDays = Math.max(1, ChronoUnit.DAYS.between(project.getStartDate(), today));
        // Completed work in hours
        double completedWorkHours = Math.max(totalActualHours, totalEstimatedHours * (project.getOverallProgress() / 100.0));
        double velocity = completedWorkHours / (double) elapsedDays; // hrs/day

        // Safe fallback for velocity
        if (velocity <= 0.1) {
            velocity = 6.0; // default 6 hrs/day
        }

        // Remaining work / velocity = remaining days
        long estimatedRemainingDays = (long) Math.ceil(remainingEffortHours / velocity);

        // If there are blocked tasks or delayed critical path tasks, buffer remaining days
        if (blockedTasks > 0) {
            estimatedRemainingDays += (blockedTasks * 2L);
        }

        LocalDate predictedCompletion = today.plusDays(estimatedRemainingDays);
        long delayDays = ChronoUnit.DAYS.between(project.getEndDate(), predictedCompletion);

        PlatformDtos.PredictionDTO dto = new PlatformDtos.PredictionDTO();
        dto.setOriginalDeadline(project.getEndDate());
        dto.setPredictedCompletionDate(predictedCompletion);
        dto.setDelayDays(Math.max(0, delayDays));
        dto.setCurrentVelocity(Math.round(velocity * 10.0) / 10.0);
        dto.setRemainingEffortHours(Math.round(remainingEffortHours * 10.0) / 10.0);

        List<String> reasons = new ArrayList<>();
        if (delayDays > 0) {
            dto.setDelayProbability(Math.min(95, (int)(60 + delayDays * 4)));
            reasons.add(String.format("Current delivery velocity (%.1f hrs/day) is lower than required burn rate.", velocity));
            if (delayedTasks > 0) {
                reasons.add(String.format("%d task(s) currently exceed planned timeline.", delayedTasks));
            }
            if (blockedTasks > 0) {
                reasons.add(String.format("%d task(s) blocked by unresolved dependencies.", blockedTasks));
            }
            dto.setMainCause("Database and Backend architecture integration lag behind planned milestones.");
        } else {
            dto.setDelayProbability(15);
            dto.setMainCause("Project progress is on track with current velocity.");
            reasons.add("Task completion velocity satisfies deadline constraints.");
        }
        dto.setReasons(reasons);
        dto.setConfidenceScore(tasks.size() > 5 ? 85 : 65);

        // Update project predicted date
        project.setPredictedCompletionDate(predictedCompletion);
        projectRepository.save(project);

        return dto;
    }
}
