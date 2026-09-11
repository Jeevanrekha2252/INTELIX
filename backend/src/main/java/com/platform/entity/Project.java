package com.platform.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String projectKey;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id")
    private User client;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "manager_id")
    private User projectManager;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status = ProjectStatus.PLANNING;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.MEDIUM;

    @Column(nullable = false)
    private int overallProgress = 0;

    @Column(nullable = false)
    private int healthScore = 100;

    @Column(nullable = false)
    private String healthStatus = "HEALTHY";

    private LocalDate predictedCompletionDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RiskLevel riskLevel = RiskLevel.LOW;

    private Double budget = 1250000.0;

    @Column(columnDefinition = "TEXT")
    private String projectObjective;

    private String category = "General";

    private String projectType = "Fixed Price";

    private String timezone = "UTC+05:30";

    @Column(nullable = false)
    private int currentWizardStep = 1;

    private String tags;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum ProjectStatus {
        DRAFT_SETUP, PLANNING, AGREEMENT_PENDING, ACTIVE, ON_HOLD, COMPLETED, CANCELLED
    }

    public enum Priority {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public Project() {}

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getProjectKey() { return projectKey; }
    public void setProjectKey(String projectKey) { this.projectKey = projectKey; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public User getClient() { return client; }
    public void setClient(User client) { this.client = client; }

    public User getProjectManager() { return projectManager; }
    public void setProjectManager(User projectManager) { this.projectManager = projectManager; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public ProjectStatus getStatus() { return status; }
    public void setStatus(ProjectStatus status) { this.status = status; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public int getOverallProgress() { return overallProgress; }
    public void setOverallProgress(int overallProgress) { this.overallProgress = overallProgress; }

    public int getHealthScore() { return healthScore; }
    public void setHealthScore(int healthScore) { this.healthScore = healthScore; }

    public String getHealthStatus() { return healthStatus; }
    public void setHealthStatus(String healthStatus) { this.healthStatus = healthStatus; }

    public LocalDate getPredictedCompletionDate() { return predictedCompletionDate; }
    public void setPredictedCompletionDate(LocalDate predictedCompletionDate) { this.predictedCompletionDate = predictedCompletionDate; }

    public RiskLevel getRiskLevel() { return riskLevel; }
    public void setRiskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Double getBudget() { return budget; }
    public void setBudget(Double budget) { this.budget = budget; }

    public String getProjectObjective() { return projectObjective; }
    public void setProjectObjective(String projectObjective) { this.projectObjective = projectObjective; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getProjectType() { return projectType; }
    public void setProjectType(String projectType) { this.projectType = projectType; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }

    public int getCurrentWizardStep() { return currentWizardStep; }
    public void setCurrentWizardStep(int currentWizardStep) { this.currentWizardStep = currentWizardStep; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    // Frontend compatibility helpers
    public User getOwner() { return this.projectManager; }
    public String getClientName() { return this.client != null ? this.client.getFullName() : "University Council"; }
    public int getOverallHealthScore() { return this.healthScore; }
    public Double getAllocatedBudget() { return this.budget != null ? this.budget : 1250000.0; }
    public LocalDate getTargetCompletionDate() { return this.endDate; }
}
