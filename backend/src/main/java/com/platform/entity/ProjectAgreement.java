package com.platform.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "project_agreements")
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectAgreement {

    public enum AgreementStatus {
        DRAFT,
        SENT_TO_CLIENT,
        CLIENT_REVIEW,
        CHANGES_REQUESTED,
        RESUBMITTED,
        CLIENT_APPROVED,
        ACTIVE,
        LOCKED
    }

    @Id
    private String id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id", nullable = false, unique = true)
    private Project project;

    private int version = 1;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private AgreementStatus status = AgreementStatus.DRAFT;

    @Column(name = "total_value", precision = 14, scale = 2, nullable = false)
    private BigDecimal totalValue = BigDecimal.ZERO;

    @Column(nullable = false, length = 10)
    private String currency = "USD";

    @Column(name = "effective_date")
    private LocalDate effectiveDate;

    @Column(name = "baseline_start_date", nullable = false)
    private LocalDate baselineStartDate;

    @Column(name = "baseline_end_date", nullable = false)
    private LocalDate baselineEndDate;

    @Column(name = "current_forecast_end_date", nullable = false)
    private LocalDate currentForecastEndDate;

    @Column(name = "verified_blocking_delay_days", nullable = false)
    private int verifiedBlockingDelayDays = 0;

    @Column(name = "delay_attribution", columnDefinition = "TEXT")
    private String delayAttribution;

    @Column(name = "scope_objective", columnDefinition = "TEXT")
    private String scopeObjective;

    @Column(name = "included_modules", columnDefinition = "TEXT")
    private String includedModules;

    @Column(name = "excluded_modules", columnDefinition = "TEXT")
    private String excludedModules;

    @Column(columnDefinition = "TEXT")
    private String assumptions;

    @Column(name = "agreed_deliverables", columnDefinition = "TEXT")
    private String agreedDeliverables;

    @Column(name = "review_period_days")
    private int reviewPeriodDays = 5;

    @Column(name = "approval_period_days")
    private int approvalPeriodDays = 3;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "approved_by_manager")
    private User approvedByManager;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "approved_by_client")
    private User approvedByClient;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "agreement", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<AgreementMilestone> milestones = new ArrayList<>();

    @OneToMany(mappedBy = "agreement", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<PaymentMilestone> paymentMilestones = new ArrayList<>();

    @OneToMany(mappedBy = "agreement", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<AgreementResponsibility> responsibilities = new ArrayList<>();

    @OneToMany(mappedBy = "agreement", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<AgreementAmendment> amendments = new ArrayList<>();

    public ProjectAgreement() {}

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public int getVersion() { return version; }
    public void setVersion(int version) { this.version = version; }

    public AgreementStatus getStatus() { return status; }
    public void setStatus(AgreementStatus status) { this.status = status; }

    public BigDecimal getTotalValue() { return totalValue; }
    public void setTotalValue(BigDecimal totalValue) { this.totalValue = totalValue; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public LocalDate getEffectiveDate() { return effectiveDate; }
    public void setEffectiveDate(LocalDate effectiveDate) { this.effectiveDate = effectiveDate; }

    public LocalDate getBaselineStartDate() { return baselineStartDate; }
    public void setBaselineStartDate(LocalDate baselineStartDate) { this.baselineStartDate = baselineStartDate; }

    public LocalDate getBaselineEndDate() { return baselineEndDate; }
    public void setBaselineEndDate(LocalDate baselineEndDate) { this.baselineEndDate = baselineEndDate; }

    public LocalDate getCurrentForecastEndDate() { return currentForecastEndDate; }
    public void setCurrentForecastEndDate(LocalDate currentForecastEndDate) { this.currentForecastEndDate = currentForecastEndDate; }

    public int getVerifiedBlockingDelayDays() { return verifiedBlockingDelayDays; }
    public void setVerifiedBlockingDelayDays(int verifiedBlockingDelayDays) { this.verifiedBlockingDelayDays = verifiedBlockingDelayDays; }

    public String getDelayAttribution() { return delayAttribution; }
    public void setDelayAttribution(String delayAttribution) { this.delayAttribution = delayAttribution; }

    public String getScopeObjective() { return scopeObjective; }
    public void setScopeObjective(String scopeObjective) { this.scopeObjective = scopeObjective; }

    public String getIncludedModules() { return includedModules; }
    public void setIncludedModules(String includedModules) { this.includedModules = includedModules; }

    public String getExcludedModules() { return excludedModules; }
    public void setExcludedModules(String excludedModules) { this.excludedModules = excludedModules; }

    public String getAssumptions() { return assumptions; }
    public void setAssumptions(String assumptions) { this.assumptions = assumptions; }

    public String getAgreedDeliverables() { return agreedDeliverables; }
    public void setAgreedDeliverables(String agreedDeliverables) { this.agreedDeliverables = agreedDeliverables; }

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }

    public User getApprovedByManager() { return approvedByManager; }
    public void setApprovedByManager(User approvedByManager) { this.approvedByManager = approvedByManager; }

    public User getApprovedByClient() { return approvedByClient; }
    public void setApprovedByClient(User approvedByClient) { this.approvedByClient = approvedByClient; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public int getReviewPeriodDays() { return reviewPeriodDays; }
    public void setReviewPeriodDays(int reviewPeriodDays) { this.reviewPeriodDays = reviewPeriodDays; }

    public int getApprovalPeriodDays() { return approvalPeriodDays; }
    public void setApprovalPeriodDays(int approvalPeriodDays) { this.approvalPeriodDays = approvalPeriodDays; }

    public List<AgreementMilestone> getMilestones() { return milestones; }
    public void setMilestones(List<AgreementMilestone> milestones) { this.milestones = milestones; }

    public List<PaymentMilestone> getPaymentMilestones() { return paymentMilestones; }
    public void setPaymentMilestones(List<PaymentMilestone> paymentMilestones) { this.paymentMilestones = paymentMilestones; }

    public List<AgreementResponsibility> getResponsibilities() { return responsibilities; }
    public void setResponsibilities(List<AgreementResponsibility> responsibilities) { this.responsibilities = responsibilities; }

    public List<AgreementAmendment> getAmendments() { return amendments; }
    public void setAmendments(List<AgreementAmendment> amendments) { this.amendments = amendments; }
}
