package com.platform.dto;

import com.platform.entity.ChangeRequest;
import com.platform.entity.DeliverableApproval;
import com.platform.entity.Project;
import com.platform.entity.Task;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class PlatformDtos {

    public static class DependencyCreateRequest {
        private String predecessorTaskId;
        private String successorTaskId;

        public String getPredecessorTaskId() { return predecessorTaskId; }
        public void setPredecessorTaskId(String predecessorTaskId) { this.predecessorTaskId = predecessorTaskId; }
        public String getSuccessorTaskId() { return successorTaskId; }
        public void setSuccessorTaskId(String successorTaskId) { this.successorTaskId = successorTaskId; }
    }

    public static class ChangeRequestCreate {
        private String projectId;
        private String title;
        private String description;
        private String module;
        private Task.Priority priority = Task.Priority.MEDIUM;

        public String getProjectId() { return projectId; }
        public void setProjectId(String projectId) { this.projectId = projectId; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getModule() { return module; }
        public void setModule(String module) { this.module = module; }
        public Task.Priority getPriority() { return priority; }
        public void setPriority(Task.Priority priority) { this.priority = priority; }
    }

    public static class ChangeRequestReview {
        private ChangeRequest.ChangeRequestStatus status;
        private String managerResponse;

        public ChangeRequest.ChangeRequestStatus getStatus() { return status; }
        public void setStatus(ChangeRequest.ChangeRequestStatus status) { this.status = status; }
        public String getManagerResponse() { return managerResponse; }
        public void setManagerResponse(String managerResponse) { this.managerResponse = managerResponse; }
    }

    public static class DeliverableDecision {
        private DeliverableApproval.ApprovalStatus status;
        private String comments;

        public DeliverableApproval.ApprovalStatus getStatus() { return status; }
        public void setStatus(DeliverableApproval.ApprovalStatus status) { this.status = status; }
        public String getComments() { return comments; }
        public void setComments(String comments) { this.comments = comments; }

        public void setDecision(String decision) {
            if (decision == null) return;
            if ("APPROVED".equalsIgnoreCase(decision)) {
                this.status = DeliverableApproval.ApprovalStatus.APPROVED;
            } else {
                this.status = DeliverableApproval.ApprovalStatus.CHANGES_REQUESTED;
            }
        }
        public String getDecision() {
            return status != null ? status.name() : null;
        }
    }

    public static class MeetingCreate {
        private String projectId;
        private String title;
        private LocalDateTime scheduledAt;
        private int durationMinutes = 45;
        private String agenda;

        public String getProjectId() { return projectId; }
        public void setProjectId(String projectId) { this.projectId = projectId; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public LocalDateTime getScheduledAt() { return scheduledAt; }
        public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }
        public int getDurationMinutes() { return durationMinutes; }
        public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }
        public String getAgenda() { return agenda; }
        public void setAgenda(String agenda) { this.agenda = agenda; }

        public void setScheduledTime(String time) {
            if (time != null && !time.isBlank()) {
                try {
                    this.scheduledAt = java.time.OffsetDateTime.parse(time).toLocalDateTime();
                } catch (Exception e) {
                    try {
                        this.scheduledAt = LocalDateTime.parse(time);
                    } catch (Exception ignored) {}
                }
            }
        }
    }

    public static class WorkloadMemberDTO {
        private String userId;
        private String fullName;
        private String email;
        private String avatarUrl;
        private String teamName;
        private int activeTasks;
        private double estimatedHours;
        private int capacityHours;
        private int utilizationRate;
        private String utilizationStatus;
        private int overdueTasks;
        private int blockedTasks;

        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getAvatarUrl() { return avatarUrl; }
        public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
        public String getTeamName() { return teamName; }
        public void setTeamName(String teamName) { this.teamName = teamName; }
        public int getActiveTasks() { return activeTasks; }
        public void setActiveTasks(int activeTasks) { this.activeTasks = activeTasks; }
        public double getEstimatedHours() { return estimatedHours; }
        public void setEstimatedHours(double estimatedHours) { this.estimatedHours = estimatedHours; }
        public int getCapacityHours() { return capacityHours; }
        public void setCapacityHours(int capacityHours) { this.capacityHours = capacityHours; }
        public int getUtilizationRate() { return utilizationRate; }
        public void setUtilizationRate(int utilizationRate) { this.utilizationRate = utilizationRate; }
        public String getUtilizationStatus() { return utilizationStatus; }
        public void setUtilizationStatus(String utilizationStatus) { this.utilizationStatus = utilizationStatus; }
        public int getOverdueTasks() { return overdueTasks; }
        public void setOverdueTasks(int overdueTasks) { this.overdueTasks = overdueTasks; }
        public int getBlockedTasks() { return blockedTasks; }
        public void setBlockedTasks(int blockedTasks) { this.blockedTasks = blockedTasks; }
    }

    public static class PredictionDTO {
        private LocalDate originalDeadline;
        private LocalDate predictedCompletionDate;
        private long delayDays;
        private int delayProbability;
        private double currentVelocity;
        private double remainingEffortHours;
        private int confidenceScore;
        private String mainCause;
        private List<String> reasons;

        public LocalDate getOriginalDeadline() { return originalDeadline; }
        public void setOriginalDeadline(LocalDate originalDeadline) { this.originalDeadline = originalDeadline; }
        public LocalDate getPredictedCompletionDate() { return predictedCompletionDate; }
        public void setPredictedCompletionDate(LocalDate predictedCompletionDate) { this.predictedCompletionDate = predictedCompletionDate; }
        public long getDelayDays() { return delayDays; }
        public void setDelayDays(long delayDays) { this.delayDays = delayDays; }
        public int getDelayProbability() { return delayProbability; }
        public void setDelayProbability(int delayProbability) { this.delayProbability = delayProbability; }
        public double getCurrentVelocity() { return currentVelocity; }
        public void setCurrentVelocity(double currentVelocity) { this.currentVelocity = currentVelocity; }
        public double getRemainingEffortHours() { return remainingEffortHours; }
        public void setRemainingEffortHours(double remainingEffortHours) { this.remainingEffortHours = remainingEffortHours; }
        public int getConfidenceScore() { return confidenceScore; }
        public void setConfidenceScore(int confidenceScore) { this.confidenceScore = confidenceScore; }
        public String getMainCause() { return mainCause; }
        public void setMainCause(String mainCause) { this.mainCause = mainCause; }
        public List<String> getReasons() { return reasons; }
        public void setReasons(List<String> reasons) { this.reasons = reasons; }
    }

    public static class AiRecommendationDTO {
        private String id;
        private String title;
        private String reason;
        private List<String> affectedTasks;
        private String expectedBenefit;
        private String urgency;
        private String actionType;
        private Map<String, Object> actionPayload;
        private boolean isApplied;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
        public List<String> getAffectedTasks() { return affectedTasks; }
        public void setAffectedTasks(List<String> affectedTasks) { this.affectedTasks = affectedTasks; }
        public String getExpectedBenefit() { return expectedBenefit; }
        public void setExpectedBenefit(String expectedBenefit) { this.expectedBenefit = expectedBenefit; }
        public String getUrgency() { return urgency; }
        public void setUrgency(String urgency) { this.urgency = urgency; }
        public String getActionType() { return actionType; }
        public void setActionType(String actionType) { this.actionType = actionType; }
        public Map<String, Object> getActionPayload() { return actionPayload; }
        public void setActionPayload(Map<String, Object> actionPayload) { this.actionPayload = actionPayload; }
        public boolean isApplied() { return isApplied; }
        public void setApplied(boolean applied) { isApplied = applied; }
    }
}
