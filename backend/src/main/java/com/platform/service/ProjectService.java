package com.platform.service;

import com.platform.entity.Project;
import com.platform.entity.Task;
import com.platform.entity.User;
import com.platform.exception.ResourceNotFoundException;
import com.platform.repository.ProjectRepository;
import com.platform.repository.TaskRepository;
import com.platform.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;
    private final RiskEngineService riskEngineService;

    public ProjectService(ProjectRepository projectRepository,
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

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(String id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + id));
    }

    public List<Project> getProjectsForUser(User user) {
        if (user.getRole() == com.platform.entity.Role.ADMIN || user.getRole() == com.platform.entity.Role.EXECUTIVE) {
            return projectRepository.findAll();
        } else if (user.getRole() == com.platform.entity.Role.CLIENT) {
            return projectRepository.findByClientId(user.getId());
        } else if (user.getRole() == com.platform.entity.Role.PROJECT_MANAGER) {
            return projectRepository.findByProjectManagerId(user.getId());
        } else {
            // For employee, return all projects they have tasks in, or all projects
            return projectRepository.findAll();
        }
    }

    @Transactional
    public Project createProject(Project project, User creator) {
        project.setProjectManager(creator);
        Project saved = projectRepository.save(project);
        auditService.log(saved.getId(), creator, "PROJECT_CREATED", "PROJECT", saved.getId(), null, saved.getName(), "Created project " + saved.getName());
        return saved;
    }

    @Transactional
    public Project updateProject(String id, Project updated, User actor) {
        Project existing = getProjectById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setStatus(updated.getStatus());
        existing.setPriority(updated.getPriority());
        existing.setStartDate(updated.getStartDate());
        existing.setEndDate(updated.getEndDate());
        Project saved = projectRepository.save(existing);
        auditService.log(id, actor, "PROJECT_UPDATED", "PROJECT", id, null, null, "Updated project details");
        return saved;
    }

    @Transactional
    public void recalculateProjectProgress(String projectId) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        if (tasks.isEmpty()) return;

        double totalHours = tasks.stream().mapToDouble(Task::getEstimatedHours).sum();
        double completedHours = tasks.stream().mapToDouble(t -> (t.getProgress() / 100.0) * t.getEstimatedHours()).sum();

        int progress = totalHours > 0 ? (int) Math.round((completedHours / totalHours) * 100.0) : 0;

        projectRepository.findById(projectId).ifPresent(p -> {
            p.setOverallProgress(progress);
            projectRepository.save(p);
        });

        riskEngineService.recalculateProjectRisks(projectId);
    }
}
