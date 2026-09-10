package com.platform.controller;

import com.platform.dto.PlatformDtos;
import com.platform.service.WorkloadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class WorkloadController {

    private final WorkloadService workloadService;

    public WorkloadController(WorkloadService workloadService) {
        this.workloadService = workloadService;
    }

    @GetMapping("/api/projects/{projectId}/workload")
    public ResponseEntity<List<PlatformDtos.WorkloadMemberDTO>> getProjectWorkload(@PathVariable String projectId) {
        return ResponseEntity.ok(workloadService.getProjectWorkload(projectId));
    }
}
