package com.platform.service;

import com.platform.entity.Milestone;
import com.platform.entity.Project;
import com.platform.entity.Task;
import com.platform.repository.MilestoneRepository;
import com.platform.repository.ProjectRepository;
import com.platform.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final MilestoneRepository milestoneRepository;

    public AnalyticsService(ProjectRepository projectRepository,
                            TaskRepository taskRepository,
                            MilestoneRepository milestoneRepository) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.milestoneRepository = milestoneRepository;
    }

    public Map<String, Object> getProjectAnalytics(String projectId) {
        Project project = projectRepository.findById(projectId).orElseThrow();
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        List<Milestone> milestones = milestoneRepository.findByProjectIdOrderByOrderIndexAsc(projectId);
        LocalDate today = LocalDate.now();

        Map<String, Object> analytics = new HashMap<>();

        // 1. Status Distribution
        Map<String, Integer> statusDist = new HashMap<>();
        for (Task.TaskStatus s : Task.TaskStatus.values()) {
            statusDist.put(s.name(), 0);
        }
        for (Task t : tasks) {
            statusDist.put(t.getStatus().name(), statusDist.getOrDefault(t.getStatus().name(), 0) + 1);
        }
        analytics.put("statusDistribution", statusDist);

        // 2. Priority Distribution
        Map<String, Integer> priorityDist = new HashMap<>();
        for (Task.Priority p : Task.Priority.values()) {
            priorityDist.put(p.name(), 0);
        }
        for (Task t : tasks) {
            priorityDist.put(t.getPriority().name(), priorityDist.getOrDefault(t.getPriority().name(), 0) + 1);
        }
        analytics.put("priorityDistribution", priorityDist);

        // 3. Risk Distribution
        Map<String, Integer> riskDist = new HashMap<>();
        riskDist.put("LOW", 0);
        riskDist.put("MEDIUM", 0);
        riskDist.put("HIGH", 0);
        for (Task t : tasks) {
            String lvl = t.getRiskLevel() != null ? t.getRiskLevel().name() : "LOW";
            riskDist.put(lvl, riskDist.getOrDefault(lvl, 0) + 1);
        }
        analytics.put("riskDistribution", riskDist);

        // 4. Milestone Progress List
        List<Map<String, Object>> milestoneStats = milestones.stream().map(m -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", m.getName());
            map.put("progress", m.getProgress());
            map.put("status", m.getStatus().name());
            map.put("dueDate", m.getDueDate());
            return map;
        }).toList();
        analytics.put("milestoneStats", milestoneStats);

        // 5. Effort Metrics
        double totalEstimated = tasks.stream().mapToDouble(Task::getEstimatedHours).sum();
        double totalActual = tasks.stream().mapToDouble(Task::getActualHours).sum();
        analytics.put("totalEstimatedHours", totalEstimated);
        analytics.put("totalActualHours", totalActual);
        analytics.put("overdueTasksCount", tasks.stream().filter(t -> t.getDueDate().isBefore(today) && t.getStatus() != Task.TaskStatus.COMPLETED).count());
        analytics.put("blockedTasksCount", tasks.stream().filter(Task::isBlocked).count());
        analytics.put("completedTasksCount", tasks.stream().filter(t -> t.getStatus() == Task.TaskStatus.COMPLETED).count());
        analytics.put("totalTasksCount", tasks.size());
        analytics.put("overallProgress", project.getOverallProgress());
        analytics.put("healthScore", project.getHealthScore());

        return analytics;
    }
}
