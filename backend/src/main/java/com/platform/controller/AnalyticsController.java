package com.platform.controller;

import com.platform.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/api/projects/{projectId}/analytics")
    public ResponseEntity<Map<String, Object>> getProjectAnalytics(@PathVariable String projectId) {
        return ResponseEntity.ok(analyticsService.getProjectAnalytics(projectId));
    }
}
