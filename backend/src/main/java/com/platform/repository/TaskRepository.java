package com.platform.repository;

import com.platform.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, String> {
    List<Task> findByProjectId(String projectId);
    List<Task> findByAssigneeId(String assigneeId);
    List<Task> findByMilestoneId(String milestoneId);
    List<Task> findByTeamId(String teamId);
    Optional<Task> findByTaskKey(String taskKey);
    List<Task> findByProjectIdAndStatusNot(String projectId, Task.TaskStatus status);
    List<Task> findByDueDateBeforeAndStatusNot(LocalDate date, Task.TaskStatus status);
    List<Task> findByProjectIdAndIsBlockedTrue(String projectId);
}
