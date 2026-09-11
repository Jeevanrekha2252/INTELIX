package com.platform.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.platform.dto.RealtimeEvent;
import com.platform.entity.*;
import com.platform.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final NotificationPreferenceRepository preferenceRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final ObjectMapper objectMapper;

    public NotificationService(
            NotificationRepository notificationRepository,
            NotificationPreferenceRepository preferenceRepository,
            SimpMessagingTemplate messagingTemplate,
            ProjectRepository projectRepository,
            UserRepository userRepository,
            TeamRepository teamRepository,
            TeamMemberRepository teamMemberRepository) {
        this.notificationRepository = notificationRepository;
        this.preferenceRepository = preferenceRepository;
        this.messagingTemplate = messagingTemplate;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Backward-compatible helper method.
     */
    public Notification sendNotification(String userId, String title, String message, Notification.Severity severity, String category, String linkUrl) {
        NotificationType type = NotificationType.SYSTEM_ALERT;
        try {
            type = NotificationType.valueOf(category);
        } catch (Exception ignored) {}
        return sendToUser(userId, type, title, message, severity, null, "SYSTEM", null, linkUrl, null);
    }

    /**
     * Centralized method to persist and push a real-time notification to a specific user.
     */
    @Transactional
    public Notification sendToUser(
            String userId,
            NotificationType type,
            String title,
            String message,
            Notification.Severity severity,
            String projectId,
            String relatedEntityType,
            String relatedEntityId,
            String linkUrl,
            Map<String, Object> metadata) {

        if (userId == null || userId.trim().isEmpty()) {
            return null;
        }

        // 1. Create and persist notification
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setSeverity(severity != null ? severity : Notification.Severity.INFO);
        notification.setType(type != null ? type.name() : NotificationType.SYSTEM_ALERT.name());
        notification.setCategory(notification.getType());
        notification.setProjectId(projectId);
        notification.setRelatedEntityType(relatedEntityType);
        notification.setRelatedEntityId(relatedEntityId);
        notification.setLinkUrl(linkUrl);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        if (metadata != null && !metadata.isEmpty()) {
            try {
                notification.setMetadata(objectMapper.writeValueAsString(metadata));
            } catch (Exception e) {
                log.warn("Could not serialize notification metadata: {}", e.getMessage());
            }
        }

        Notification saved = notificationRepository.save(notification);

        // 2. Check user notification preferences for non-critical notifications
        boolean shouldPush = true;
        if (saved.getSeverity() != Notification.Severity.CRITICAL && saved.getSeverity() != Notification.Severity.HIGH) {
            shouldPush = isDeliveryAllowedByPreference(userId, type);
        }

        // 3. Dispatch real-time STOMP push if allowed
        if (shouldPush) {
            try {
                RealtimeEvent event = RealtimeEvent.fromNotification(saved, metadata);
                // Push to user queue: /user/{userId}/queue/notifications
                messagingTemplate.convertAndSendToUser(userId, "/queue/notifications", event);

                // Push unread badge update: /user/{userId}/queue/unread-count
                long unreadCount = notificationRepository.countByUserIdAndIsReadFalse(userId);
                Map<String, Object> countPayload = Map.of("unreadCount", unreadCount);
                messagingTemplate.convertAndSendToUser(userId, "/queue/unread-count", countPayload);

                log.debug("Dispatched STOMP notification to user {} [type={}]", userId, saved.getType());
            } catch (Exception e) {
                log.warn("Failed to push STOMP notification to user {}: {}", userId, e.getMessage());
            }
        }

        return saved;
    }

    /**
     * Send to multiple users.
     */
    public List<Notification> sendToUsers(
            Collection<String> userIds,
            NotificationType type,
            String title,
            String message,
            Notification.Severity severity,
            String projectId,
            String relatedEntityType,
            String relatedEntityId,
            String linkUrl,
            Map<String, Object> metadata) {

        List<Notification> result = new ArrayList<>();
        if (userIds == null) return result;
        Set<String> unique = new HashSet<>(userIds);
        for (String uid : unique) {
            Notification n = sendToUser(uid, type, title, message, severity, projectId, relatedEntityType, relatedEntityId, linkUrl, metadata);
            if (n != null) result.add(n);
        }
        return result;
    }

    /**
     * Send notification to project manager(s) of a given project.
     */
    public List<Notification> sendToProjectManagers(
            String projectId,
            NotificationType type,
            String title,
            String message,
            Notification.Severity severity,
            String relatedEntityType,
            String relatedEntityId,
            String linkUrl,
            Map<String, Object> metadata) {

        Set<String> managerIds = new HashSet<>();
        if (projectId != null) {
            projectRepository.findById(projectId).ifPresent(project -> {
                if (project.getProjectManager() != null) {
                    managerIds.add(project.getProjectManager().getId());
                }
            });
        }
        // Fallback: if no manager found, notify all users with PROJECT_MANAGER role
        if (managerIds.isEmpty()) {
            userRepository.findByRole(Role.PROJECT_MANAGER).forEach(u -> managerIds.add(u.getId()));
        }

        return sendToUsers(managerIds, type, title, message, severity, projectId, relatedEntityType, relatedEntityId, linkUrl, metadata);
    }

    /**
     * Send notification to project client.
     */
    public List<Notification> sendToClient(
            String projectId,
            NotificationType type,
            String title,
            String message,
            Notification.Severity severity,
            String relatedEntityType,
            String relatedEntityId,
            String linkUrl,
            Map<String, Object> metadata) {

        Set<String> clientIds = new HashSet<>();
        if (projectId != null) {
            projectRepository.findById(projectId).ifPresent(project -> {
                if (project.getClient() != null) {
                    clientIds.add(project.getClient().getId());
                }
            });
        }
        return sendToUsers(clientIds, type, title, message, severity, projectId, relatedEntityType, relatedEntityId, linkUrl, metadata);
    }

    /**
     * Send notification to all team members of a project.
     */
    public List<Notification> sendToProjectMembers(
            String projectId,
            NotificationType type,
            String title,
            String message,
            Notification.Severity severity,
            String relatedEntityType,
            String relatedEntityId,
            String linkUrl,
            Map<String, Object> metadata) {

        Set<String> memberIds = new HashSet<>();
        if (projectId != null) {
            List<Team> teams = teamRepository.findByProjectId(projectId);
            for (Team t : teams) {
                List<TeamMember> members = teamMemberRepository.findByTeamId(t.getId());
                for (TeamMember tm : members) {
                    if (tm.getUser() != null) {
                        memberIds.add(tm.getUser().getId());
                    }
                }
            }
            projectRepository.findById(projectId).ifPresent(p -> {
                if (p.getProjectManager() != null) memberIds.add(p.getProjectManager().getId());
            });
        }
        return sendToUsers(memberIds, type, title, message, severity, projectId, relatedEntityType, relatedEntityId, linkUrl, metadata);
    }


    /**
     * Send notification to all active users with a given role.
     */
    public List<Notification> sendToRole(
            Role role,
            NotificationType type,
            String title,
            String message,
            Notification.Severity severity,
            String projectId,
            String relatedEntityType,
            String relatedEntityId,
            String linkUrl,
            Map<String, Object> metadata) {

        List<User> users = userRepository.findByRole(role);
        List<String> ids = users.stream().map(User::getId).toList();
        return sendToUsers(ids, type, title, message, severity, projectId, relatedEntityType, relatedEntityId, linkUrl, metadata);
    }

    /**
     * Broadcast live project telemetry event to /topic/project/{projectId} for real-time dashboard updates.
     */
    public void publishProjectEvent(String projectId, String eventType, String entityType, String entityId, Object payload) {
        if (projectId == null || projectId.trim().isEmpty()) return;
        try {
            RealtimeEvent event = RealtimeEvent.projectTelemetry(eventType, projectId, entityType, entityId, payload);
            messagingTemplate.convertAndSend("/topic/project/" + projectId, event);
            log.debug("Broadcasted live project event to /topic/project/{}: {}", projectId, eventType);
        } catch (Exception e) {
            log.warn("Failed to publish project event to /topic/project/{}: {}", projectId, e.getMessage());
        }
    }

    private boolean isDeliveryAllowedByPreference(String userId, NotificationType type) {
        Optional<NotificationPreference> prefOpt = preferenceRepository.findByUserId(userId);
        if (prefOpt.isEmpty()) return true; // default all enabled
        NotificationPreference pref = prefOpt.get();

        if (type == null) return true;
        return switch (type) {
            case TASK_ASSIGNED, TASK_REASSIGNED, TASK_OVERDUE, TASK_DEADLINE_APPROACHING, TASK_COMPLETED,
                 BLOCKER_REPORTED, BLOCKER_RESOLVED -> pref.isTasksEnabled();
            case DEPENDENCY_AT_RISK, DEPENDENCY_RESOLVED, PROJECT_AT_RISK, PROJECT_CRITICAL, PROJECT_HEALTH_CHANGED,
                 PREDICTION_CHANGED, DELAY_PREDICTED, AI_RECOMMENDATION_CREATED -> pref.isRisksEnabled();
            case MEETING_SCHEDULED, MEETING_UPDATED, MEETING_CANCELLED -> pref.isMeetingsEnabled();
            case APPROVAL_REQUESTED, DELIVERABLE_READY, DELIVERABLE_APPROVED, CHANGES_REQUESTED,
                 CHANGE_REQUEST_CREATED, CHANGE_REQUEST_APPROVED, CHANGE_REQUEST_REJECTED, CHANGE_REQUEST_NEEDS_CLARIFICATION -> pref.isApprovalsEnabled();
            case COMMENT_ADDED, MENTION -> pref.isCommentsEnabled();
            default -> pref.isProjectsEnabled();
        };
    }

    // Queries and Status Management
    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Page<Notification> getUserNotifications(String userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(String notificationId, String userId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            if (userId == null || userId.equals(n.getUserId())) {
                n.setRead(true);
                n.setReadAt(LocalDateTime.now());
                notificationRepository.save(n);
                pushUnreadCount(n.getUserId());
            }
        });
    }

    @Transactional
    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        unread.forEach(n -> {
            n.setRead(true);
            n.setReadAt(LocalDateTime.now());
        });
        notificationRepository.saveAll(unread);
        pushUnreadCount(userId);
    }

    public void pushUnreadCount(String userId) {
        if (userId == null) return;
        try {
            long unreadCount = notificationRepository.countByUserIdAndIsReadFalse(userId);
            Map<String, Object> countPayload = Map.of("unreadCount", unreadCount);
            messagingTemplate.convertAndSendToUser(userId, "/queue/unread-count", countPayload);
        } catch (Exception e) {
            log.warn("Failed to push unread count to user {}: {}", userId, e.getMessage());
        }
    }

    // Preference management
    public NotificationPreference getPreferences(String userId) {
        return preferenceRepository.findByUserId(userId)
                .orElseGet(() -> preferenceRepository.save(new NotificationPreference(userId)));
    }

    @Transactional
    public NotificationPreference updatePreferences(String userId, NotificationPreference updated) {
        NotificationPreference existing = getPreferences(userId);
        existing.setTasksEnabled(updated.isTasksEnabled());
        existing.setRisksEnabled(updated.isRisksEnabled());
        existing.setProjectsEnabled(updated.isProjectsEnabled());
        existing.setMeetingsEnabled(updated.isMeetingsEnabled());
        existing.setApprovalsEnabled(updated.isApprovalsEnabled());
        existing.setCommentsEnabled(updated.isCommentsEnabled());
        existing.setSoundEnabled(updated.isSoundEnabled());
        return preferenceRepository.save(existing);
    }
}
