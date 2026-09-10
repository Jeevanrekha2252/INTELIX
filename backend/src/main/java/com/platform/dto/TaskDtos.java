package com.platform.dto;

import com.platform.entity.Task;
import java.time.LocalDate;

public class TaskDtos {

    public static class CreateTaskRequest {
        private String projectId;
        private String milestoneId;
        private String teamId;
        private String assigneeId;
        private String title;
        private String description;
        private Task.Priority priority = Task.Priority.MEDIUM;
        private Task.TaskStatus status = Task.TaskStatus.TO_DO;
        private LocalDate startDate;
        private LocalDate dueDate;
        private double estimatedHours = 8.0;

        public String getProjectId() { return projectId; }
        public void setProjectId(String projectId) { this.projectId = projectId; }
        public String getMilestoneId() { return milestoneId; }
        public void setMilestoneId(String milestoneId) { this.milestoneId = milestoneId; }
        public String getTeamId() { return teamId; }
        public void setTeamId(String teamId) { this.teamId = teamId; }
        public String getAssigneeId() { return assigneeId; }
        public void setAssigneeId(String assigneeId) { this.assigneeId = assigneeId; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public Task.Priority getPriority() { return priority; }
        public void setPriority(Task.Priority priority) { this.priority = priority; }
        public Task.TaskStatus getStatus() { return status; }
        public void setStatus(Task.TaskStatus status) { this.status = status; }
        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
        public LocalDate getDueDate() { return dueDate; }
        public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
        public double getEstimatedHours() { return estimatedHours; }
        public void setEstimatedHours(double estimatedHours) { this.estimatedHours = estimatedHours; }
    }

    public static class UpdateTaskRequest {
        private String title;
        private String description;
        private String milestoneId;
        private String teamId;
        private String assigneeId;
        private Task.Priority priority;
        private Task.TaskStatus status;
        private Integer progress;
        private LocalDate startDate;
        private LocalDate dueDate;
        private Double estimatedHours;
        private Double actualHours;
        private Boolean isBlocked;
        private String blockerReason;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getMilestoneId() { return milestoneId; }
        public void setMilestoneId(String milestoneId) { this.milestoneId = milestoneId; }
        public String getTeamId() { return teamId; }
        public void setTeamId(String teamId) { this.teamId = teamId; }
        public String getAssigneeId() { return assigneeId; }
        public void setAssigneeId(String assigneeId) { this.assigneeId = assigneeId; }
        public Task.Priority getPriority() { return priority; }
        public void setPriority(Task.Priority priority) { this.priority = priority; }
        public Task.TaskStatus getStatus() { return status; }
        public void setStatus(Task.TaskStatus status) { this.status = status; }
        public Integer getProgress() { return progress; }
        public void setProgress(Integer progress) { this.progress = progress; }
        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
        public LocalDate getDueDate() { return dueDate; }
        public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
        public Double getEstimatedHours() { return estimatedHours; }
        public void setEstimatedHours(Double estimatedHours) { this.estimatedHours = estimatedHours; }
        public Double getActualHours() { return actualHours; }
        public void setActualHours(Double actualHours) { this.actualHours = actualHours; }
        public Boolean getIsBlocked() { return isBlocked; }
        public void setIsBlocked(Boolean blocked) { isBlocked = blocked; }
        public String getBlockerReason() { return blockerReason; }
        public void setBlockerReason(String blockerReason) { this.blockerReason = blockerReason; }
    }

    public static class ProgressUpdateRequest {
        private int progress;
        private Double actualHours;

        public int getProgress() { return progress; }
        public void setProgress(int progress) { this.progress = progress; }
        public Double getActualHours() { return actualHours; }
        public void setActualHours(Double actualHours) { this.actualHours = actualHours; }
    }

    public static class StatusUpdateRequest {
        private Task.TaskStatus status;

        public Task.TaskStatus getStatus() { return status; }
        public void setStatus(Task.TaskStatus status) { this.status = status; }
    }

    public static class BlockerReportRequest {
        private boolean isBlocked;
        private String blockerReason;

        public boolean isBlocked() { return isBlocked; }
        public void setBlocked(boolean blocked) { isBlocked = blocked; }
        public String getBlockerReason() { return blockerReason; }
        public void setBlockerReason(String blockerReason) { this.blockerReason = blockerReason; }
    }
}
