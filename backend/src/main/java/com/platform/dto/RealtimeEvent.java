package com.platform.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.platform.entity.Notification;

import java.time.LocalDateTime;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class RealtimeEvent {

    private String id;
    private String eventType;
    private String type; // Synonym for eventType for notification clients
    private String title;
    private String message;
    private String severity;
    private String recipientId;
    private String projectId;
    private String relatedEntityType;
    private String relatedEntityId;
    private String linkUrl;
    private boolean isRead;
    private LocalDateTime createdAt;
    private Map<String, Object> metadata;
    private Object data; // Additional payload for dashboards (e.g. updated Task, Risk Score)

    public RealtimeEvent() {
        this.createdAt = LocalDateTime.now();
    }

    public static RealtimeEvent fromNotification(Notification n, Map<String, Object> meta) {
        RealtimeEvent event = new RealtimeEvent();
        event.setId(n.getId());
        event.setEventType(n.getType() != null ? n.getType() : n.getCategory());
        event.setType(event.getEventType());
        event.setTitle(n.getTitle());
        event.setMessage(n.getMessage());
        event.setSeverity(n.getSeverity() != null ? n.getSeverity().name() : "INFO");
        event.setRecipientId(n.getUserId());
        event.setProjectId(n.getProjectId());
        event.setRelatedEntityType(n.getRelatedEntityType());
        event.setRelatedEntityId(n.getRelatedEntityId());
        event.setLinkUrl(n.getLinkUrl());
        event.setRead(n.isRead());
        event.setCreatedAt(n.getCreatedAt());
        event.setMetadata(meta);
        return event;
    }

    public static RealtimeEvent projectTelemetry(String eventType, String projectId, String entityType, String entityId, Object data) {
        RealtimeEvent event = new RealtimeEvent();
        event.setEventType(eventType);
        event.setType(eventType);
        event.setProjectId(projectId);
        event.setRelatedEntityType(entityType);
        event.setRelatedEntityId(entityId);
        event.setData(data);
        event.setCreatedAt(LocalDateTime.now());
        return event;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getRecipientId() { return recipientId; }
    public void setRecipientId(String recipientId) { this.recipientId = recipientId; }

    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }

    public String getRelatedEntityType() { return relatedEntityType; }
    public void setRelatedEntityType(String relatedEntityType) { this.relatedEntityType = relatedEntityType; }

    public String getRelatedEntityId() { return relatedEntityId; }
    public void setRelatedEntityId(String relatedEntityId) { this.relatedEntityId = relatedEntityId; }

    public String getLinkUrl() { return linkUrl; }
    public void setLinkUrl(String linkUrl) { this.linkUrl = linkUrl; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }

    public Object getData() { return data; }
    public void setData(Object data) { this.data = data; }
}
