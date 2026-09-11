package com.platform;

import com.platform.dto.RealtimeEvent;
import com.platform.dto.TaskDtos;
import com.platform.entity.*;
import com.platform.repository.*;
import com.platform.service.NotificationService;
import com.platform.service.RiskEngineService;
import com.platform.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class RealtimeNotificationTest {

    private NotificationRepository notificationRepository;
    private NotificationPreferenceRepository preferenceRepository;
    private SimpMessagingTemplate messagingTemplate;
    private ProjectRepository projectRepository;
    private UserRepository userRepository;
    private TeamRepository teamRepository;
    private TeamMemberRepository teamMemberRepository;
    private NotificationService notificationService;

    @BeforeEach
    public void setup() {
        notificationRepository = mock(NotificationRepository.class);
        preferenceRepository = mock(NotificationPreferenceRepository.class);
        messagingTemplate = mock(SimpMessagingTemplate.class);
        projectRepository = mock(ProjectRepository.class);
        userRepository = mock(UserRepository.class);
        teamRepository = mock(TeamRepository.class);
        teamMemberRepository = mock(TeamMemberRepository.class);

        notificationService = new NotificationService(
                notificationRepository,
                preferenceRepository,
                messagingTemplate,
                projectRepository,
                userRepository,
                teamRepository,
                teamMemberRepository
        );

        when(notificationRepository.save(any(Notification.class))).thenAnswer(i -> {
            Notification n = i.getArgument(0);
            if (n.getId() == null) n.setId("notif-uuid-123");
            return n;
        });
        when(notificationRepository.countByUserIdAndIsReadFalse(anyString())).thenReturn(5L);
    }

    @Test
    public void testSendToUserPersistsAndPushesSTOMPEvent() {
        Notification result = notificationService.sendToUser(
                "user-1",
                NotificationType.TASK_ASSIGNED,
                "New Task Assigned",
                "You have been assigned to API Refactoring",
                Notification.Severity.INFO,
                "proj-1",
                "TASK",
                "task-1",
                "/tasks/task-1",
                Collections.singletonMap("taskKey", "INT-101")
        );

        assertNotNull(result);
        assertEquals("user-1", result.getUserId());
        assertEquals("TASK_ASSIGNED", result.getType());
        verify(notificationRepository, times(1)).save(any(Notification.class));

        // Verify WebSocket push to user queue: /user/user-1/queue/notifications
        verify(messagingTemplate, times(1)).convertAndSendToUser(
                eq("user-1"),
                eq("/queue/notifications"),
                any(RealtimeEvent.class)
        );

        // Verify badge count update: /user/user-1/queue/unread-count
        verify(messagingTemplate, times(1)).convertAndSendToUser(
                eq("user-1"),
                eq("/queue/unread-count"),
                anyMap()
        );
    }

    @Test
    public void testNotificationPreferencesFiltersDelivery() {
        NotificationPreference pref = new NotificationPreference("user-muted");
        pref.setTasksEnabled(false); // Task notifications disabled
        when(preferenceRepository.findByUserId("user-muted")).thenReturn(Optional.of(pref));

        notificationService.sendToUser(
                "user-muted",
                NotificationType.TASK_ASSIGNED,
                "Task Assigned",
                "Muted task",
                Notification.Severity.INFO,
                "proj-1",
                "TASK",
                "task-1",
                "/tasks/task-1",
                null
        );

        // Persisted in DB for offline/audit history
        verify(notificationRepository, times(1)).save(any(Notification.class));

        // Skipped STOMP push because tasks are muted
        verify(messagingTemplate, never()).convertAndSendToUser(
                eq("user-muted"),
                eq("/queue/notifications"),
                any()
        );
    }

    @Test
    public void testCriticalNotificationBypassesPreferences() {
        NotificationPreference pref = new NotificationPreference("user-muted");
        pref.setTasksEnabled(false);
        when(preferenceRepository.findByUserId("user-muted")).thenReturn(Optional.of(pref));

        // Critical blocker report
        notificationService.sendToUser(
                "user-muted",
                NotificationType.BLOCKER_REPORTED,
                "Critical Blocker",
                "Urgent blocker reported",
                Notification.Severity.CRITICAL,
                "proj-1",
                "TASK",
                "task-1",
                "/tasks/task-1",
                null
        );

        // Mandatory delivery for CRITICAL notifications
        verify(messagingTemplate, times(1)).convertAndSendToUser(
                eq("user-muted"),
                eq("/queue/notifications"),
                any(RealtimeEvent.class)
        );
    }

    @Test
    public void testPublishProjectEventBroadcastsToTopic() {
        notificationService.publishProjectEvent(
                "proj-100",
                "TASK_UPDATED",
                "TASK",
                "task-55",
                Collections.singletonMap("status", "COMPLETED")
        );

        verify(messagingTemplate, times(1)).convertAndSend(
                eq("/topic/project/proj-100"),
                any(RealtimeEvent.class)
        );
    }

    @Test
    public void testRiskEngineThresholdTransitionAlertsManager() {
        TaskRepository taskRepo = mock(TaskRepository.class);
        TaskDependencyRepository depRepo = mock(TaskDependencyRepository.class);
        RiskAssessmentRepository riskRepo = mock(RiskAssessmentRepository.class);

        User manager = new User();
        manager.setId("pm-1");
        Project project = new Project();
        project.setId("proj-1");
        project.setProjectManager(manager);
        project.setRiskLevel(RiskLevel.LOW);
        project.setHealthStatus("HEALTHY");

        Task task = new Task();
        task.setId("t-blocked");
        task.setTaskKey("INT-999");
        task.setTitle("Critical DB Migration");
        task.setProjectId("proj-1");
        task.setStatus(Task.TaskStatus.BLOCKED);
        task.setBlocked(true);
        task.setBlockerReason("DB crashed");
        task.setStartDate(LocalDate.now().minusDays(5));
        task.setDueDate(LocalDate.now().minusDays(1)); // Overdue
        task.setRiskLevel(RiskLevel.LOW); // Previous level LOW

        when(taskRepo.findByProjectId("proj-1")).thenReturn(Collections.singletonList(task));
        when(projectRepository.findById("proj-1")).thenReturn(Optional.of(project));
        when(depRepo.findBySuccessorTaskId(anyString())).thenReturn(Collections.emptyList());

        RiskEngineService riskEngineService = new RiskEngineService(
                taskRepo, depRepo, riskRepo, projectRepository, notificationService
        );

        riskEngineService.recalculateProjectRisks("proj-1");

        // PM should receive high risk alert notification
        verify(notificationRepository, atLeastOnce()).save(any(Notification.class));
        // Project topic receives real-time telemetry
        verify(messagingTemplate, atLeastOnce()).convertAndSend(
                eq("/topic/project/proj-1"),
                any(RealtimeEvent.class)
        );
    }

}
