package com.platform.controller;

import com.platform.dto.PlatformDtos;
import com.platform.entity.DeliverableApproval;
import com.platform.entity.User;
import com.platform.service.ApprovalService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ApprovalController {

    private final ApprovalService approvalService;

    public ApprovalController(ApprovalService approvalService) {
        this.approvalService = approvalService;
    }

    @GetMapping("/api/projects/{projectId}/approvals")
    public ResponseEntity<List<DeliverableApproval>> getApprovals(@PathVariable String projectId) {
        return ResponseEntity.ok(approvalService.getApprovalsForProject(projectId));
    }

    @PostMapping("/api/approvals/{id}/decision")
    public ResponseEntity<DeliverableApproval> makeDecision(@PathVariable String id,
                                                            @RequestBody PlatformDtos.DeliverableDecision decision,
                                                            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(approvalService.makeDecision(id, decision, user));
    }
}
