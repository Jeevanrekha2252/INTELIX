package com.platform.repository;

import com.platform.entity.TaskDependency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskDependencyRepository extends JpaRepository<TaskDependency, String> {
    List<TaskDependency> findBySuccessorTaskId(String successorTaskId);
    List<TaskDependency> findByPredecessorTaskId(String predecessorTaskId);
    boolean existsByPredecessorTaskIdAndSuccessorTaskId(String predecessorTaskId, String successorTaskId);
    void deleteByPredecessorTaskIdAndSuccessorTaskId(String predecessorTaskId, String successorTaskId);
}
