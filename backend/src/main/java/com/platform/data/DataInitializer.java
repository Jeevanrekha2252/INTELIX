package com.platform.data;

import com.platform.entity.*;
import com.platform.repository.*;
import com.platform.service.DependencyService;
import com.platform.service.MilestoneService;
import com.platform.service.RiskEngineService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final MilestoneRepository milestoneRepository;
    private final TaskRepository taskRepository;
    private final TaskDependencyRepository dependencyRepository;
    private final ChangeRequestRepository changeRequestRepository;
    private final DeliverableApprovalRepository approvalRepository;
    private final MeetingRepository meetingRepository;
    private final MeetingActionItemRepository actionItemRepository;
    private final ProjectDocumentRepository documentRepository;
    private final NotificationRepository notificationRepository;
    private final ActivityLogRepository activityLogRepository;
    private final GitCommitRepository gitCommitRepository;
    private final PasswordEncoder passwordEncoder;
    private final RiskEngineService riskEngineService;
    private final MilestoneService milestoneService;

    public DataInitializer(UserRepository userRepository,
                           ProjectRepository projectRepository,
                           TeamRepository teamRepository,
                           TeamMemberRepository teamMemberRepository,
                           MilestoneRepository milestoneRepository,
                           TaskRepository taskRepository,
                           TaskDependencyRepository dependencyRepository,
                           ChangeRequestRepository changeRequestRepository,
                           DeliverableApprovalRepository approvalRepository,
                           MeetingRepository meetingRepository,
                           MeetingActionItemRepository actionItemRepository,
                           ProjectDocumentRepository documentRepository,
                           NotificationRepository notificationRepository,
                           ActivityLogRepository activityLogRepository,
                           GitCommitRepository gitCommitRepository,
                           PasswordEncoder passwordEncoder,
                           RiskEngineService riskEngineService,
                           MilestoneService milestoneService) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.milestoneRepository = milestoneRepository;
        this.taskRepository = taskRepository;
        this.dependencyRepository = dependencyRepository;
        this.changeRequestRepository = changeRequestRepository;
        this.approvalRepository = approvalRepository;
        this.meetingRepository = meetingRepository;
        this.actionItemRepository = actionItemRepository;
        this.documentRepository = documentRepository;
        this.notificationRepository = notificationRepository;
        this.activityLogRepository = activityLogRepository;
        this.gitCommitRepository = gitCommitRepository;
        this.passwordEncoder = passwordEncoder;
        this.riskEngineService = riskEngineService;
        this.milestoneService = milestoneService;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Already initialized
        }

        System.out.println(">>> Initializing Platform Seed Data...");

        String devPassword = passwordEncoder.encode("password123");

        // 1. Users
        User admin = new User("admin@demo.com", devPassword, "System Administrator", Role.ADMIN, "Platform Administrator", 40);
        admin.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80");
        userRepository.save(admin);

        User manager = new User("manager@demo.com", devPassword, "Sarah Jenkins", Role.PROJECT_MANAGER, "Lead Project Manager", 40);
        manager.setAvatarUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80");
        userRepository.save(manager);

        User client = new User("client@demo.com", devPassword, "David Vance (Dean)", Role.CLIENT, "University Client Sponsor", 20);
        client.setAvatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80");
        userRepository.save(client);

        User dev1 = new User("developer@demo.com", devPassword, "Alex Chen", Role.EMPLOYEE, "Senior Backend Engineer", 40);
        dev1.setAvatarUrl("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80");
        userRepository.save(dev1);

        User dev2 = new User("frontend.dev@demo.com", devPassword, "Elena Rostova", Role.EMPLOYEE, "Frontend Architect", 40);
        dev2.setAvatarUrl("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80");
        userRepository.save(dev2);

        User dev3 = new User("qa.lead@demo.com", devPassword, "Marcus Brody", Role.EMPLOYEE, "QA & Security Engineer", 40);
        dev3.setAvatarUrl("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80");
        userRepository.save(dev3);

        User dev4 = new User("devops@demo.com", devPassword, "Priya Sharma", Role.EMPLOYEE, "DevOps & Cloud Engineer", 40);
        dev4.setAvatarUrl("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80");
        userRepository.save(dev4);

        User exec = new User("executive@demo.com", devPassword, "Chancellor Thorne", Role.EXECUTIVE, "VP Academic Operations", 10);
        exec.setAvatarUrl("https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80");
        userRepository.save(exec);

        // 2. Project
        LocalDate startDate = LocalDate.now().minusDays(25);
        LocalDate endDate = LocalDate.now().plusDays(15);

        Project project = new Project();
        project.setProjectKey("SCMS");
        project.setName("Smart Campus Management System");
        project.setDescription("Next-generation unified IoT and academic management platform connecting automated attendance, course registration, dynamic campus mapping, and fee processing into a single source of truth.");
        project.setClient(client);
        project.setProjectManager(manager);
        project.setStartDate(startDate);
        project.setEndDate(endDate);
        project.setStatus(Project.ProjectStatus.ACTIVE);
        project.setPriority(Project.Priority.CRITICAL);
        project.setOverallProgress(68);
        project.setHealthScore(64);
        project.setHealthStatus("AT_RISK");
        project.setRiskLevel(RiskLevel.HIGH);
        project.setPredictedCompletionDate(endDate.plusDays(4));
        projectRepository.save(project);

        // 3. Teams
        Team uiTeam = teamRepository.save(new Team(project.getId(), "UI/UX Design", "Interface design and user experience prototyping", manager));
        Team dbTeam = teamRepository.save(new Team(project.getId(), "Database Team", "High-performance PostgreSQL and partition clustering", dev1));
        Team beTeam = teamRepository.save(new Team(project.getId(), "Backend Team", "Spring Boot microservices, security and business workflows", dev1));
        Team feTeam = teamRepository.save(new Team(project.getId(), "Frontend Team", "React, TypeScript and responsive dashboards", dev2));
        Team qaTeam = teamRepository.save(new Team(project.getId(), "QA & Testing", "Automated E2E suites and penetration testing", dev3));
        Team opsTeam = teamRepository.save(new Team(project.getId(), "DevOps & Cloud", "Kubernetes cluster, CI/CD pipelines, and observability", dev4));

        teamMemberRepository.save(new TeamMember(dbTeam.getId(), dev1, "Lead DBA"));
        teamMemberRepository.save(new TeamMember(beTeam.getId(), dev1, "Backend Architect"));
        teamMemberRepository.save(new TeamMember(feTeam.getId(), dev2, "Frontend Lead"));
        teamMemberRepository.save(new TeamMember(qaTeam.getId(), dev3, "QA Lead"));
        teamMemberRepository.save(new TeamMember(opsTeam.getId(), dev4, "DevOps Lead"));

        // 4. Milestones
        Milestone m1 = milestoneRepository.save(new Milestone(project.getId(), "UI/UX & Architectural Blueprint", "Design systems, wireframes, and database ERD validation", startDate.plusDays(7), 1));
        m1.setProgress(100);
        m1.setStatus(Milestone.MilestoneStatus.COMPLETED);
        milestoneRepository.save(m1);

        Milestone m2 = milestoneRepository.save(new Milestone(project.getId(), "Database & Storage Layer", "PostgreSQL tables, indexing, migration scripts, and Redis caching", LocalDate.now().plusDays(2), 2));
        m2.setProgress(55);
        m2.setStatus(Milestone.MilestoneStatus.IN_PROGRESS);
        milestoneRepository.save(m2);

        Milestone m3 = milestoneRepository.save(new Milestone(project.getId(), "Core Backend Services & Auth", "REST APIs for students, faculty, courses, and Spring Security JWT", LocalDate.now().plusDays(7), 3));
        m3.setProgress(60);
        m3.setStatus(Milestone.MilestoneStatus.IN_PROGRESS);
        milestoneRepository.save(m3);

        Milestone m4 = milestoneRepository.save(new Milestone(project.getId(), "Frontend Application & Portals", "Responsive web portals for role-based execution and dashboards", LocalDate.now().plusDays(10), 4));
        m4.setProgress(45);
        m4.setStatus(Milestone.MilestoneStatus.IN_PROGRESS);
        milestoneRepository.save(m4);

        Milestone m5 = milestoneRepository.save(new Milestone(project.getId(), "Testing & Security Audit", "Integration tests, load testing, and OWASP vulnerability scans", LocalDate.now().plusDays(13), 5));
        m5.setProgress(10);
        m5.setStatus(Milestone.MilestoneStatus.PENDING);
        milestoneRepository.save(m5);

        Milestone m6 = milestoneRepository.save(new Milestone(project.getId(), "Production Cloud Deployment", "Kubernetes cluster provisioning, SSL setup, and production rollout", endDate, 6));
        m6.setProgress(0);
        m6.setStatus(Milestone.MilestoneStatus.PENDING);
        milestoneRepository.save(m6);

        // 5. Tasks (22 realistic tasks)
        // CRITICAL CHAIN: SCMS-101 -> SCMS-102 -> SCMS-103 -> SCMS-104 -> SCMS-105
        Task t101 = new Task();
        t101.setTaskKey("SCMS-101");
        t101.setProjectId(project.getId());
        t101.setMilestoneId(m2.getId());
        t101.setTeamId(dbTeam.getId());
        t101.setAssignee(dev1);
        t101.setTitle("Database Schema & Partitioning");
        t101.setDescription("Define relational tables, audit columns, foreign keys, and indexes for 50,000 students and course logs.");
        t101.setPriority(Task.Priority.HIGH);
        t101.setStatus(Task.TaskStatus.IN_PROGRESS);
        t101.setProgress(30); // KEY DEMO: 30% progress with 2 days to deadline!
        t101.setStartDate(startDate.plusDays(10));
        t101.setDueDate(LocalDate.now().plusDays(2));
        t101.setEstimatedHours(24.0);
        t101.setActualHours(12.0);
        t101.setRepository("smart-campus/database");
        t101.setBranchName("feature/schema-partitioning");
        t101.setPullRequestUrl("https://github.com/demo/smart-campus/pull/18");
        t101.setPrStatus("UNDER_REVIEW");
        t101.setCommitsCount(4);
        taskRepository.save(t101);

        Task t102 = new Task();
        t102.setTaskKey("SCMS-102");
        t102.setProjectId(project.getId());
        t102.setMilestoneId(m3.getId());
        t102.setTeamId(beTeam.getId());
        t102.setAssignee(dev1); // Note: dev1 is assigned multiple tasks, making them OVERLOADED!
        t102.setTitle("Core REST APIs & Authentication");
        t102.setDescription("Spring Security JWT authentication, user registration, role verification, and refresh token flow.");
        t102.setPriority(Task.Priority.CRITICAL);
        t102.setStatus(Task.TaskStatus.IN_PROGRESS);
        t102.setProgress(45);
        t102.setStartDate(startDate.plusDays(12));
        t102.setDueDate(LocalDate.now().plusDays(5));
        t102.setEstimatedHours(32.0);
        t102.setActualHours(16.0);
        t102.setRepository("smart-campus/backend");
        t102.setBranchName("feature/auth-services");
        t102.setPullRequestUrl("https://github.com/demo/smart-campus/pull/24");
        t102.setPrStatus("OPEN");
        t102.setCommitsCount(7);
        taskRepository.save(t102);

        Task t103 = new Task();
        t103.setTaskKey("SCMS-103");
        t103.setProjectId(project.getId());
        t103.setMilestoneId(m4.getId());
        t103.setTeamId(feTeam.getId());
        t103.setAssignee(dev2);
        t103.setTitle("Frontend Integration with Auth APIs");
        t103.setDescription("Integrate React token store, Axios interceptors, login modal, and protected dashboard routing.");
        t103.setPriority(Task.Priority.HIGH);
        t103.setStatus(Task.TaskStatus.TO_DO);
        t103.setProgress(10);
        t103.setStartDate(LocalDate.now());
        t103.setDueDate(LocalDate.now().plusDays(7));
        t103.setEstimatedHours(20.0);
        t103.setActualHours(2.0);
        t103.setRepository("smart-campus/frontend");
        t103.setBranchName("feature/auth-integration");
        t103.setCommitsCount(1);
        taskRepository.save(t103);

        Task t104 = new Task();
        t104.setTaskKey("SCMS-104");
        t104.setProjectId(project.getId());
        t104.setMilestoneId(m5.getId());
        t104.setTeamId(qaTeam.getId());
        t104.setAssignee(dev3);
        t104.setTitle("End-to-End Testing & Auth Security Scan");
        t104.setDescription("Cypress E2E test suites for student login, session timeout, and OWASP Top 10 penetration scanning.");
        t104.setPriority(Task.Priority.HIGH);
        t104.setStatus(Task.TaskStatus.BACKLOG);
        t104.setProgress(0);
        t104.setStartDate(LocalDate.now().plusDays(6));
        t104.setDueDate(LocalDate.now().plusDays(11));
        t104.setEstimatedHours(16.0);
        t104.setActualHours(0.0);
        taskRepository.save(t104);

        Task t105 = new Task();
        t105.setTaskKey("SCMS-105");
        t105.setProjectId(project.getId());
        t105.setMilestoneId(m6.getId());
        t105.setTeamId(opsTeam.getId());
        t105.setAssignee(dev4);
        t105.setTitle("Kubernetes Staging & Production Deployment");
        t105.setDescription("Deploy containerized services to multi-node EKS cluster with Helm charts and Ingress routing.");
        t105.setPriority(Task.Priority.CRITICAL);
        t105.setStatus(Task.TaskStatus.BACKLOG);
        t105.setProgress(0);
        t105.setStartDate(LocalDate.now().plusDays(10));
        t105.setDueDate(endDate);
        t105.setEstimatedHours(24.0);
        t105.setActualHours(0.0);
        taskRepository.save(t105);

        // Overloaded task for dev1 to trigger Workload Alert (>100% capacity)
        Task t106 = new Task();
        t106.setTaskKey("SCMS-106");
        t106.setProjectId(project.getId());
        t106.setMilestoneId(m3.getId());
        t106.setTeamId(beTeam.getId());
        t106.setAssignee(dev1);
        t106.setTitle("Attendance Webhook & Real-time Synchronization");
        t106.setDescription("Websocket pub/sub service to stream RFID attendance gates directly into teacher dashboards.");
        t106.setPriority(Task.Priority.HIGH);
        t106.setStatus(Task.TaskStatus.IN_PROGRESS);
        t106.setProgress(25);
        t106.setStartDate(startDate.plusDays(15));
        t106.setDueDate(LocalDate.now().plusDays(3));
        t106.setEstimatedHours(18.0);
        t106.setActualHours(5.0);
        taskRepository.save(t106);

        // Blocked Task with blocker reason
        Task t107 = new Task();
        t107.setTaskKey("SCMS-107");
        t107.setProjectId(project.getId());
        t107.setMilestoneId(m6.getId());
        t107.setTeamId(opsTeam.getId());
        t107.setAssignee(dev4);
        t107.setTitle("Campus Network VPC Peering & Firewall Rules");
        t107.setDescription("Configure cross-VPC peering connection between AWS cloud and internal university fiber network.");
        t107.setPriority(Task.Priority.HIGH);
        t107.setStatus(Task.TaskStatus.BLOCKED);
        t107.setProgress(15);
        t107.setStartDate(startDate.plusDays(18));
        t107.setDueDate(LocalDate.now().plusDays(4));
        t107.setEstimatedHours(14.0);
        t107.setActualHours(4.0);
        t107.setBlocked(true);
        t107.setBlockerReason("University IT NOC has not approved firewall ACL change request ticket #8841.");
        taskRepository.save(t107);

        // Completed Milestone 1 Tasks
        createSimpleTask("SCMS-108", project.getId(), m1.getId(), uiTeam.getId(), dev2, "Design System & Figma Component Library", Task.Priority.MEDIUM, Task.TaskStatus.COMPLETED, 100, 16.0, 16.0);
        createSimpleTask("SCMS-109", project.getId(), m1.getId(), uiTeam.getId(), dev2, "Student & Faculty UX User Journey Mapping", Task.Priority.MEDIUM, Task.TaskStatus.COMPLETED, 100, 12.0, 12.0);
        createSimpleTask("SCMS-110", project.getId(), m1.getId(), dbTeam.getId(), dev1, "Entity Relationship Architecture & Data Dictionary", Task.Priority.HIGH, Task.TaskStatus.COMPLETED, 100, 14.0, 14.0);

        // In Progress & Code Review Tasks
        createSimpleTask("SCMS-111", project.getId(), m2.getId(), dbTeam.getId(), dev1, "Flyway Database Migration Scripts & Seeding", Task.Priority.MEDIUM, Task.TaskStatus.CODE_REVIEW, 85, 10.0, 9.0);
        createSimpleTask("SCMS-112", project.getId(), m3.getId(), beTeam.getId(), dev1, "Course Registration & Prerequisite Validation Engine", Task.Priority.HIGH, Task.TaskStatus.IN_PROGRESS, 60, 22.0, 14.0);
        createSimpleTask("SCMS-113", project.getId(), m4.getId(), feTeam.getId(), dev2, "Student Timetable & Schedule Grid Component", Task.Priority.MEDIUM, Task.TaskStatus.IN_PROGRESS, 70, 18.0, 12.0);
        createSimpleTask("SCMS-114", project.getId(), m4.getId(), feTeam.getId(), dev2, "Interactive SVG Campus Map & Classroom Finder", Task.Priority.LOW, Task.TaskStatus.TO_DO, 20, 20.0, 4.0);
        createSimpleTask("SCMS-115", project.getId(), m3.getId(), beTeam.getId(), dev1, "Tuition Fee & Payment Gateway Integration", Task.Priority.HIGH, Task.TaskStatus.IN_PROGRESS, 40, 20.0, 8.0);
        createSimpleTask("SCMS-116", project.getId(), m5.getId(), qaTeam.getId(), dev3, "API Load Testing (2,000 Concurrent Requests)", Task.Priority.MEDIUM, Task.TaskStatus.TO_DO, 10, 12.0, 2.0);
        createSimpleTask("SCMS-117", project.getId(), m4.getId(), feTeam.getId(), dev2, "Dean & Executive Analytics Dashboard", Task.Priority.HIGH, Task.TaskStatus.IN_PROGRESS, 65, 16.0, 10.0);
        createSimpleTask("SCMS-118", project.getId(), m4.getId(), feTeam.getId(), dev2, "Mobile Responsive Layout & Dark Mode Polishing", Task.Priority.LOW, Task.TaskStatus.TO_DO, 0, 10.0, 0.0);
        createSimpleTask("SCMS-119", project.getId(), m5.getId(), qaTeam.getId(), dev3, "Cross-Browser Regression Testing", Task.Priority.LOW, Task.TaskStatus.BACKLOG, 0, 8.0, 0.0);
        createSimpleTask("SCMS-120", project.getId(), m6.getId(), opsTeam.getId(), dev4, "Prometheus & Grafana Health Monitoring Dashboards", Task.Priority.MEDIUM, Task.TaskStatus.IN_PROGRESS, 50, 12.0, 6.0);
        createSimpleTask("SCMS-121", project.getId(), m3.getId(), beTeam.getId(), dev1, "Push Notification & Email Dispatch Service", Task.Priority.LOW, Task.TaskStatus.COMPLETED, 100, 8.0, 7.5);
        createSimpleTask("SCMS-122", project.getId(), m2.getId(), dbTeam.getId(), dev1, "Redis Cache Layer for Course Catalog", Task.Priority.MEDIUM, Task.TaskStatus.COMPLETED, 100, 8.0, 8.0);

        // 6. Dependencies: FINISH_TO_START
        dependencyRepository.save(new TaskDependency(t101.getId(), t102.getId()));
        dependencyRepository.save(new TaskDependency(t102.getId(), t103.getId()));
        dependencyRepository.save(new TaskDependency(t103.getId(), t104.getId()));
        dependencyRepository.save(new TaskDependency(t104.getId(), t105.getId()));
        dependencyRepository.save(new TaskDependency(t101.getId(), t106.getId()));

        // 7. Git Commits Mock
        gitCommitRepository.save(new GitCommit(t101.getId(), "a1b2c3d", "feat: create migration V1__initial_schema.sql", dev1.getFullName(), "feature/schema-partitioning"));
        gitCommitRepository.save(new GitCommit(t101.getId(), "e4f5a6b", "perf: add b-tree index on student_id and semester_id", dev1.getFullName(), "feature/schema-partitioning"));
        gitCommitRepository.save(new GitCommit(t102.getId(), "c7d8e9f", "feat: implement JwtTokenProvider and SecurityFilterChain", dev1.getFullName(), "feature/auth-services"));
        gitCommitRepository.save(new GitCommit(t102.getId(), "1a2b3c4", "fix: resolve token expiration edge case", dev1.getFullName(), "feature/auth-services"));
        gitCommitRepository.save(new GitCommit(t103.getId(), "5e6f7a8", "feat: scaffold auth context and route guards", dev2.getFullName(), "feature/auth-integration"));

        // 8. Change Request (Client Persona)
        ChangeRequest cr = new ChangeRequest();
        cr.setCrKey("CR-SCMS-001");
        cr.setProjectId(project.getId());
        cr.setTitle("Biometric Facial Recognition Integration");
        cr.setDescription("Dean's office requests expanding the attendance module to support AI facial recognition cameras at lecture hall entrances in addition to standard RFID tap cards.");
        cr.setModule("Attendance Tracking");
        cr.setPriority(Task.Priority.HIGH);
        cr.setRequestedBy(client);
        cr.setStatus(ChangeRequest.ChangeRequestStatus.SUBMITTED);
        changeRequestRepository.save(cr);

        // 9. Deliverable Approval (Pending Client Decision)
        DeliverableApproval approval = new DeliverableApproval();
        approval.setProjectId(project.getId());
        approval.setDeliverableName("Mobile Attendance Module & RFID Tap Service");
        approval.setVersion("1.0-RC1");
        approval.setStatus(DeliverableApproval.ApprovalStatus.PENDING);
        approval.setMilestoneId(m3.getId());
        approval.setMilestoneName(m3.getName());
        approval.setComments("Ready for client sign-off. Test build installed on campus demo kiosk.");
        approvalRepository.save(approval);

        // 10. Meeting (Upcoming)
        Meeting meeting = new Meeting();
        meeting.setProjectId(project.getId());
        meeting.setTitle("Weekly Sprint Sync & Risk Mitigation Review");
        meeting.setOrganizer(manager);
        meeting.setScheduledAt(LocalDateTime.now().plusDays(1).withHour(14).withMinute(0));
        meeting.setDurationMinutes(45);
        meeting.setStatus(Meeting.MeetingStatus.SCHEDULED);
        meeting.setAgenda("1. Review Database Task delay impact\n2. Discuss Client CR-SCMS-001 Facial Recognition scope\n3. Unblock Campus VPC network peering\n4. Rebalance backend engineer workload");
        meeting.setNotes("Pre-meeting note: Sarah to present AI Copilot recommendations to university stakeholders.");
        Meeting savedMeeting = meetingRepository.save(meeting);

        actionItemRepository.save(new MeetingActionItem(savedMeeting.getId(), "Reallocate senior backend engineer to assist on SCMS-101", manager));
        actionItemRepository.save(new MeetingActionItem(savedMeeting.getId(), "Follow up with Campus IT director regarding firewall change ticket #8841", dev4));

        // 11. Project Document
        ProjectDocument doc1 = new ProjectDocument();
        doc1.setProjectId(project.getId());
        doc1.setFilename("SCMS_Architecture_Specification_v2.pdf");
        doc1.setFileSize(4194304);
        doc1.setContentType("application/pdf");
        doc1.setDescription("Complete microservices blueprint and data migration guide.");
        doc1.setUploadedBy(manager);
        doc1.setVersion("2.1");
        documentRepository.save(doc1);

        // 12. Notifications
        notificationRepository.save(new Notification(
                manager.getId(),
                "Critical Risk Alert: SCMS-101 Lagging",
                "Database Schema & Partitioning is at 30% progress with 2 days to deadline. Downstream APIs at risk.",
                Notification.Severity.CRITICAL,
                "RISK",
                "/projects/" + project.getId() + "/tasks"
        ));
        notificationRepository.save(new Notification(
                manager.getId(),
                "New Change Request from Client",
                "David Vance submitted CR-SCMS-001: Biometric Facial Recognition Integration",
                Notification.Severity.WARNING,
                "CHANGE_REQUEST",
                "/projects/" + project.getId() + "/change-requests"
        ));
        notificationRepository.save(new Notification(
                client.getId(),
                "Deliverable Ready for Sign-Off",
                "Mobile Attendance Module & RFID Tap Service v1.0-RC1 is waiting for your review and approval.",
                Notification.Severity.INFO,
                "APPROVAL",
                "/projects/" + project.getId() + "/approvals"
        ));
        notificationRepository.save(new Notification(
                dev1.getId(),
                "High Workload Warning",
                "You currently have 74 estimated hours assigned across active sprints (185% capacity).",
                Notification.Severity.WARNING,
                "TASK",
                "/projects/" + project.getId() + "/workload"
        ));

        // 13. Audit Trail Logs
        activityLogRepository.save(new ActivityLog(project.getId(), manager, "PROJECT_INITIALIZED", "PROJECT", project.getId(), null, project.getName(), "Smart Campus Management System chartered with 6 milestones"));
        activityLogRepository.save(new ActivityLog(project.getId(), client, "CHANGE_REQUEST_SUBMITTED", "CHANGE_REQUEST", cr.getId(), null, "CR-SCMS-001", "Client submitted change request for facial recognition"));
        activityLogRepository.save(new ActivityLog(project.getId(), dev4, "BLOCKER_REPORTED", "TASK", t107.getId(), null, "Campus IT NOC delay", "Reported firewall ACL blocker on SCMS-107"));
        activityLogRepository.save(new ActivityLog(project.getId(), dev1, "PROGRESS_UPDATED", "TASK", t101.getId(), "15%", "30%", "Updated database partitioning progress"));

        // Trigger Risk Calculation on all tasks
        riskEngineService.recalculateProjectRisks(project.getId());

        System.out.println(">>> Platform Seed Data Initialization Completed Successfully!");
    }

    private void createSimpleTask(String key, String projectId, String milestoneId, String teamId, User assignee,
                                  String title, Task.Priority priority, Task.TaskStatus status, int progress,
                                  double estimatedHours, double actualHours) {
        Task t = new Task();
        t.setTaskKey(key);
        t.setProjectId(projectId);
        t.setMilestoneId(milestoneId);
        t.setTeamId(teamId);
        t.setAssignee(assignee);
        t.setTitle(title);
        t.setPriority(priority);
        t.setStatus(status);
        t.setProgress(progress);
        t.setEstimatedHours(estimatedHours);
        t.setActualHours(actualHours);
        t.setStartDate(LocalDate.now().minusDays(10));
        t.setDueDate(LocalDate.now().plusDays(8));
        taskRepository.save(t);
    }
}
