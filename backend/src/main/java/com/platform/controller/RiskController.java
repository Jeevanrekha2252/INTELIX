package com.platform.controller;

import com.platform.entity.RiskAssessment;
import com.platform.entity.Task;
import com.platform.repository.RiskAssessmentRepository;
import com.platform.repository.TaskRepository;
import com.platform.service.RiskEngineService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RiskController {

    private final RiskEngineService riskEngineService;
    private final RiskAssessmentRepository riskAssessmentRepository;
    private final TaskRepository taskRepository;

    public RiskController(RiskEngineService riskEngineService,
                          RiskAssessmentRepository riskAssessmentRepository,
                          TaskRepository taskRepository) {
        this.riskEngineService = riskEngineService;
        this.riskAssessmentRepository = riskAssessmentRepository;
        this.taskRepository = taskRepository;
    }

    @GetMapping("/api/projects/{projectId}/risks")
    public ResponseEntity<List<RiskAssessment>> getProjectRisks(@PathVariable String projectId) {
        return ResponseEntity.ok(riskAssessmentRepository.findByProjectIdOrderByCalculatedAtDesc(projectId));
    }

    @GetMapping("/api/tasks/{taskId}/risk")
    public ResponseEntity<RiskEngineService.TaskRiskResult> getTaskRisk(@PathVariable String taskId) {
        Task task = taskRepository.findById(taskId).orElseThrow();
        return ResponseEntity.ok(riskEngineService.calculateTaskRisk(task));
    }

    @PostMapping("/api/projects/{projectId}/risk/recalculate")
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER', 'ADMIN')")
    public ResponseEntity<Void> recalculateRisks(@PathVariable String projectId) {
        riskEngineService.recalculateProjectRisks(projectId);
        return ResponseEntity.ok().build();
    }
}
