package com.platform.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "risk_assessments")
public class RiskAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String projectId;

    private String taskId;

    @Column(nullable = false)
    private int riskScore; // 0 - 100

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RiskLevel riskLevel = RiskLevel.LOW;

    private double progressRisk;
    private double deadlineRisk;
    private double dependencyRisk;
    private double workloadRisk;
    private double blockerRisk;

    private int confidenceScore = 85;
    private String confidenceRating = "GOOD";

    @Column(length = 4000)
    private String explanation; // Semicolon or JSON separated

    @Column(length = 2000)
    private String recommendedAction;

    @Column(nullable = false)
    private LocalDateTime calculatedAt = LocalDateTime.now();

    public RiskAssessment() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }

    public String getTaskId() { return taskId; }
    public void setTaskId(String taskId) { this.taskId = taskId; }

    public int getRiskScore() { return riskScore; }
    public void setRiskScore(int riskScore) { this.riskScore = riskScore; }

    public RiskLevel getRiskLevel() { return riskLevel; }
    public void setRiskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; }

    public double getProgressRisk() { return progressRisk; }
    public void setProgressRisk(double progressRisk) { this.progressRisk = progressRisk; }

    public double getDeadlineRisk() { return deadlineRisk; }
    public void setDeadlineRisk(double deadlineRisk) { this.deadlineRisk = deadlineRisk; }

    public double getDependencyRisk() { return dependencyRisk; }
    public void setDependencyRisk(double dependencyRisk) { this.dependencyRisk = dependencyRisk; }

    public double getWorkloadRisk() { return workloadRisk; }
    public void setWorkloadRisk(double workloadRisk) { this.workloadRisk = workloadRisk; }

    public double getBlockerRisk() { return blockerRisk; }
    public void setBlockerRisk(double blockerRisk) { this.blockerRisk = blockerRisk; }

    public int getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(int confidenceScore) { this.confidenceScore = confidenceScore; }

    public String getConfidenceRating() { return confidenceRating; }
    public void setConfidenceRating(String confidenceRating) { this.confidenceRating = confidenceRating; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getRecommendedAction() { return recommendedAction; }
    public void setRecommendedAction(String recommendedAction) { this.recommendedAction = recommendedAction; }

    public LocalDateTime getCalculatedAt() { return calculatedAt; }
    public void setCalculatedAt(LocalDateTime calculatedAt) { this.calculatedAt = calculatedAt; }
}
