package com.platform.service;

import com.platform.dto.PlatformDtos;
import com.platform.entity.Task;
import com.platform.entity.TeamMember;
import com.platform.entity.User;
import com.platform.repository.TaskRepository;
import com.platform.repository.TeamMemberRepository;
import com.platform.repository.TeamRepository;
import com.platform.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class WorkloadService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;

    public WorkloadService(UserRepository userRepository,
                           TaskRepository taskRepository,
                           TeamRepository teamRepository,
                           TeamMemberRepository teamMemberRepository) {
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
    }

    public List<PlatformDtos.WorkloadMemberDTO> getProjectWorkload(String projectId) {
        List<User> users = userRepository.findByIsActiveTrue();
        List<Task> allProjectTasks = taskRepository.findByProjectId(projectId);
        LocalDate today = LocalDate.now();

        List<PlatformDtos.WorkloadMemberDTO> result = new ArrayList<>();

        for (User user : users) {
            if (user.getRole() != com.platform.entity.Role.EMPLOYEE) continue;

            List<Task> userTasks = allProjectTasks.stream()
                    .filter(t -> t.getAssignee() != null && t.getAssignee().getId().equals(user.getId()))
                    .toList();

            List<Task> activeTasks = userTasks.stream()
                    .filter(t -> t.getStatus() != Task.TaskStatus.COMPLETED)
                    .toList();

            double estimatedHours = activeTasks.stream().mapToDouble(Task::getEstimatedHours).sum();
            int capacityHours = user.getCapacityHoursPerWeek() > 0 ? user.getCapacityHoursPerWeek() : 40;

            int utilizationRate = (int) Math.round((estimatedHours / capacityHours) * 100.0);
            String status;
            if (utilizationRate < 60) {
                status = "UNDERUTILIZED";
            } else if (utilizationRate <= 90) {
                status = "HEALTHY";
            } else if (utilizationRate <= 100) {
                status = "HIGH";
            } else {
                status = "OVERLOADED";
            }

            int overdue = (int) activeTasks.stream().filter(t -> t.getDueDate().isBefore(today)).count();
            int blocked = (int) activeTasks.stream().filter(Task::isBlocked).count();

            // Find user team name
            String teamName = "Core Engineering";
            List<TeamMember> memberships = teamMemberRepository.findByUserId(user.getId());
            if (!memberships.isEmpty()) {
                teamRepository.findById(memberships.get(0).getTeamId()).ifPresent(t -> {});
            }

            PlatformDtos.WorkloadMemberDTO dto = new PlatformDtos.WorkloadMemberDTO();
            dto.setUserId(user.getId());
            dto.setFullName(user.getFullName());
            dto.setEmail(user.getEmail());
            dto.setAvatarUrl(user.getAvatarUrl());
            dto.setTeamName(user.getTitle() != null ? user.getTitle() : teamName);
            dto.setActiveTasks(activeTasks.size());
            dto.setEstimatedHours(Math.round(estimatedHours * 10.0) / 10.0);
            dto.setCapacityHours(capacityHours);
            dto.setUtilizationRate(utilizationRate);
            dto.setUtilizationStatus(status);
            dto.setOverdueTasks(overdue);
            dto.setBlockedTasks(blocked);

            result.add(dto);
        }

        return result;
    }
}
