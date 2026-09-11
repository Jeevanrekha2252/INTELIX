package com.platform.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "agreement_amendments")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AgreementAmendment {

    public enum AmendmentCategory {
        SCOPE,
        DEADLINE,
        PAYMENT,
        MILESTONE,
        RESPONSIBILITY
    }

    public enum AmendmentStatus {
        REQUESTED,
        MANAGER_APPROVED,
        CLIENT_REVIEW,
        APPROVED,
        REJECTED
    }

    @Id
    private String id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agreement_id", nullable = false)
    private ProjectAgreement agreement;

    @Column(name = "amendment_number", nullable = false)
    private int amendmentNumber = 1;

    @Column(nullable = false, length = 200)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private AmendmentCategory category = AmendmentCategory.SCOPE;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String reason;

    @Column(name = "old_value", columnDefinition = "TEXT", nullable = false)
    private String oldValue;

    @Column(name = "new_value", columnDefinition = "TEXT", nullable = false)
    private String newValue;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "requested_by", nullable = false)
    private User requestedBy;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private AmendmentStatus status = AmendmentStatus.REQUESTED;

    @Column(name = "effective_date")
    private LocalDate effectiveDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    public AgreementAmendment() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public ProjectAgreement getAgreement() { return agreement; }
    public void setAgreement(ProjectAgreement agreement) { this.agreement = agreement; }

    public int getAmendmentNumber() { return amendmentNumber; }
    public void setAmendmentNumber(int amendmentNumber) { this.amendmentNumber = amendmentNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public AmendmentCategory getCategory() { return category; }
    public void setCategory(AmendmentCategory category) { this.category = category; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getOldValue() { return oldValue; }
    public void setOldValue(String oldValue) { this.oldValue = oldValue; }

    public String getNewValue() { return newValue; }
    public void setNewValue(String newValue) { this.newValue = newValue; }

    public User getRequestedBy() { return requestedBy; }
    public void setRequestedBy(User requestedBy) { this.requestedBy = requestedBy; }

    public User getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(User reviewedBy) { this.reviewedBy = reviewedBy; }

    public AmendmentStatus getStatus() { return status; }
    public void setStatus(AmendmentStatus status) { this.status = status; }

    public LocalDate getEffectiveDate() { return effectiveDate; }
    public void setEffectiveDate(LocalDate effectiveDate) { this.effectiveDate = effectiveDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
}
