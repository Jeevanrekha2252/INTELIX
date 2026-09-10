package com.platform.repository;

import com.platform.entity.GitCommit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GitCommitRepository extends JpaRepository<GitCommit, String> {
    List<GitCommit> findByTaskIdOrderByCommitDateDesc(String taskId);
}
