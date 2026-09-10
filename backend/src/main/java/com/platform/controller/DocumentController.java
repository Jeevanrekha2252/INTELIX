package com.platform.controller;

import com.platform.entity.ProjectDocument;
import com.platform.entity.User;
import com.platform.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping("/api/projects/{projectId}/documents")
    public ResponseEntity<List<ProjectDocument>> getDocuments(@PathVariable String projectId) {
        return ResponseEntity.ok(documentService.getDocumentsForProject(projectId));
    }

    @PostMapping("/api/projects/{projectId}/documents")
    public ResponseEntity<ProjectDocument> uploadDocument(@PathVariable String projectId,
                                                          @RequestBody Map<String, Object> body,
                                                          @AuthenticationPrincipal User user) {
        String filename = (String) body.getOrDefault("filename", "document.pdf");
        String description = (String) body.getOrDefault("description", "");
        String base64Content = (String) body.getOrDefault("fileDataBase64", "");
        String contentType = (String) body.getOrDefault("contentType", "application/octet-stream");
        long fileSize = ((Number) body.getOrDefault("fileSize", 1024)).longValue();
        String taskId = (String) body.get("taskId");

        return ResponseEntity.ok(documentService.saveDocument(projectId, taskId, filename, fileSize, contentType, base64Content, description, user));
    }
}
