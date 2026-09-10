package com.platform.controller;

import com.platform.entity.Milestone;
import com.platform.service.MilestoneService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/milestones")
public class MilestoneController {

    private final MilestoneService milestoneService;

    public MilestoneController(MilestoneService milestoneService) {
        this.milestoneService = milestoneService;
    }

    @GetMapping
    public ResponseEntity<List<Milestone>> getMilestones(@PathVariable String projectId) {
        return ResponseEntity.ok(milestoneService.getMilestonesForProject(projectId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER', 'ADMIN')")
    public ResponseEntity<Milestone> createMilestone(@PathVariable String projectId, @RequestBody Milestone milestone) {
        milestone.setProjectId(projectId);
        return ResponseEntity.ok(milestoneService.createMilestone(milestone));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER', 'ADMIN')")
    public ResponseEntity<Milestone> updateMilestone(@PathVariable String projectId, @PathVariable String id, @RequestBody Milestone milestone) {
        return ResponseEntity.ok(milestoneService.updateMilestone(id, milestone));
    }
}
