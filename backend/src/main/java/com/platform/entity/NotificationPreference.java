package com.platform.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "notification_preferences")
public class NotificationPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "user_id", unique = true, nullable = false)
    private String userId;

    private boolean tasksEnabled = true;
    private boolean risksEnabled = true;
    private boolean projectsEnabled = true;
    private boolean meetingsEnabled = true;
    private boolean approvalsEnabled = true;
    private boolean commentsEnabled = true;
    private boolean soundEnabled = true;

    public NotificationPreference() {}

    public NotificationPreference(String userId) {
        this.userId = userId;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public boolean isTasksEnabled() { return tasksEnabled; }
    public void setTasksEnabled(boolean tasksEnabled) { this.tasksEnabled = tasksEnabled; }

    public boolean isRisksEnabled() { return risksEnabled; }
    public void setRisksEnabled(boolean risksEnabled) { this.risksEnabled = risksEnabled; }

    public boolean isProjectsEnabled() { return projectsEnabled; }
    public void setProjectsEnabled(boolean projectsEnabled) { this.projectsEnabled = projectsEnabled; }

    public boolean isMeetingsEnabled() { return meetingsEnabled; }
    public void setMeetingsEnabled(boolean meetingsEnabled) { this.meetingsEnabled = meetingsEnabled; }

    public boolean isApprovalsEnabled() { return approvalsEnabled; }
    public void setApprovalsEnabled(boolean approvalsEnabled) { this.approvalsEnabled = approvalsEnabled; }

    public boolean isCommentsEnabled() { return commentsEnabled; }
    public void setCommentsEnabled(boolean commentsEnabled) { this.commentsEnabled = commentsEnabled; }

    public boolean isSoundEnabled() { return soundEnabled; }
    public void setSoundEnabled(boolean soundEnabled) { this.soundEnabled = soundEnabled; }
}
