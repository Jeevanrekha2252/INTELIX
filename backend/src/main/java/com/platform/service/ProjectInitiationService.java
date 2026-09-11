package com.platform.service;

import com.platform.dto.AuthDtos;
import com.platform.dto.ProjectInitiationDtos.*;
import com.platform.entity.*;
import com.platform.exception.ResourceNotFoundException;
import com.platform.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class ProjectInitiationService {

    private static final Logger log = LoggerFactory.getLogger(ProjectInitiationService.class);

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final MilestoneRepository milestoneRepository;
    private final TaskRepository taskRepository;
    private final TaskDependencyRepository taskDependencyRepository;
    private final ProjectAgreementRepository agreementRepository;
    private final AgreementMilestoneRepository agreementMilestoneRepository;
    private final PaymentMilestoneRepository paymentMilestoneRepository;
    private final AgreementResponsibilityRepository responsibilityRepository;
    private final NotificationService notificationService;
    private final AuditService auditService;
    private final PasswordEncoder passwordEncoder;

    public ProjectInitiationService(
            ProjectRepository projectRepository,
            UserRepository userRepository,
            TeamRepository teamRepository,
            TeamMemberRepository teamMemberRepository,
            MilestoneRepository milestoneRepository,
            TaskRepository taskRepository,
            TaskDependencyRepository taskDependencyRepository,
            ProjectAgreementRepository agreementRepository,
            AgreementMilestoneRepository agreementMilestoneRepository,
            PaymentMilestoneRepository paymentMilestoneRepository,
            AgreementResponsibilityRepository responsibilityRepository,
            NotificationService notificationService,
            AuditService auditService,
            PasswordEncoder passwordEncoder) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.milestoneRepository = milestoneRepository;
        this.taskRepository = taskRepository;
        this.taskDependencyRepository = taskDependencyRepository;
        this.agreementRepository = agreementRepository;
        this.agreementMilestoneRepository = agreementMilestoneRepository;
        this.paymentMilestoneRepository = paymentMilestoneRepository;
        this.responsibilityRepository = responsibilityRepository;
        this.notificationService = notificationService;
        this.auditService = auditService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public ProjectInitiationResponse saveOrSubmitProject(ProjectInitiationRequest req, User currentUser) {
        ProjectInitiationResponse resp = new ProjectInitiationResponse();
        boolean isSubmit = "SUBMIT_TO_CLIENT".equalsIgnoreCase(req.action);

        // Validation if submitting for client review
        if (isSubmit) {
            validateSubmission(req, resp);
            if (!resp.validationErrors.isEmpty()) {
                resp.success = false;
                resp.message = "Validation failed: please complete all mandatory initiation fields.";
                return resp;
            }
        }

        // 1. Resolve or Create Project Entity
        Project project;
        if (req.projectId != null && !req.projectId.trim().isEmpty()) {
            project = projectRepository.findById(req.projectId)
                    .orElse(new Project());
        } else {
            project = new Project();
            project.setId(UUID.randomUUID().toString());
        }

        // Basic Info mapping
        String title = req.basicInfo != null && req.basicInfo.title != null ? req.basicInfo.title.trim() : "Untitled Initiative";
        String key = req.basicInfo != null && req.basicInfo.projectKey != null && !req.basicInfo.projectKey.trim().isEmpty()
                ? req.basicInfo.projectKey.trim().toUpperCase()
                : "PRJ-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        // Ensure key uniqueness if new or changed
        if (project.getProjectKey() == null || !project.getProjectKey().equalsIgnoreCase(key)) {
            if (projectRepository.existsByProjectKey(key)) {
                key = key + "-" + UUID.randomUUID().toString().substring(0, 3).toUpperCase();
            }
        }

        project.setName(title);
        project.setProjectKey(key);
        project.setDescription(req.basicInfo != null ? req.basicInfo.description : "");
        project.setProjectObjective(req.basicInfo != null ? req.basicInfo.projectObjective : "");
        project.setCategory(req.basicInfo != null && req.basicInfo.category != null ? req.basicInfo.category : "General");
        project.setProjectType(req.basicInfo != null && req.basicInfo.projectType != null ? req.basicInfo.projectType : "Fixed Price");
        project.setTimezone(req.basicInfo != null && req.basicInfo.timezone != null ? req.basicInfo.timezone : "UTC+05:30");
        project.setPriority(req.basicInfo != null && req.basicInfo.priority != null ? req.basicInfo.priority : Project.Priority.MEDIUM);
        project.setStartDate(req.basicInfo != null && req.basicInfo.startDate != null ? req.basicInfo.startDate : LocalDate.now());
        project.setEndDate(req.basicInfo != null && req.basicInfo.endDate != null ? req.basicInfo.endDate : LocalDate.now().plusMonths(3));
        project.setTags(req.basicInfo != null ? req.basicInfo.tags : "");
        project.setCurrentWizardStep(Math.max(1, req.currentStep));
        project.setProjectManager(currentUser);

        if (req.payments != null && req.payments.totalValue != null) {
            project.setBudget(req.payments.totalValue.doubleValue());
        } else if (req.basicInfo != null && req.basicInfo.budget != null) {
            project.setBudget(req.basicInfo.budget);
        }

        // 2. Client Assignment or Creation
        if (req.client != null) {
            if (req.client.clientId != null && !req.client.clientId.trim().isEmpty()) {
                userRepository.findById(req.client.clientId).ifPresent(project::setClient);
            } else if (req.client.email != null && !req.client.email.trim().isEmpty()) {
                // Find by email or create new client user
                User client = userRepository.findByEmail(req.client.email).orElseGet(() -> {
                    User newClient = new User();
                    newClient.setEmail(req.client.email.trim().toLowerCase());
                    newClient.setPassword(passwordEncoder.encode("password123"));
                    newClient.setFullName(req.client.name != null && !req.client.name.trim().isEmpty() ? req.client.name : "Enterprise Client");
                    newClient.setRole(Role.CLIENT);
                    newClient.setTitle(req.client.designation != null && !req.client.designation.trim().isEmpty()
                            ? req.client.designation + " (" + req.client.organization + ")"
                            : (req.client.organization != null ? req.client.organization : "Client Stakeholder"));
                    return userRepository.save(newClient);
                });
                project.setClient(client);
            }
        }

        // Project Status assignment
        if (isSubmit) {
            project.setStatus(Project.ProjectStatus.AGREEMENT_PENDING);
        } else {
            project.setStatus(Project.ProjectStatus.DRAFT_SETUP);
        }

        Project savedProject = projectRepository.save(project);

        // 3. Teams & Team Members Setup
        if (req.teams != null && !req.teams.isEmpty()) {
            for (InitiationTeamInfo tInfo : req.teams) {
                if (tInfo.name == null || tInfo.name.trim().isEmpty()) continue;
                User lead = null;
                if (tInfo.leadId != null && !tInfo.leadId.trim().isEmpty()) {
                    lead = userRepository.findById(tInfo.leadId).orElse(null);
                }
                Team team = new Team(savedProject.getId(), tInfo.name.trim(), tInfo.description, lead);
                if (tInfo.id != null && !tInfo.id.startsWith("temp-")) {
                    team.setId(tInfo.id);
                }
                Team savedTeam = teamRepository.save(team);

                // Add members
                if (tInfo.memberIds != null) {
                    for (String memberId : tInfo.memberIds) {
                        userRepository.findById(memberId).ifPresent(u -> {
                            TeamMember tm = new TeamMember(savedTeam.getId(), u, "MEMBER");
                            teamMemberRepository.save(tm);
                        });
                    }
                }
            }
        }

        // 4. Milestones Setup
        Map<String, Milestone> createdMilestoneMap = new HashMap<>();
        if (req.milestones != null && !req.milestones.isEmpty()) {
            int order = 1;
            for (InitiationMilestoneInfo mInfo : req.milestones) {
                if (mInfo.name == null || mInfo.name.trim().isEmpty()) continue;
                Milestone m = new Milestone();
                m.setProjectId(savedProject.getId());
                m.setName(mInfo.name.trim());
                m.setDescription(mInfo.description);
                m.setDueDate(mInfo.dueDate != null ? mInfo.dueDate : savedProject.getEndDate());
                m.setOrderIndex(order++);
                m.setDeliverables(mInfo.deliverables);
                m.setAcceptanceCriteria(mInfo.acceptanceCriteria);
                m.setPriority(mInfo.priority != null ? mInfo.priority : "HIGH");
                Milestone savedM = milestoneRepository.save(m);
                createdMilestoneMap.put(savedM.getName().toLowerCase(), savedM);
            }
        }

        // 5. Initial Tasks Setup
        if (req.tasks != null && !req.tasks.isEmpty()) {
            List<Task> createdTasks = new ArrayList<>();
            int taskIndex = 1;
            for (InitiationTaskInfo tInfo : req.tasks) {
                if (tInfo.title == null || tInfo.title.trim().isEmpty()) continue;
                Task task = new Task();
                task.setProjectId(savedProject.getId());
                task.setTaskKey(savedProject.getProjectKey() + "-" + taskIndex++);
                task.setTitle(tInfo.title.trim());
                task.setDescription(tInfo.description);
                task.setPriority(tInfo.priority != null ? tInfo.priority : Task.Priority.MEDIUM);
                task.setStartDate(tInfo.startDate != null ? tInfo.startDate : savedProject.getStartDate());
                task.setDueDate(tInfo.dueDate != null ? tInfo.dueDate : savedProject.getEndDate());
                task.setEstimatedHours(tInfo.estimatedHours > 0 ? tInfo.estimatedHours : 8.0);
                task.setStatus(Task.TaskStatus.TO_DO);

                if (tInfo.assigneeId != null && !tInfo.assigneeId.trim().isEmpty()) {
                    userRepository.findById(tInfo.assigneeId).ifPresent(task::setAssignee);
                }

                Task savedTask = taskRepository.save(task);
                createdTasks.add(savedTask);

                // Check finish-to-start dependency if predecessor index provided
                if (tInfo.predecessorIndex != null && tInfo.predecessorIndex >= 0 && tInfo.predecessorIndex < createdTasks.size() - 1) {
                    Task predecessor = createdTasks.get(tInfo.predecessorIndex);
                    taskDependencyRepository.save(new TaskDependency(predecessor.getId(), savedTask.getId()));
                }
            }
        }

        // 6. Project Agreement Baseline Setup
        ProjectAgreement agreement = agreementRepository.findByProjectId(savedProject.getId())
                .orElse(new ProjectAgreement());

        if (agreement.getId() == null) {
            agreement.setId("ag-" + UUID.randomUUID().toString().substring(0, 8));
            agreement.setProject(savedProject);
            agreement.setCreatedBy(currentUser);
            agreement.setCreatedAt(LocalDateTime.now());
        }

        BigDecimal totalVal = req.payments != null && req.payments.totalValue != null
                ? req.payments.totalValue
                : (savedProject.getBudget() != null ? BigDecimal.valueOf(savedProject.getBudget()) : BigDecimal.valueOf(10000));

        agreement.setTotalValue(totalVal);
        agreement.setCurrency(req.payments != null && req.payments.currency != null ? req.payments.currency : "USD");
        agreement.setBaselineStartDate(savedProject.getStartDate());
        agreement.setBaselineEndDate(savedProject.getEndDate());
        agreement.setCurrentForecastEndDate(savedProject.getEndDate());
        agreement.setReviewPeriodDays(req.terms != null && req.terms.reviewPeriodDays > 0 ? req.terms.reviewPeriodDays : 5);
        agreement.setApprovalPeriodDays(req.terms != null && req.terms.approvalPeriodDays > 0 ? req.terms.approvalPeriodDays : 3);
        agreement.setDelayAttribution(req.terms != null && req.terms.delayAttribution != null ? req.terms.delayAttribution : "None");
        agreement.setScopeObjective(req.terms != null ? req.terms.scopeObjective : savedProject.getDescription());
        agreement.setIncludedModules(req.terms != null ? req.terms.includedModules : "");
        agreement.setExcludedModules(req.terms != null ? req.terms.excludedModules : "");
        agreement.setAssumptions(req.terms != null ? req.terms.assumptions : "");
        agreement.setAgreedDeliverables(req.terms != null ? req.terms.agreedDeliverables : "");

        if (isSubmit) {
            agreement.setStatus(ProjectAgreement.AgreementStatus.SENT_TO_CLIENT);
            agreement.setApprovedByManager(currentUser);
        } else {
            agreement.setStatus(ProjectAgreement.AgreementStatus.DRAFT);
        }
        agreement.setUpdatedAt(LocalDateTime.now());

        ProjectAgreement savedAgreement = agreementRepository.save(agreement);

        // 7. Agreement Milestones Sync
        agreementMilestoneRepository.deleteByAgreementId(savedAgreement.getId());
        if (req.milestones != null && !req.milestones.isEmpty()) {
            for (InitiationMilestoneInfo mInfo : req.milestones) {
                if (mInfo.name == null || mInfo.name.trim().isEmpty()) continue;
                AgreementMilestone am = new AgreementMilestone();
                am.setId("agm-" + UUID.randomUUID().toString().substring(0, 8));
                am.setAgreement(savedAgreement);
                am.setName(mInfo.name.trim());
                am.setDescription(mInfo.description);
                am.setTargetDate(mInfo.dueDate != null ? mInfo.dueDate : savedProject.getEndDate());
                am.setDeliverables(mInfo.deliverables);
                am.setAcceptanceCriteria(mInfo.acceptanceCriteria);
                am.setCompletionRequirement("100% test coverage & stakeholder demo");
                if (createdMilestoneMap.containsKey(mInfo.name.trim().toLowerCase())) {
                    am.setMilestone(createdMilestoneMap.get(mInfo.name.trim().toLowerCase()));
                }
                agreementMilestoneRepository.save(am);
            }
        }

        // 8. Payment Milestones Sync
        paymentMilestoneRepository.deleteAll(paymentMilestoneRepository.findByAgreementIdOrderByCreatedAtAsc(savedAgreement.getId()));
        if (req.payments != null && req.payments.paymentMilestones != null && !req.payments.paymentMilestones.isEmpty()) {
            for (InitiationPaymentMilestoneInfo pmInfo : req.payments.paymentMilestones) {
                if (pmInfo.title == null || pmInfo.title.trim().isEmpty()) continue;
                PaymentMilestone pm = new PaymentMilestone();
                pm.setId("pay-" + UUID.randomUUID().toString().substring(0, 8));
                pm.setAgreement(savedAgreement);
                pm.setTitle(pmInfo.title.trim());
                pm.setTriggerType(pmInfo.triggerType != null ? pmInfo.triggerType : PaymentMilestone.TriggerType.PERCENTAGE);
                pm.setTriggerValue(pmInfo.triggerValue);
                pm.setPaymentPercentage(pmInfo.paymentPercentage != null ? pmInfo.paymentPercentage : BigDecimal.ZERO);
                pm.setPaymentAmount(pmInfo.paymentAmount != null ? pmInfo.paymentAmount : BigDecimal.ZERO);
                pm.setTargetDate(parseDateOrDefault(pmInfo.dueDate, savedProject.getEndDate()));
                pm.setNotes(pmInfo.notes);
                pm.setStatus(PaymentMilestone.PaymentStatus.PENDING);
                paymentMilestoneRepository.save(pm);
            }
        }

        // 9. Agreement Responsibilities Sync
        responsibilityRepository.deleteAll(responsibilityRepository.findByAgreementId(savedAgreement.getId()));
        if (req.responsibilities != null && !req.responsibilities.isEmpty()) {
            for (InitiationResponsibilityInfo rInfo : req.responsibilities) {
                if (rInfo.title == null || rInfo.title.trim().isEmpty()) continue;
                AgreementResponsibility agResp = new AgreementResponsibility();
                agResp.setId("resp-" + UUID.randomUUID().toString().substring(0, 8));
                agResp.setAgreement(savedAgreement);
                agResp.setTitle(rInfo.title.trim());
                agResp.setDescription(rInfo.description);
                agResp.setOwnerRole(rInfo.ownerRole != null ? rInfo.ownerRole : AgreementResponsibility.OwnerRole.CLIENT);
                agResp.setOwnerName(rInfo.ownerName);
                agResp.setDueDate(parseDateOrDefault(rInfo.dueDate, savedProject.getEndDate()));
                agResp.setImpactIfDelayed(rInfo.impactIfDelayed);
                agResp.setLinkedMilestone(rInfo.linkedMilestoneName);
                agResp.setStatus(rInfo.status != null ? rInfo.status : AgreementResponsibility.ResponsibilityStatus.PENDING);
                responsibilityRepository.save(agResp);
            }
        }

        // 10. Audit Logging & Real-time Notifications
        if (isSubmit) {
            auditService.log(savedProject.getId(), currentUser, "AGREEMENT_SUBMITTED_FOR_REVIEW", "PROJECT", savedProject.getId(), null, null,
                    "Project initiated and sent to client for agreement review.");

            if (savedProject.getClient() != null) {
                notificationService.sendToUser(
                        savedProject.getClient().getId(),
                        NotificationType.AGREEMENT_SENT_TO_CLIENT,
                        "New Project Agreement Requires Your Review",
                        String.format("Manager %s has submitted the project baseline terms and agreement for '%s' for your review.",
                                currentUser.getFullName(), savedProject.getName()),
                        Notification.Severity.HIGH,
                        savedProject.getId(),
                        "AGREEMENT",
                        savedAgreement.getId(),
                        "/projects/" + savedProject.getId() + "/agreement",
                        Map.of("projectKey", savedProject.getProjectKey(), "projectName", savedProject.getName())
                );
            }

            notificationService.publishProjectEvent(savedProject.getId(), "AGREEMENT_SUBMITTED", "PROJECT", savedProject.getId(),
                    Map.of("status", "AGREEMENT_PENDING", "agreementId", savedAgreement.getId()));
        } else {
            auditService.log(savedProject.getId(), currentUser, "PROJECT_DRAFT_SAVED", "PROJECT", savedProject.getId(), null, null,
                    "Manager saved project creation draft at step " + req.currentStep);
        }

        // Build Response
        resp.success = true;
        resp.projectId = savedProject.getId();
        resp.projectKey = savedProject.getProjectKey();
        resp.name = savedProject.getName();
        resp.status = savedProject.getStatus().name();
        resp.agreementId = savedAgreement.getId();
        resp.agreementStatus = savedAgreement.getStatus().name();
        resp.currentStep = savedProject.getCurrentWizardStep();
        resp.message = isSubmit
                ? "Initiation complete! Agreement submitted to client for formal review."
                : "Draft successfully saved. You can resume anytime.";

        return resp;
    }

    private void validateSubmission(ProjectInitiationRequest req, ProjectInitiationResponse resp) {
        if (req.basicInfo == null || req.basicInfo.title == null || req.basicInfo.title.trim().isEmpty()) {
            resp.validationErrors.add("Project Title is required.");
        }
        if (req.basicInfo == null || req.basicInfo.startDate == null) {
            resp.validationErrors.add("Start Date is required.");
        }
        if (req.basicInfo == null || req.basicInfo.endDate == null) {
            resp.validationErrors.add("Target End Date is required.");
        }
        if (req.basicInfo != null && req.basicInfo.startDate != null && req.basicInfo.endDate != null) {
            if (req.basicInfo.endDate.isBefore(req.basicInfo.startDate)) {
                resp.validationErrors.add("Target End Date cannot be before Start Date.");
            }
        }
        if (req.client == null || ((req.client.clientId == null || req.client.clientId.trim().isEmpty())
                && (req.client.email == null || req.client.email.trim().isEmpty()))) {
            resp.validationErrors.add("Client assignment is mandatory before submitting for review.");
        }

        // Payment milestone validation: must sum to 100%
        if (req.payments != null && req.payments.paymentMilestones != null && !req.payments.paymentMilestones.isEmpty()) {
            BigDecimal totalPct = BigDecimal.ZERO;
            for (InitiationPaymentMilestoneInfo pm : req.payments.paymentMilestones) {
                if (pm.paymentPercentage != null) {
                    totalPct = totalPct.add(pm.paymentPercentage);
                }
            }
            if (totalPct.compareTo(BigDecimal.valueOf(99.9)) < 0 || totalPct.compareTo(BigDecimal.valueOf(100.1)) > 0) {
                resp.validationErrors.add(String.format("Payment percentages must sum exactly to 100%% (current sum: %s%%).", totalPct.toPlainString()));
            }
        }
    }

    @Transactional(readOnly = true)
    public List<InitiationDraftSummary> getDraftsForManager(User manager) {
        List<Project> drafts;
        if (manager.getRole() == Role.ADMIN) {
            drafts = projectRepository.findAll().stream()
                    .filter(p -> p.getStatus() == Project.ProjectStatus.DRAFT_SETUP)
                    .toList();
        } else {
            drafts = projectRepository.findByProjectManagerIdAndStatus(manager.getId(), Project.ProjectStatus.DRAFT_SETUP);
        }

        List<InitiationDraftSummary> list = new ArrayList<>();
        for (Project p : drafts) {
            InitiationDraftSummary s = new InitiationDraftSummary();
            s.projectId = p.getId();
            s.projectKey = p.getProjectKey();
            s.name = p.getName();
            s.description = p.getDescription();
            s.currentStep = p.getCurrentWizardStep();
            s.status = p.getStatus().name();
            s.clientName = p.getClient() != null ? p.getClient().getFullName() : "Not Selected";
            s.budget = p.getBudget();
            s.updatedAt = p.getUpdatedAt();
            list.add(s);
        }
        return list;
    }

    @Transactional(readOnly = true)
    public ProjectInitiationRequest getInitiationData(String projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        ProjectInitiationRequest req = new ProjectInitiationRequest();
        req.projectId = project.getId();
        req.currentStep = project.getCurrentWizardStep();
        req.action = project.getStatus() == Project.ProjectStatus.AGREEMENT_PENDING ? "SUBMIT_TO_CLIENT" : "SAVE_DRAFT";

        // 1. Basic Info
        req.basicInfo.title = project.getName();
        req.basicInfo.projectKey = project.getProjectKey();
        req.basicInfo.description = project.getDescription();
        req.basicInfo.projectObjective = project.getProjectObjective();
        req.basicInfo.category = project.getCategory();
        req.basicInfo.projectType = project.getProjectType();
        req.basicInfo.timezone = project.getTimezone();
        req.basicInfo.startDate = project.getStartDate();
        req.basicInfo.endDate = project.getEndDate();
        req.basicInfo.priority = project.getPriority();
        req.basicInfo.budget = project.getBudget();
        req.basicInfo.tags = project.getTags();

        // 2. Client
        if (project.getClient() != null) {
            User c = project.getClient();
            req.client.clientId = c.getId();
            req.client.name = c.getFullName();
            req.client.email = c.getEmail();
            req.client.designation = c.getTitle();
            req.client.organization = c.getTitle();
        }

        // 3. Teams
        List<Team> teams = teamRepository.findByProjectId(projectId);
        for (Team t : teams) {
            InitiationTeamInfo tInfo = new InitiationTeamInfo();
            tInfo.id = t.getId();
            tInfo.name = t.getName();
            tInfo.description = t.getDescription();
            tInfo.leadId = t.getLead() != null ? t.getLead().getId() : null;
            List<TeamMember> members = teamMemberRepository.findByTeamId(t.getId());
            tInfo.memberIds = members.stream().map(m -> m.getUser().getId()).toList();
            req.teams.add(tInfo);
        }

        // 4. Milestones
        List<Milestone> milestones = milestoneRepository.findByProjectIdOrderByOrderIndexAsc(projectId);
        for (Milestone m : milestones) {
            InitiationMilestoneInfo mInfo = new InitiationMilestoneInfo();
            mInfo.id = m.getId();
            mInfo.name = m.getName();
            mInfo.description = m.getDescription();
            mInfo.dueDate = m.getDueDate();
            mInfo.deliverables = m.getDeliverables();
            mInfo.acceptanceCriteria = m.getAcceptanceCriteria();
            mInfo.priority = m.getPriority();
            mInfo.orderIndex = m.getOrderIndex();
            req.milestones.add(mInfo);
        }

        // 5. Tasks
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        for (Task t : tasks) {
            InitiationTaskInfo tInfo = new InitiationTaskInfo();
            tInfo.id = t.getId();
            tInfo.title = t.getTitle();
            tInfo.description = t.getDescription();
            tInfo.assigneeId = t.getAssignee() != null ? t.getAssignee().getId() : null;
            tInfo.priority = t.getPriority();
            tInfo.startDate = t.getStartDate();
            tInfo.dueDate = t.getDueDate();
            tInfo.estimatedHours = t.getEstimatedHours();
            req.tasks.add(tInfo);
        }

        // 6. Agreement terms, payments, responsibilities
        Optional<ProjectAgreement> agOpt = agreementRepository.findByProjectId(projectId);
        if (agOpt.isPresent()) {
            ProjectAgreement ag = agOpt.get();
            req.terms.scopeObjective = ag.getScopeObjective();
            req.terms.includedModules = ag.getIncludedModules();
            req.terms.excludedModules = ag.getExcludedModules();
            req.terms.assumptions = ag.getAssumptions();
            req.terms.agreedDeliverables = ag.getAgreedDeliverables();
            req.terms.reviewPeriodDays = ag.getReviewPeriodDays();
            req.terms.approvalPeriodDays = ag.getApprovalPeriodDays();
            req.terms.delayAttribution = ag.getDelayAttribution();

            req.payments.totalValue = ag.getTotalValue();
            req.payments.currency = ag.getCurrency();

            List<PaymentMilestone> pms = paymentMilestoneRepository.findByAgreementIdOrderByCreatedAtAsc(ag.getId());
            for (PaymentMilestone pm : pms) {
                InitiationPaymentMilestoneInfo pmInfo = new InitiationPaymentMilestoneInfo();
                pmInfo.id = pm.getId();
                pmInfo.title = pm.getTitle();
                pmInfo.triggerType = pm.getTriggerType();
                pmInfo.triggerValue = pm.getTriggerValue();
                pmInfo.paymentPercentage = pm.getPaymentPercentage();
                pmInfo.paymentAmount = pm.getPaymentAmount();
                pmInfo.dueDate = pm.getTargetDate() != null ? pm.getTargetDate().toString() : null;
                pmInfo.notes = pm.getNotes();
                pmInfo.status = pm.getStatus().name();
                req.payments.paymentMilestones.add(pmInfo);
            }

            List<AgreementResponsibility> resps = responsibilityRepository.findByAgreementId(ag.getId());
            for (AgreementResponsibility r : resps) {
                InitiationResponsibilityInfo rInfo = new InitiationResponsibilityInfo();
                rInfo.id = r.getId();
                rInfo.title = r.getTitle();
                rInfo.description = r.getDescription();
                rInfo.ownerRole = r.getOwnerRole();
                rInfo.ownerName = r.getOwnerName();
                rInfo.dueDate = r.getDueDate() != null ? r.getDueDate().toString() : "Ongoing";
                rInfo.impactIfDelayed = r.getImpactIfDelayed();
                rInfo.linkedMilestoneName = r.getLinkedMilestone();
                rInfo.status = r.getStatus();
                req.responsibilities.add(rInfo);
            }
        }

        return req;
    }

    @Transactional(readOnly = true)
    public List<EmployeeWorkloadDTO> getEmployeesWithWorkload() {
        List<User> employees = userRepository.findByIsActiveTrue().stream()
                .filter(u -> u.getRole() == Role.EMPLOYEE || u.getRole() == Role.PROJECT_MANAGER)
                .toList();

        List<Task> allActiveTasks = taskRepository.findAll().stream()
                .filter(t -> t.getStatus() != Task.TaskStatus.COMPLETED && t.getStatus() != Task.TaskStatus.DONE)
                .toList();

        List<EmployeeWorkloadDTO> dtoList = new ArrayList<>();

        for (User u : employees) {
            EmployeeWorkloadDTO dto = new EmployeeWorkloadDTO();
            dto.userId = u.getId();
            dto.fullName = u.getFullName();
            dto.email = u.getEmail();
            dto.avatarUrl = u.getAvatarUrl();
            dto.title = u.getTitle() != null ? u.getTitle() : "Software Engineer";
            dto.role = u.getRole().name();
            dto.department = u.getTitle() != null ? u.getTitle().split(" ")[0] : "Engineering";
            dto.capacityHoursPerWeek = u.getCapacityHoursPerWeek() > 0 ? u.getCapacityHoursPerWeek() : 40;

            List<Task> userTasks = allActiveTasks.stream()
                    .filter(t -> t.getAssignee() != null && t.getAssignee().getId().equals(u.getId()))
                    .toList();

            dto.activeTasksCount = userTasks.size();
            dto.estimatedHours = Math.round(userTasks.stream().mapToDouble(Task::getEstimatedHours).sum() * 10.0) / 10.0;

            int pct = (int) Math.round((dto.estimatedHours / dto.capacityHoursPerWeek) * 100.0);
            dto.currentWorkloadPercentage = pct;

            if (pct < 60) {
                dto.workloadStatus = "UNDERUTILIZED";
            } else if (pct <= 85) {
                dto.workloadStatus = "HEALTHY";
            } else if (pct <= 100) {
                dto.workloadStatus = "HIGH";
            } else {
                dto.workloadStatus = "OVERLOADED";
            }

            Set<String> projectIds = new HashSet<>();
            for (Task t : userTasks) {
                if (t.getProjectId() != null) projectIds.add(t.getProjectId());
            }
            for (String pid : projectIds) {
                projectRepository.findById(pid).ifPresent(p -> dto.activeProjects.add(p.getName()));
            }

            dtoList.add(dto);
        }

        return dtoList;
    }

    @Transactional
    public AuthDtos.UserDto createClientUser(InitiationClientInfo info) {
        if (info.email == null || info.email.trim().isEmpty()) {
            throw new IllegalArgumentException("Client email is required");
        }
        String email = info.email.trim().toLowerCase();
        Optional<User> existing = userRepository.findByEmail(email);
        if (existing.isPresent()) {
            return AuthDtos.UserDto.fromEntity(existing.get());
        }

        User client = new User();
        client.setEmail(email);
        client.setPassword(passwordEncoder.encode("password123"));
        client.setFullName(info.name != null && !info.name.trim().isEmpty() ? info.name.trim() : "Client Stakeholder");
        client.setRole(Role.CLIENT);
        client.setTitle(info.organization != null && !info.organization.trim().isEmpty()
                ? (info.designation != null ? info.designation + " (" + info.organization + ")" : info.organization)
                : "Enterprise Client");
        User saved = userRepository.save(client);
        return AuthDtos.UserDto.fromEntity(saved);
    }

    private LocalDate parseDateOrDefault(String dateStr, LocalDate defaultDate) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return defaultDate;
        }
        try {
            return LocalDate.parse(dateStr.trim());
        } catch (Exception e) {
            return defaultDate;
        }
    }
}
