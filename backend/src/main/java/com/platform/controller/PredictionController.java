package com.platform.controller;

import com.platform.dto.PlatformDtos;
import com.platform.service.PredictionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @GetMapping("/api/projects/{projectId}/prediction")
    public ResponseEntity<PlatformDtos.PredictionDTO> getProjectPrediction(@PathVariable String projectId) {
        return ResponseEntity.ok(predictionService.calculateProjectPrediction(projectId));
    }
}
