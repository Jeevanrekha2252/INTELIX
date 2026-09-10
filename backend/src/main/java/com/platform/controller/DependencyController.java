package com.platform.controller;

import com.platform.dto.PlatformDtos;
import com.platform.entity.TaskDependency;
import com.platform.service.DependencyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class DependencyController {

    private final DependencyService dependencyService;

    public DependencyController(DependencyService dependencyService) {
        this.dependencyService = dependencyService;
    }

    @GetMapping("/api/projects/{projectId}/dependencies")
    public ResponseEntity<List<DependencyService.DependencyDetailDTO>> getDependencies(@PathVariable String projectId) {
        return ResponseEntity.ok(dependencyService.getProjectDependencies(projectId));
    }

    @PostMapping("/api/projects/{projectId}/dependencies")
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER', 'ADMIN')")
    public ResponseEntity<TaskDependency> createDependency(@PathVariable String projectId,
                                                           @RequestBody PlatformDtos.DependencyCreateRequest request) {
        return ResponseEntity.ok(dependencyService.createDependency(request.getPredecessorTaskId(), request.getSuccessorTaskId()));
    }

    @DeleteMapping("/api/dependencies/{id}")
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER', 'ADMIN')")
    public ResponseEntity<Void> deleteDependency(@PathVariable String id) {
        dependencyService.deleteDependency(id);
        return ResponseEntity.noContent().build();
    }
}
