package com.platform.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "task_dependencies")
public class TaskDependency {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String predecessorTaskId;

    @Column(nullable = false)
    private String successorTaskId;

    @Column(nullable = false)
    private String dependencyType = "FINISH_TO_START";

    public TaskDependency() {}

    public TaskDependency(String predecessorTaskId, String successorTaskId) {
        this.predecessorTaskId = predecessorTaskId;
        this.successorTaskId = successorTaskId;
        this.dependencyType = "FINISH_TO_START";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPredecessorTaskId() { return predecessorTaskId; }
    public void setPredecessorTaskId(String predecessorTaskId) { this.predecessorTaskId = predecessorTaskId; }

    public String getSuccessorTaskId() { return successorTaskId; }
    public void setSuccessorTaskId(String successorTaskId) { this.successorTaskId = successorTaskId; }

    public String getDependencyType() { return dependencyType; }
    public void setDependencyType(String dependencyType) { this.dependencyType = dependencyType; }
}
