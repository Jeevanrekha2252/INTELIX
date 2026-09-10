package com.platform.controller;

import com.platform.entity.ActivityLog;
import com.platform.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ActivityController {

    private final AuditService auditService;

    public ActivityController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping("/api/projects/{projectId}/activity")
    public ResponseEntity<List<ActivityLog>> getProjectActivity(@PathVariable String projectId) {
        return ResponseEntity.ok(auditService.getProjectActivity(projectId));
    }
}
