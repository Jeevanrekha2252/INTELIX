package com.platform.repository;

import com.platform.entity.DeliverableApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliverableApprovalRepository extends JpaRepository<DeliverableApproval, String> {
    List<DeliverableApproval> findByProjectIdOrderBySubmittedDateDesc(String projectId);
    List<DeliverableApproval> findByProjectIdAndStatus(String projectId, DeliverableApproval.ApprovalStatus status);
}
