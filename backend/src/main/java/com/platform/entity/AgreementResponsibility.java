package com.platform.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "agreement_responsibilities")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AgreementResponsibility {

    public enum OwnerRole {
        CLIENT,
        MANAGER,
        TEAM,
        DEVELOPMENT_TEAM,
        DEVELOPER
    }

    public enum ResponsibilityStatus {
        PENDING,
        IN_PROGRESS,
        AGREED,
        COMPLETED,
        DELAYED,
        BLOCKED,
        OVERDUE,
        WAIVED
    }

    @Id
    private String id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agreement_id", nullable = false)
    private ProjectAgreement agreement;

    @Enumerated(EnumType.STRING)
    @Column(name = "owner_role", nullable = false, length = 50)
    private OwnerRole ownerRole = OwnerRole.CLIENT;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id")
    private User owner;

    private String ownerName;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(columnDefinition = "TEXT")
    private String impactIfDelayed;

    private String linkedMilestone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ResponsibilityStatus status = ResponsibilityStatus.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public AgreementResponsibility() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public ProjectAgreement getAgreement() { return agreement; }
    public void setAgreement(ProjectAgreement agreement) { this.agreement = agreement; }

    public OwnerRole getOwnerRole() { return ownerRole; }
    public void setOwnerRole(OwnerRole ownerRole) { this.ownerRole = ownerRole; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public ResponsibilityStatus getStatus() { return status; }
    public void setStatus(ResponsibilityStatus status) { this.status = status; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getImpactIfDelayed() { return impactIfDelayed; }
    public void setImpactIfDelayed(String impactIfDelayed) { this.impactIfDelayed = impactIfDelayed; }

    public String getLinkedMilestone() { return linkedMilestone; }
    public void setLinkedMilestone(String linkedMilestone) { this.linkedMilestone = linkedMilestone; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
