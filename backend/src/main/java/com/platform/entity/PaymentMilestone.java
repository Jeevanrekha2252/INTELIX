package com.platform.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_milestones")
@JsonIgnoreProperties(ignoreUnknown = true)
public class PaymentMilestone {

    public enum TriggerType {
        PERCENTAGE,
        MILESTONE_COMPLETION,
        FIXED_DATE
    }

    public enum PaymentStatus {
        PENDING,
        TRIGGERED,
        AWAITING_PAYMENT,
        INVOICED,
        PAID,
        OVERDUE,
        DISPUTED,
        WAIVED
    }

    @Id
    private String id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agreement_id", nullable = false)
    private ProjectAgreement agreement;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "milestone_id")
    private Milestone milestone;

    @Column(nullable = false, length = 200)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "trigger_type", nullable = false, length = 50)
    private TriggerType triggerType = TriggerType.PERCENTAGE;

    @Column(name = "trigger_value")
    private Double triggerValue; // e.g. 20.0 for 20% completion

    @Column(name = "target_date")
    private LocalDate targetDate;

    @Column(name = "payment_percentage", precision = 5, scale = 2, nullable = false)
    private BigDecimal paymentPercentage;

    @Column(name = "payment_amount", precision = 14, scale = 2, nullable = false)
    private BigDecimal paymentAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(name = "triggered_at")
    private LocalDateTime triggeredAt;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public PaymentMilestone() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public ProjectAgreement getAgreement() { return agreement; }
    public void setAgreement(ProjectAgreement agreement) { this.agreement = agreement; }

    public Milestone getMilestone() { return milestone; }
    public void setMilestone(Milestone milestone) { this.milestone = milestone; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public TriggerType getTriggerType() { return triggerType; }
    public void setTriggerType(TriggerType triggerType) { this.triggerType = triggerType; }

    public Double getTriggerValue() { return triggerValue; }
    public void setTriggerValue(Double triggerValue) { this.triggerValue = triggerValue; }

    public LocalDate getTargetDate() { return targetDate; }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }

    public BigDecimal getPaymentPercentage() { return paymentPercentage; }
    public void setPaymentPercentage(BigDecimal paymentPercentage) { this.paymentPercentage = paymentPercentage; }

    public BigDecimal getPaymentAmount() { return paymentAmount; }
    public void setPaymentAmount(BigDecimal paymentAmount) { this.paymentAmount = paymentAmount; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getTriggeredAt() { return triggeredAt; }
    public void setTriggeredAt(LocalDateTime triggeredAt) { this.triggeredAt = triggeredAt; }

    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
