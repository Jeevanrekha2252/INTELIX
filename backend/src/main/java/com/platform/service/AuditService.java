package com.platform.service;

import com.platform.entity.ActivityLog;
import com.platform.entity.Notification;
import com.platform.entity.User;
import com.platform.repository.ActivityLogRepository;
import com.platform.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditService {

    private final ActivityLogRepository activityLogRepository;

    public AuditService(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    public void log(String projectId, User actor, String actionType, String entityType, String entityId, String oldValue, String newValue, String details) {
        ActivityLog log = new ActivityLog(projectId, actor, actionType, entityType, entityId, oldValue, newValue, details);
        activityLogRepository.save(log);
    }

    public List<ActivityLog> getProjectActivity(String projectId) {
        return activityLogRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
    }
}
