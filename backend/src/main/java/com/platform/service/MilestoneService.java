package com.platform.service;

import com.platform.entity.Milestone;
import com.platform.entity.Task;
import com.platform.exception.ResourceNotFoundException;
import com.platform.repository.MilestoneRepository;
import com.platform.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;
    private final TaskRepository taskRepository;

    public MilestoneService(MilestoneRepository milestoneRepository, TaskRepository taskRepository) {
        this.milestoneRepository = milestoneRepository;
        this.taskRepository = taskRepository;
    }

    public List<Milestone> getMilestonesForProject(String projectId) {
        return milestoneRepository.findByProjectIdOrderByOrderIndexAsc(projectId);
    }

    @Transactional
    public Milestone createMilestone(Milestone milestone) {
        return milestoneRepository.save(milestone);
    }

    @Transactional
    public Milestone updateMilestone(String id, Milestone updated) {
        Milestone m = milestoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone not found: " + id));
        m.setName(updated.getName());
        m.setDescription(updated.getDescription());
        m.setDueDate(updated.getDueDate());
        m.setStatus(updated.getStatus());
        return milestoneRepository.save(m);
    }

    @Transactional
    public void recalculateMilestoneProgress(String milestoneId) {
        List<Task> tasks = taskRepository.findByMilestoneId(milestoneId);
        if (tasks.isEmpty()) return;

        double totalHours = tasks.stream().mapToDouble(Task::getEstimatedHours).sum();
        double completedHours = tasks.stream().mapToDouble(t -> (t.getProgress() / 100.0) * t.getEstimatedHours()).sum();
        int progress = totalHours > 0 ? (int) Math.round((completedHours / totalHours) * 100.0) : 0;

        milestoneRepository.findById(milestoneId).ifPresent(m -> {
            m.setProgress(progress);
            if (progress == 100) {
                m.setStatus(Milestone.MilestoneStatus.COMPLETED);
            } else if (progress > 0) {
                m.setStatus(Milestone.MilestoneStatus.IN_PROGRESS);
            }
            milestoneRepository.save(m);
        });
    }
}
