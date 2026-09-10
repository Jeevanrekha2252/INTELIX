package com.platform.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "meeting_action_items")
public class MeetingActionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String meetingId;

    @Column(nullable = false)
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @Column(nullable = false)
    private boolean isConvertedToTask = false;

    private String convertedTaskId;

    public MeetingActionItem() {}

    public MeetingActionItem(String meetingId, String description, User assignee) {
        this.meetingId = meetingId;
        this.description = description;
        this.assignee = assignee;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getMeetingId() { return meetingId; }
    public void setMeetingId(String meetingId) { this.meetingId = meetingId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public User getAssignee() { return assignee; }
    public void setAssignee(User assignee) { this.assignee = assignee; }

    public boolean isConvertedToTask() { return isConvertedToTask; }
    public void setConvertedToTask(boolean convertedToTask) { isConvertedToTask = convertedToTask; }

    public String getConvertedTaskId() { return convertedTaskId; }
    public void setConvertedTaskId(String convertedTaskId) { this.convertedTaskId = convertedTaskId; }
}
