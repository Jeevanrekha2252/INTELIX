package com.platform.controller;

import com.platform.dto.PlatformDtos;
import com.platform.entity.ChangeRequest;
import com.platform.entity.Task;
import com.platform.entity.User;
import com.platform.service.ChangeRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ChangeRequestController {

    private final ChangeRequestService changeRequestService;

    public ChangeRequestController(ChangeRequestService changeRequestService) {
        this.changeRequestService = changeRequestService;
    }

    @GetMapping("/api/projects/{projectId}/change-requests")
    public ResponseEntity<List<ChangeRequest>> getChangeRequests(@PathVariable String projectId) {
        return ResponseEntity.ok(changeRequestService.getChangeRequestsForProject(projectId));
    }

    @PostMapping("/api/projects/{projectId}/change-requests")
    public ResponseEntity<ChangeRequest> createChangeRequest(@PathVariable String projectId,
                                                             @RequestBody PlatformDtos.ChangeRequestCreate dto,
                                                             @AuthenticationPrincipal User user) {
        dto.setProjectId(projectId);
        return ResponseEntity.ok(changeRequestService.createChangeRequest(dto, user));
    }

    @PutMapping("/api/change-requests/{id}")
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER', 'ADMIN')")
    public ResponseEntity<ChangeRequest> reviewChangeRequest(@PathVariable String id,
                                                             @RequestBody PlatformDtos.ChangeRequestReview dto,
                                                             @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(changeRequestService.reviewChangeRequest(id, dto, user));
    }

    @PostMapping("/api/change-requests/{id}/convert-to-task")
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER', 'ADMIN')")
    public ResponseEntity<Task> convertToTask(@PathVariable String id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(changeRequestService.convertToTask(id, user));
    }
}
