package com.platform.repository;

import com.platform.entity.ProjectDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectDocumentRepository extends JpaRepository<ProjectDocument, String> {
    List<ProjectDocument> findByProjectIdOrderByUploadedAtDesc(String projectId);
    List<ProjectDocument> findByTaskIdOrderByUploadedAtDesc(String taskId);
}
