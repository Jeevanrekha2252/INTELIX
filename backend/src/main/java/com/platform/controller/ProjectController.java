package com.platform.controller;

import com.platform.dto.ProjectInitiationDtos.*;
import com.platform.entity.Project;
import com.platform.entity.User;
import com.platform.service.ProjectInitiationService;
import com.platform.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final ProjectInitiationService initiationService;

    public ProjectController(ProjectService projectService, ProjectInitiationService initiationService) {
        this.projectService = projectService;
        this.initiationService = initiationService;
    }

    @GetMapping
    public ResponseEntity<List<Project>> getProjects(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(projectService.getProjectsForUser(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable String id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER', 'ADMIN')")
    public ResponseEntity<Project> createProject(@RequestBody Project project, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(projectService.createProject(project, user));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER', 'ADMIN')")
    public ResponseEntity<Project> updateProject(@PathVariable String id, @RequestBody Project project, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(projectService.updateProject(id, project, user));
    }

    @PostMapping("/initiate")
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER', 'ADMIN')")
    public ResponseEntity<ProjectInitiationResponse> initiateProject(
            @RequestBody ProjectInitiationRequest req,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(initiationService.saveOrSubmitProject(req, user));
    }

    @GetMapping("/drafts")
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER', 'ADMIN')")
    public ResponseEntity<List<InitiationDraftSummary>> getProjectDrafts(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(initiationService.getDraftsForManager(user));
    }

    @GetMapping("/{id}/initiation-data")
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER', 'ADMIN')")
    public ResponseEntity<ProjectInitiationRequest> getInitiationData(@PathVariable String id) {
        return ResponseEntity.ok(initiationService.getInitiationData(id));
    }
}
