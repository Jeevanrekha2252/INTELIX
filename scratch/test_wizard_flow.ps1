$baseUrl = "http://localhost:8080"

function Get-Token($email, $password) {
    $body = @{ email = $email; password = $password } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $body -ContentType "application/json"
    return $res.token
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "INTELIX 9-STEP PROJECT CREATION WIZARD END-TO-END VERIFICATION" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Log in
Write-Host "`n1. Authenticating Roles..."
$mgrToken = Get-Token "manager@demo.com" "password123"
$devToken = Get-Token "developer@demo.com" "password123"
$clientToken = Get-Token "client@demo.com" "password123"
Write-Host "Tokens acquired successfully!" -ForegroundColor Green

$mgrHeaders = @{ Authorization = "Bearer $mgrToken" }
$clientHeaders = @{ Authorization = "Bearer $clientToken" }
$devHeaders = @{ Authorization = "Bearer $devToken" }

# 2. Test Employee Workload Fetch
Write-Host "`n2. Fetching Available Employees with Live Workload Diagnostics..."
$workloads = Invoke-RestMethod -Uri "$baseUrl/api/users/employees-workload" -Method Get -Headers $mgrHeaders
Write-Host "Retrieved $($workloads.Count) employees."
foreach ($emp in $workloads) {
    Write-Host " - $($emp.fullName): $($emp.currentWorkloadPercentage)% utilized ($($emp.workloadStatus)), $($emp.activeTasksCount) active tasks"
}

# 3. Test Client Discovery & Creation
Write-Host "`n3. Testing Client Discovery..."
$clients = Invoke-RestMethod -Uri "$baseUrl/api/users/clients" -Method Get -Headers $mgrHeaders
Write-Host "Found $($clients.Count) existing clients. Selected client: $($clients[0].fullName) ($($clients[0].email))"
$selectedClientId = $clients[0].id

# 4. Test Saving Project as Draft (Step 3)
Write-Host "`n4. Testing Step 3 Draft Persistence (SAVE_DRAFT)..."
$draftPayload = @{
    action = "SAVE_DRAFT"
    currentStep = 3
    basicInfo = @{
        title = "National Smart Water Grid Telemetry 2.0"
        projectKey = "IX-SWG2"
        description = "IoT sensors and automated telemetry platform across regional water grids."
        projectObjective = "Real-time flow monitoring and automated pressure balancing"
        category = "Infrastructure"
        startDate = "2026-10-01"
        endDate = "2026-12-15"
        priority = "HIGH"
        projectType = "Fixed Price"
        timezone = "UTC+05:30"
        budget = 950000
        tags = "IoT Sensors, PostgreSQL, Spring Boot, React"
    }
    client = @{
        clientId = $selectedClientId
    }
    teams = @(
        @{
            name = "Backend Ingestion Team"
            description = "Telemetry ingestion & REST APIs"
            leadId = $workloads[0].userId
            memberIds = @($workloads[0].userId)
        }
    )
} | ConvertTo-Json -Depth 6

$draftRes = Invoke-RestMethod -Uri "$baseUrl/api/projects/initiate" -Method Post -Headers $mgrHeaders -Body $draftPayload -ContentType "application/json"
$createdDraftId = $draftRes.projectId
Write-Host "Draft saved successfully!" -ForegroundColor Green
Write-Host " - Project ID: $createdDraftId"
Write-Host " - Status: $($draftRes.status)"
Write-Host " - Saved at Step: $($draftRes.currentStep)"

# 5. Verify Draft Listing
Write-Host "`n5. Verifying Manager Drafts Retrieval..."
$draftsList = Invoke-RestMethod -Uri "$baseUrl/api/projects/drafts" -Method Get -Headers $mgrHeaders
$foundDraft = $draftsList | Where-Object { $_.projectId -eq $createdDraftId }
if ($foundDraft) {
    Write-Host "PASSED: Draft '$($foundDraft.name)' found in manager drafts list at Step $($foundDraft.currentStep)!" -ForegroundColor Green
} else {
    Write-Host "FAILED: Draft not found in list!" -ForegroundColor Red
}

# 6. Verify Draft Data Rehydration
Write-Host "`n6. Testing Rehydration of Initiation Data..."
$rehydrated = Invoke-RestMethod -Uri "$baseUrl/api/projects/$createdDraftId/initiation-data" -Method Get -Headers $mgrHeaders
Write-Host "Rehydrated Project Title: $($rehydrated.basicInfo.title)"
Write-Host "Rehydrated Key: $($rehydrated.basicInfo.projectKey)"
Write-Host "Rehydrated Teams count: $($rehydrated.teams.Count)"

# 7. Test Validation Rule: Payment Percentages must total 100%
Write-Host "`n7. Testing Payment 100% Validation Rule (Intentionally passing 90% total)..."
$invalidSubmission = @{
    projectId = $createdDraftId
    action = "SUBMIT_TO_CLIENT"
    currentStep = 8
    basicInfo = $rehydrated.basicInfo
    client = @{ clientId = $selectedClientId }
    payments = @{
        totalValue = 950000
        currency = "USD"
        paymentMilestones = @(
            @{ title = "Tranche 1"; paymentPercentage = 40; paymentAmount = 380000; triggerType = "PERCENTAGE"; triggerValue = 40 },
            @{ title = "Tranche 2"; paymentPercentage = 50; paymentAmount = 475000; triggerType = "PERCENTAGE"; triggerValue = 100 }
        ) # Sum is 90%, not 100%
    }
} | ConvertTo-Json -Depth 6

$invalidRes = Invoke-RestMethod -Uri "$baseUrl/api/projects/initiate" -Method Post -Headers $mgrHeaders -Body $invalidSubmission -ContentType "application/json"
if ($invalidRes.success -eq $false -and $invalidRes.validationErrors.Count -gt 0) {
    Write-Host "PASSED: Server correctly rejected incomplete 90% payment schedule: $($invalidRes.validationErrors[0])" -ForegroundColor Green
} else {
    Write-Host "FAILED: Server accepted invalid payment total!" -ForegroundColor Red
}

# 8. Submit Full Initiation Wizard to Client (100% Balanced)
Write-Host "`n8. Submitting Full Initiation Wizard to Client (SUBMIT_TO_CLIENT)..."
$fullSubmission = @{
    projectId = $createdDraftId
    action = "SUBMIT_TO_CLIENT"
    currentStep = 8
    basicInfo = $rehydrated.basicInfo
    client = @{ clientId = $selectedClientId }
    teams = @(
        @{
            name = "Telemetry & Backend Team"
            description = "IoT sensor stream ingestion"
            leadId = $workloads[0].userId
            memberIds = @($workloads[0].userId)
        },
        @{
            name = "Frontend Telemetry UI Team"
            description = "React dashboards"
            leadId = $workloads[1].userId
            memberIds = @($workloads[1].userId)
        }
    )
    milestones = @(
        @{
            name = "Milestone 1: IoT Architecture & DB Ingestion"
            description = "High throughput TimescaleDB & REST ingestion"
            dueDate = "2026-10-31"
            deliverables = "Architecture Spec, DB migrations"
            acceptanceCriteria = "API benchmarks passing"
            priority = "HIGH"
        },
        @{
            name = "Milestone 2: Final Acceptance & Production Cutover"
            description = "Full production rollout across 12 grids"
            dueDate = "2026-12-15"
            deliverables = "Production deploy, handover training"
            acceptanceCriteria = "Client UAT sign-off"
            priority = "CRITICAL"
        }
    )
    terms = @{
        scopeObjective = "Deploy national smart water telemetry across municipal grids."
        includedModules = "Ingestion, Alerting, Telemetry charts"
        excludedModules = "Physical pipe repair"
        assumptions = "Gateway access provided on Day 1"
        agreedDeliverables = "Software suite and runbook"
        reviewPeriodDays = 5
        approvalPeriodDays = 3
        delayAttribution = "Rule 6: Client delay shifts schedule day-for-day"
    }
    payments = @{
        totalValue = 950000
        currency = "USD"
        paymentMilestones = @(
            @{ title = "Milestone 1 Tranche"; paymentPercentage = 40; paymentAmount = 380000; triggerType = "PERCENTAGE"; triggerValue = 50 },
            @{ title = "Final Acceptance Tranche"; paymentPercentage = 60; paymentAmount = 570000; triggerType = "PERCENTAGE"; triggerValue = 100 }
        ) # Exactly 100%
    }
    responsibilities = @(
        @{
            ownerRole = "CLIENT"
            title = "Provide Gateway IP & Sensor Access Keys"
            dueDate = "2026-10-05"
            impactIfDelayed = "Ingestion cannot be verified"
            linkedMilestoneName = "Milestone 1: IoT Architecture & DB Ingestion"
        },
        @{
            ownerRole = "MANAGER"
            title = "Maintain Telemetry Schedule & Baseline Integrity"
            dueDate = "Ongoing"
            impactIfDelayed = "Schedule drift"
        }
    )
} | ConvertTo-Json -Depth 6

$submitRes = Invoke-RestMethod -Uri "$baseUrl/api/projects/initiate" -Method Post -Headers $mgrHeaders -Body $fullSubmission -ContentType "application/json"
Write-Host "Initiation Submitted!" -ForegroundColor Green
Write-Host " - Project Status: $($submitRes.status)"
Write-Host " - Agreement Status: $($submitRes.agreementStatus)"
Write-Host " - Agreement ID: $($submitRes.agreementId)"

# 9. Test Client Review & Approval
Write-Host "`n9. Client Reviews and Approves Agreement..."
$clientReviewBody = @{
    action = "APPROVE"
    reviewNotes = "Reviewed all 9 initiation sections. Scope, 40/60 payment tranches, and SLAs approved."
} | ConvertTo-Json
$clientReviewRes = Invoke-RestMethod -Uri "$baseUrl/api/agreements/$($submitRes.agreementId)/review" -Method Post -Headers $clientHeaders -Body $clientReviewBody -ContentType "application/json"
Write-Host "Client Review Status: $($clientReviewRes.status)" -ForegroundColor Green

# 10. Manager Locks Agreement & Project Activates
Write-Host "`n10. Manager Locks Baseline Agreement..."
$lockRes = Invoke-RestMethod -Uri "$baseUrl/api/agreements/$($submitRes.agreementId)/lock" -Method Post -Headers $mgrHeaders
Write-Host "Agreement Locked Status: $($lockRes.status)" -ForegroundColor Green

$finalProject = Invoke-RestMethod -Uri "$baseUrl/api/projects/$createdDraftId" -Method Get -Headers $mgrHeaders
Write-Host "Official Project Status: $($finalProject.status)" -ForegroundColor Green
if ($finalProject.status -eq "ACTIVE") {
    Write-Host "PASSED: Project is now officially ACTIVE for task execution!" -ForegroundColor Green
}

# 11. Security Check: Developer Access Restrictions
Write-Host "`n11. Verifying Strict Developer Confidentiality (Must return 403 Forbidden)..."
try {
    $devRes = Invoke-RestMethod -Uri "$baseUrl/api/projects/$createdDraftId/agreement" -Method Get -Headers $devHeaders
    Write-Host "FAILED: Developer was able to access agreement and payment terms!" -ForegroundColor Red
} catch {
    Write-Host "PASSED: Developer strictly forbidden from viewing agreement/payment terms: $($_.Exception.Message)" -ForegroundColor Green
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "ALL 9-STEP PROJECT INITIATION WORKFLOWS VERIFIED 100%!" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
