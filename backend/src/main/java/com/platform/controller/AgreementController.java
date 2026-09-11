package com.platform.controller;

import com.platform.dto.AgreementDtos.*;
import com.platform.entity.User;
import com.platform.service.AgreementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@PreAuthorize("hasAnyRole('PROJECT_MANAGER', 'MANAGER', 'CLIENT', 'ADMIN', 'EXECUTIVE')")
public class AgreementController {

    private final AgreementService agreementService;

    public AgreementController(AgreementService agreementService) {
        this.agreementService = agreementService;
    }

    @GetMapping("/api/projects/{projectId}/agreement")
    public ResponseEntity<AgreementDetailResponse> getAgreement(@PathVariable String projectId) {
        return agreementService.getAgreementByProjectId(projectId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/api/projects/{projectId}/agreement")
    public ResponseEntity<AgreementDetailResponse> createOrUpdateAgreement(
            @PathVariable String projectId,
            @RequestBody AgreementCreateRequest request,
            @AuthenticationPrincipal User user) {
        request.projectId = projectId;
        return ResponseEntity.ok(agreementService.createOrUpdateDraft(request, user));
    }

    @PostMapping("/api/agreements/{id}/submit")
    public ResponseEntity<AgreementDetailResponse> submitToClient(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(agreementService.submitToClient(id, user));
    }

    @PostMapping({"/api/agreements/{id}/decision", "/api/agreements/{id}/review"})
    public ResponseEntity<AgreementDetailResponse> clientDecision(
            @PathVariable String id,
            @RequestBody AgreementReviewRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(agreementService.clientDecision(id, request, user));
    }

    @PostMapping("/api/agreements/{id}/lock")
    public ResponseEntity<AgreementDetailResponse> lockAgreement(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(agreementService.lockAgreement(id, user));
    }

    @PostMapping({"/api/agreements/payments/{paymentId}/record", "/api/agreements/payments/{paymentId}/pay"})
    public ResponseEntity<AgreementDetailResponse> recordPayment(
            @PathVariable String paymentId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(agreementService.recordPayment(paymentId, user));
    }

    @PostMapping("/api/agreements/{id}/amendments")
    public ResponseEntity<AgreementDetailResponse> requestAmendment(
            @PathVariable String id,
            @RequestBody AmendmentCreateRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(agreementService.requestAmendment(id, request, user));
    }

    @PostMapping({"/api/agreements/amendments/{amendmentId}/decision", "/api/agreements/amendments/{amendmentId}/review"})
    public ResponseEntity<AgreementDetailResponse> reviewAmendment(
            @PathVariable String amendmentId,
            @RequestBody AmendmentReviewRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(agreementService.reviewAmendment(amendmentId, request, user));
    }
}
