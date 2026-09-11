$baseUrl = "http://localhost:8080"
$body = @{ email = "manager@demo.com"; password = "password123" } | ConvertTo-Json
$token = (Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $body -ContentType "application/json").token
$headers = @{ Authorization = "Bearer $token" }

$fullSubmission = @{
    action = "SUBMIT_TO_CLIENT"
    currentStep = 8
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
    client = @{ email = "client@demo.com" }
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
        )
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

$payload = $fullSubmission

try {
    $res = Invoke-RestMethod -Uri "$baseUrl/api/projects/initiate" -Method Post -Headers $headers -Body $payload -ContentType "application/json"
    Write-Host "Success:" ($res | ConvertTo-Json)
} catch {
    Write-Host "Exception:" $_.Exception.Message
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Host "Response Body:" $reader.ReadToEnd()
    }
}
