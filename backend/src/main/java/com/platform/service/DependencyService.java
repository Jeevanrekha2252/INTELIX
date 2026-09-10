package com.platform.service;

import com.platform.entity.Project;
import com.platform.entity.RiskLevel;
import com.platform.entity.Task;
import com.platform.entity.TaskDependency;
import com.platform.exception.BadRequestException;
import com.platform.repository.TaskDependencyRepository;
import com.platform.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class DependencyService {

    private final TaskDependencyRepository dependencyRepository;
    private final TaskRepository taskRepository;

    public DependencyService(TaskDependencyRepository dependencyRepository, TaskRepository taskRepository) {
        this.dependencyRepository = dependencyRepository;
        this.taskRepository = taskRepository;
    }

    public static class DependencyDetailDTO {
        public String id;
        public String predecessorTaskId;
        public String predecessorTaskKey;
        public String predecessorTitle;
        public Task.TaskStatus predecessorStatus;
        public int predecessorProgress;
        public LocalDate predecessorDueDate;
        public String successorTaskId;
        public String successorTaskKey;
        public String successorTitle;
        public Task.TaskStatus successorStatus;
        public int successorProgress;
        public LocalDate successorDueDate;
        public String dependencyType;
        public long impactDelayDays;
        public RiskLevel impactRiskLevel;
    }

    public List<DependencyDetailDTO> getProjectDependencies(String projectId) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        Map<String, Task> taskMap = new HashMap<>();
        tasks.forEach(t -> taskMap.put(t.getId(), t));

        List<DependencyDetailDTO> results = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (Task task : tasks) {
            List<TaskDependency> deps = dependencyRepository.findBySuccessorTaskId(task.getId());
            for (TaskDependency dep : deps) {
                Task pred = taskMap.get(dep.getPredecessorTaskId());
                if (pred != null) {
                    DependencyDetailDTO dto = new DependencyDetailDTO();
                    dto.id = dep.getId();
                    dto.predecessorTaskId = pred.getId();
                    dto.predecessorTaskKey = pred.getTaskKey();
                    dto.predecessorTitle = pred.getTitle();
                    dto.predecessorStatus = pred.getStatus();
                    dto.predecessorProgress = pred.getProgress();
                    dto.predecessorDueDate = pred.getDueDate();

                    dto.successorTaskId = task.getId();
                    dto.successorTaskKey = task.getTaskKey();
                    dto.successorTitle = task.getTitle();
                    dto.successorStatus = task.getStatus();
                    dto.successorProgress = task.getProgress();
                    dto.successorDueDate = task.getDueDate();
                    dto.dependencyType = dep.getDependencyType();

                    // Calculate impact delay: if predecessor is behind schedule or overdue
                    long delay = 0;
                    if (pred.getStatus() != Task.TaskStatus.COMPLETED) {
                        if (pred.getDueDate().isBefore(today)) {
                            delay = ChronoUnit.DAYS.between(pred.getDueDate(), today);
                        } else if (pred.getProgress() < 40 && ChronoUnit.DAYS.between(today, pred.getDueDate()) <= 3) {
                            delay = 3;
                        }
                        if (pred.isBlocked()) {
                            delay += 2;
                        }
                    }
                    dto.impactDelayDays = delay;
                    dto.impactRiskLevel = delay > 3 ? RiskLevel.HIGH : (delay > 0 ? RiskLevel.MEDIUM : RiskLevel.LOW);

                    results.add(dto);
                }
            }
        }
        return results;
    }

    @Transactional
    public TaskDependency createDependency(String predecessorTaskId, String successorTaskId) {
        if (predecessorTaskId.equals(successorTaskId)) {
            throw new BadRequestException("Task cannot depend on itself");
        }

        if (dependencyRepository.existsByPredecessorTaskIdAndSuccessorTaskId(predecessorTaskId, successorTaskId)) {
            throw new BadRequestException("Dependency relationship already exists");
        }

        // Cycle check
        if (hasCycle(predecessorTaskId, successorTaskId)) {
            throw new BadRequestException("Circular dependency detected! Cannot create this link.");
        }

        TaskDependency dep = new TaskDependency(predecessorTaskId, successorTaskId);
        return dependencyRepository.save(dep);
    }

    @Transactional
    public void deleteDependency(String dependencyId) {
        dependencyRepository.deleteById(dependencyId);
    }

    private boolean hasCycle(String predecessorId, String successorId) {
        // BFS to check if successor can already reach predecessor
        Set<String> visited = new HashSet<>();
        Queue<String> queue = new LinkedList<>();
        queue.add(successorId);

        while (!queue.isEmpty()) {
            String curr = queue.poll();
            if (curr.equals(predecessorId)) {
                return true;
            }
            if (!visited.contains(curr)) {
                visited.add(curr);
                List<TaskDependency> deps = dependencyRepository.findByPredecessorTaskId(curr);
                for (TaskDependency dep : deps) {
                    queue.add(dep.getSuccessorTaskId());
                }
            }
        }
        return false;
    }
}
