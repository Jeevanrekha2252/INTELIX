package com.platform.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "git_commits")
public class GitCommit {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String taskId;

    @Column(nullable = false)
    private String commitHash;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private String authorName;

    private String branchName;

    @Column(nullable = false)
    private LocalDateTime commitDate = LocalDateTime.now();

    public GitCommit() {}

    public GitCommit(String taskId, String commitHash, String message, String authorName, String branchName) {
        this.taskId = taskId;
        this.commitHash = commitHash;
        this.message = message;
        this.authorName = authorName;
        this.branchName = branchName;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTaskId() { return taskId; }
    public void setTaskId(String taskId) { this.taskId = taskId; }

    public String getCommitHash() { return commitHash; }
    public void setCommitHash(String commitHash) { this.commitHash = commitHash; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }

    public LocalDateTime getCommitDate() { return commitDate; }
    public void setCommitDate(LocalDateTime commitDate) { this.commitDate = commitDate; }
}
