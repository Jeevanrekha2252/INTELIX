package com.platform.controller;

import com.platform.dto.PlatformDtos;
import com.platform.entity.User;
import com.platform.service.AiCopilotService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/copilot")
public class AiCopilotController {

    private final AiCopilotService aiCopilotService;

    public AiCopilotController(AiCopilotService aiCopilotService) {
        this.aiCopilotService = aiCopilotService;
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<PlatformDtos.AiRecommendationDTO>> getRecommendations(@PathVariable String projectId) {
        return ResponseEntity.ok(aiCopilotService.generateRecommendations(projectId));
    }

    @PostMapping("/apply/{recommendationId}")
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER', 'ADMIN')")
    public ResponseEntity<Void> applyRecommendation(@PathVariable String projectId,
                                                    @PathVariable String recommendationId,
                                                    @AuthenticationPrincipal User user) {
        aiCopilotService.applyRecommendation(projectId, recommendationId, user);
        return ResponseEntity.ok().build();
    }
}
