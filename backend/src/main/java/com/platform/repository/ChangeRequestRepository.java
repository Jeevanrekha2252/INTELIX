package com.platform.repository;

import com.platform.entity.ChangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChangeRequestRepository extends JpaRepository<ChangeRequest, String> {
    List<ChangeRequest> findByProjectIdOrderByCreatedAtDesc(String projectId);
    List<ChangeRequest> findByRequestedById(String requestedById);
    Optional<ChangeRequest> findByCrKey(String crKey);
}
