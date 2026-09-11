package com.platform;

import com.platform.entity.Project;
import com.platform.entity.RiskLevel;
import com.platform.entity.Task;
import com.platform.entity.User;
import com.platform.repository.ProjectRepository;
import com.platform.repository.RiskAssessmentRepository;
import com.platform.repository.TaskDependencyRepository;
import com.platform.repository.TaskRepository;
import com.platform.service.RiskEngineService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

public class RiskEngineTest {

    private TaskRepository taskRepository;
    private TaskDependencyRepository dependencyRepository;
    private RiskAssessmentRepository riskAssessmentRepository;
    private ProjectRepository projectRepository;
    private com.platform.service.NotificationService notificationService;
    private RiskEngineService riskEngineService;

    @BeforeEach
    public void setup() {
        taskRepository = Mockito.mock(TaskRepository.class);
        dependencyRepository = Mockito.mock(TaskDependencyRepository.class);
        riskAssessmentRepository = Mockito.mock(RiskAssessmentRepository.class);
        projectRepository = Mockito.mock(ProjectRepository.class);
        notificationService = Mockito.mock(com.platform.service.NotificationService.class);
        riskEngineService = new RiskEngineService(taskRepository, dependencyRepository, riskAssessmentRepository, projectRepository, notificationService);

        when(dependencyRepository.findBySuccessorTaskId(anyString())).thenReturn(Collections.emptyList());
    }


    @Test
    public void testCompletedTaskHasZeroRisk() {
        Task task = new Task();
        task.setStatus(Task.TaskStatus.COMPLETED);
        task.setProgress(100);

        RiskEngineService.TaskRiskResult result = riskEngineService.calculateTaskRisk(task);
        assertEquals(0, result.score);
        assertEquals(RiskLevel.LOW, result.level);
    }

    @Test
    public void testBlockedAndOverdueTaskHasHighRisk() {
        Task task = new Task();
        task.setId("t1");
        task.setStatus(Task.TaskStatus.BLOCKED);
        task.setBlocked(true);
        task.setBlockerReason("Awaiting network security clearance");
        task.setProgress(20);
        task.setStartDate(LocalDate.now().minusDays(10));
        task.setDueDate(LocalDate.now().minusDays(2)); // Overdue by 2 days

        RiskEngineService.TaskRiskResult result = riskEngineService.calculateTaskRisk(task);
        assertTrue(result.score > 60, "Score should be high risk (>60), was: " + result.score);
        assertEquals(RiskLevel.HIGH, result.level);
        assertFalse(result.explanation.isEmpty());
        assertTrue(result.blockerRisk > 90);
    }

    @Test
    public void testOnTrackTaskHasLowRisk() {
        User assignee = new User();
        assignee.setId("u1");
        assignee.setCapacityHoursPerWeek(40);

        Task task = new Task();
        task.setId("t2");
        task.setStatus(Task.TaskStatus.IN_PROGRESS);
        task.setBlocked(false);
        task.setProgress(80);
        task.setStartDate(LocalDate.now().minusDays(8));
        task.setDueDate(LocalDate.now().plusDays(10)); // Plenty of time
        task.setAssignee(assignee);
        task.setEstimatedHours(10);
        task.setActualHours(8);

        when(taskRepository.findByAssigneeId("u1")).thenReturn(Collections.singletonList(task));

        RiskEngineService.TaskRiskResult result = riskEngineService.calculateTaskRisk(task);
        assertTrue(result.score <= 30, "On-track task should be LOW risk (<=30), was: " + result.score);
        assertEquals(RiskLevel.LOW, result.level);
    }
}
