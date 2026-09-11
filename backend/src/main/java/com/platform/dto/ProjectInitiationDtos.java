package com.platform.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.platform.entity.AgreementResponsibility;
import com.platform.entity.PaymentMilestone;
import com.platform.entity.Project;
import com.platform.entity.Task;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ProjectInitiationDtos {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ProjectInitiationRequest {
        public String projectId; // null if creating fresh, UUID if updating draft
        public String action = "SAVE_DRAFT"; // "SAVE_DRAFT" or "SUBMIT_TO_CLIENT"
        public int currentStep = 1;

        public InitiationProjectInfo basicInfo = new InitiationProjectInfo();
        public InitiationClientInfo client = new InitiationClientInfo();
        public List<InitiationTeamInfo> teams = new ArrayList<>();
        public List<InitiationMilestoneInfo> milestones = new ArrayList<>();
        public List<InitiationTaskInfo> tasks = new ArrayList<>();
        public InitiationTermsInfo terms = new InitiationTermsInfo();
        public InitiationPaymentInfo payments = new InitiationPaymentInfo();
        public List<InitiationResponsibilityInfo> responsibilities = new ArrayList<>();
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class InitiationProjectInfo {
        public String title;
        public String projectKey;
        public String description;
        public String projectObjective;
        public String category = "General";
        public LocalDate startDate;
        public LocalDate endDate;
        public Project.Priority priority = Project.Priority.MEDIUM;
        public String projectType = "Fixed Price";
        public String timezone = "UTC+05:30";
        public Double budget = 10000.0;
        public String tags;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class InitiationClientInfo {
        public String clientId; // ID of existing client
        public String name;
        public String email;
        public String phone;
        public String organization;
        public String designation;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class InitiationTeamInfo {
        public String id;
        public String name;
        public String description;
        public String leadId;
        public List<String> memberIds = new ArrayList<>();
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class InitiationMilestoneInfo {
        public String id;
        public String name;
        public String description;
        public LocalDate dueDate;
        public String deliverables;
        public String acceptanceCriteria;
        public String priority = "HIGH";
        public int orderIndex = 0;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class InitiationTaskInfo {
        public String id;
        public String title;
        public String description;
        public String assigneeId;
        public String teamName;
        public Task.Priority priority = Task.Priority.MEDIUM;
        public LocalDate startDate;
        public LocalDate dueDate;
        public double estimatedHours = 8.0;
        public String dependencyPredecessorTitle;
        public Integer predecessorIndex;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class InitiationTermsInfo {
        public String scopeObjective;
        public String includedModules;
        public String excludedModules;
        public String assumptions;
        public String agreedDeliverables;
        public int reviewPeriodDays = 5;
        public int approvalPeriodDays = 3;
        public String delayAttribution = "None";
        public String generalTerms;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class InitiationPaymentInfo {
        public BigDecimal totalValue = BigDecimal.valueOf(10000);
        public String currency = "USD";
        public List<InitiationPaymentMilestoneInfo> paymentMilestones = new ArrayList<>();
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class InitiationPaymentMilestoneInfo {
        public String id;
        public String title;
        public PaymentMilestone.TriggerType triggerType = PaymentMilestone.TriggerType.PERCENTAGE;
        public Double triggerValue;
        public BigDecimal paymentPercentage = BigDecimal.ZERO;
        public BigDecimal paymentAmount = BigDecimal.ZERO;
        public String dueDate;
        public String notes;
        public String status = "PENDING";
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class InitiationResponsibilityInfo {
        public String id;
        public String title;
        public String description;
        public AgreementResponsibility.OwnerRole ownerRole = AgreementResponsibility.OwnerRole.CLIENT;
        public String ownerName;
        public String dueDate;
        public String impactIfDelayed;
        public String linkedMilestoneName;
        public AgreementResponsibility.ResponsibilityStatus status = AgreementResponsibility.ResponsibilityStatus.PENDING;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ProjectInitiationResponse {
        public String projectId;
        public String projectKey;
        public String name;
        public String status;
        public String agreementId;
        public String agreementStatus;
        public int currentStep;
        public String message;
        public List<String> validationErrors = new ArrayList<>();
        public boolean success = true;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class InitiationDraftSummary {
        public String projectId;
        public String projectKey;
        public String name;
        public String description;
        public int currentStep;
        public String status;
        public String clientName;
        public Double budget;
        public LocalDateTime updatedAt;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class EmployeeWorkloadDTO {
        public String userId;
        public String fullName;
        public String email;
        public String avatarUrl;
        public String title;
        public String role;
        public String department;
        public int currentWorkloadPercentage;
        public int activeTasksCount;
        public int capacityHoursPerWeek = 40;
        public double estimatedHours;
        public String workloadStatus; // UNDERUTILIZED, HEALTHY, HIGH, OVERLOADED
        public List<String> activeProjects = new ArrayList<>();
    }
}
