package com.platform.service;

import com.platform.entity.ProjectDocument;
import com.platform.entity.User;
import com.platform.exception.ResourceNotFoundException;
import com.platform.repository.ProjectDocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DocumentService {

    private final ProjectDocumentRepository documentRepository;
    private final AuditService auditService;

    public DocumentService(ProjectDocumentRepository documentRepository, AuditService auditService) {
        this.documentRepository = documentRepository;
        this.auditService = auditService;
    }

    public List<ProjectDocument> getDocumentsForProject(String projectId) {
        return documentRepository.findByProjectIdOrderByUploadedAtDesc(projectId);
    }

    public ProjectDocument getDocumentById(String id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found: " + id));
    }

    @Transactional
    public ProjectDocument saveDocument(String projectId, String taskId, String filename,
                                        long fileSize, String contentType, String base64Content,
                                        String description, User uploader) {
        ProjectDocument doc = new ProjectDocument();
        doc.setProjectId(projectId);
        doc.setTaskId(taskId);
        doc.setFilename(filename);
        doc.setFileSize(fileSize);
        doc.setContentType(contentType);
        doc.setFileDataBase64(base64Content);
        doc.setDescription(description);
        doc.setUploadedBy(uploader);
        doc.setVersion("1.0");

        ProjectDocument saved = documentRepository.save(doc);
        auditService.log(projectId, uploader, "DOCUMENT_UPLOADED", "DOCUMENT", saved.getId(),
                null, filename, "Uploaded document " + filename);
        return saved;
    }
}
