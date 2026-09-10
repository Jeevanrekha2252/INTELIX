package com.platform.repository;

import com.platform.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {
    Optional<Project> findByProjectKey(String projectKey);
    List<Project> findByClientId(String clientId);
    List<Project> findByProjectManagerId(String projectManagerId);
}
