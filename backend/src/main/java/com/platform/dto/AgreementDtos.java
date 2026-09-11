package com.platform.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.platform.entity.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class AgreementDtos {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AgreementCreateRequest {
        public String projectId;
        public BigDecimal totalValue;
        public String currency;
        public LocalDate baselineStartDate;
        public LocalDate baselineEndDate;
        public LocalDate currentForecastEndDate;
        public Integer verifiedBlockingDelayDays;
        public String delayAttribution;
        public Integer reviewPeriodDays;
        public Integer approvalPeriodDays;
        public String scopeObjective;
        public String includedModules;
        public String excludedModules;
        public String assumptions;
        public String agreedDeliverables;
        public List<AgreementMilestoneItem> milestones;
        public List<PaymentScheduleItem> paymentSchedule;
        public List<ResponsibilityItem> responsibilities;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AgreementMilestoneItem {
        public String id;
        public String milestoneId;
        public String name;
        public String description;
        public LocalDate targetDate;
        public String deliverables;
        public String completionRequirement;
        public String acceptanceCriteria;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class PaymentScheduleItem {
        public String id;
        public String title;
        public PaymentMilestone.TriggerType triggerType;
        public Double triggerValue;
        public LocalDate targetDate;
        public BigDecimal paymentPercentage;
        public BigDecimal paymentAmount;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ResponsibilityItem {
        public String id;
        public AgreementResponsibility.OwnerRole ownerRole;
        public String title;
        public String description;
        public LocalDate dueDate;
        public AgreementResponsibility.ResponsibilityStatus status;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AgreementReviewRequest {
        public String decision; // APPROVED or CHANGES_REQUESTED
        public String action;
        public String comments;
        public String reviewNotes;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AmendmentCreateRequest {
        public String title;
        public String fieldName;
        public AgreementAmendment.AmendmentCategory category;
        public String changeCategory;
        public String reason;
        public String oldValue;
        public String newValue;
        public LocalDate effectiveDate;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AmendmentReviewRequest {
        public String decision; // APPROVED or REJECTED
        public String action;
        public Boolean approved;
        public String comments;
        public String reviewNotes;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AgreementDetailResponse {
        public String id;
        public String projectId;
        public String projectKey;
        public String projectName;
        public int version;
        public String status;
        public BigDecimal totalValue;
        public String currency;
        public LocalDate effectiveDate;
        public LocalDate baselineStartDate;
        public LocalDate baselineEndDate;
        public LocalDate currentForecastEndDate;
        public int verifiedBlockingDelayDays;
        public String delayAttribution;
        public int reviewPeriodDays = 5;
        public int approvalPeriodDays = 3;
        public String scopeObjective;
        public String includedModules;
        public String excludedModules;
        public String assumptions;
        public String agreedDeliverables;
        public String createdByName;
        public String approvedByManagerName;
        public String approvedByClientName;
        public LocalDateTime createdAt;
        public LocalDateTime approvedAt;
        public List<AgreementMilestone> milestones;
        public List<PaymentMilestone> paymentMilestones;
        public List<AgreementResponsibility> responsibilities;
        public List<AgreementAmendment> amendments;
        public BigDecimal totalPaidAmount;
        public BigDecimal nextPaymentAmount;
        public Double nextPaymentTrigger;
    }
}
