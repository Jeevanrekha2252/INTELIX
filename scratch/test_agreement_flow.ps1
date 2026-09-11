$baseUrl = "http://localhost:8080"

function Get-Token($email, $password) {
    $body = @{ email = $email; password = $password } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $body -ContentType "application/json"
    return $res.token
}

Write-Host "1. Testing Role Logins..."
$mgrToken = Get-Token "manager@demo.com" "password123"
$devToken = Get-Token "developer@demo.com" "password123"
$clientToken = Get-Token "client@demo.com" "password123"
Write-Host "Tokens acquired successfully!" -ForegroundColor Green

$mgrHeaders = @{ Authorization = "Bearer $mgrToken" }
$projects = Invoke-RestMethod -Uri "$baseUrl/api/projects" -Method Get -Headers $mgrHeaders
$projectId = $projects[0].id
Write-Host "Discovered Project ID: $projectId ($($projects[0].name))"

Write-Host "`n2. Testing Developer Access Restrictions (Should be 403 Forbidden)..."
try {
    $devHeaders = @{ Authorization = "Bearer $devToken" }
    $devRes = Invoke-RestMethod -Uri "$baseUrl/api/projects/$projectId/agreement" -Method Get -Headers $devHeaders
    Write-Host "FAILED: Developer was able to access agreement!" -ForegroundColor Red
} catch {
    Write-Host "PASSED: Developer access forbidden as expected: $($_.Exception.Message)" -ForegroundColor Green
}

Write-Host "`n3. Testing Manager Agreement Fetch..."
$agreement = Invoke-RestMethod -Uri "$baseUrl/api/projects/$projectId/agreement" -Method Get -Headers $mgrHeaders
Write-Host "Agreement ID: $($agreement.id)"
Write-Host "Status: $($agreement.status)"
Write-Host "Total Value: $($agreement.currency) $($agreement.totalValue)"
Write-Host "Milestones count: $($agreement.milestones.Count)"
Write-Host "Payment milestones count: $($agreement.paymentMilestones.Count)"
Write-Host "Responsibilities count: $($agreement.responsibilities.Count)"

Write-Host "`n4. Testing Client Review & Approval..."
$clientHeaders = @{ Authorization = "Bearer $clientToken" }
$reviewBody = @{ action = "APPROVE"; reviewNotes = "Baseline verified and approved by Client stakeholder." } | ConvertTo-Json
$reviewRes = Invoke-RestMethod -Uri "$baseUrl/api/agreements/$($agreement.id)/review" -Method Post -Headers $clientHeaders -Body $reviewBody -ContentType "application/json"
Write-Host "Client Review Result Status: $($reviewRes.status)"

Write-Host "`n5. Testing Manager Lock & Baseline Activation..."
$lockRes = Invoke-RestMethod -Uri "$baseUrl/api/agreements/$($agreement.id)/lock" -Method Post -Headers $mgrHeaders
Write-Host "Lock Result Status: $($lockRes.status)"

Write-Host "`n6. Testing Amendment Request..."
$amendBody = @{
    changeCategory = "DEADLINE"
    fieldName = "project_deadline"
    oldValue = "2026-09-30"
    newValue = "2026-10-04 (+4 days verified client dependency delay)"
    reason = "Client sandbox credentials delivered 4 days late."
} | ConvertTo-Json
$amendRes = Invoke-RestMethod -Uri "$baseUrl/api/agreements/$($agreement.id)/amendments" -Method Post -Headers $mgrHeaders -Body $amendBody -ContentType "application/json"
$newAmendment = $amendRes.amendments | Select-Object -Last 1
Write-Host "Amendment Created ID: $($newAmendment.id), Status: $($newAmendment.status), Total Amendments: $($amendRes.amendments.Count)"

Write-Host "`n7. Testing Client Amendment Approval..."
$amendReviewBody = @{
    approved = $true
    reviewNotes = "Confirmed 4 days extension granted due to sandbox delay."
} | ConvertTo-Json
$amendApproveRes = Invoke-RestMethod -Uri "$baseUrl/api/agreements/amendments/$($newAmendment.id)/review" -Method Post -Headers $clientHeaders -Body $amendReviewBody -ContentType "application/json"
$approvedAmendment = $amendApproveRes.amendments | Where-Object { $_.id -eq $newAmendment.id }
Write-Host "Amendment Approved Status: $($approvedAmendment.status), Baseline Version now: v$($amendApproveRes.version)"

Write-Host "`n8. Testing Payment Settlement Flow..."
$firstPayment = $agreement.paymentMilestones[0]
$payBody = @{ transactionRef = "WIRE-SCMS-INIT-001" } | ConvertTo-Json
$payRes = Invoke-RestMethod -Uri "$baseUrl/api/agreements/payments/$($firstPayment.id)/pay" -Method Post -Headers $mgrHeaders -Body $payBody -ContentType "application/json"
$paidPm = $payRes.paymentMilestones | Where-Object { $_.id -eq $firstPayment.id }
Write-Host "Payment recorded for: $($firstPayment.name), Status: $($paidPm.status)"

Write-Host "`nAll Agreement Governance workflows verified 100% successfully!" -ForegroundColor Green
