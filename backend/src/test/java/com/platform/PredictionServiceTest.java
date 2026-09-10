package com.platform;

import com.platform.dto.PlatformDtos;
import com.platform.entity.Project;
import com.platform.entity.Task;
import com.platform.repository.ProjectRepository;
import com.platform.repository.TaskRepository;
import com.platform.service.PredictionService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

public class PredictionServiceTest {

    @Test
    public void testPredictiveCompletionCalculatesDelay() {
        ProjectRepository projectRepository = Mockito.mock(ProjectRepository.class);
        TaskRepository taskRepository = Mockito.mock(TaskRepository.class);
        PredictionService predictionService = new PredictionService(projectRepository, taskRepository);

        Project project = new Project();
        project.setId("p1");
        project.setStartDate(LocalDate.now().minusDays(20));
        project.setEndDate(LocalDate.now().plusDays(5));
        project.setOverallProgress(50);

        when(projectRepository.findById("p1")).thenReturn(Optional.of(project));

        Task t1 = new Task();
        t1.setStatus(Task.TaskStatus.IN_PROGRESS);
        t1.setProgress(20);
        t1.setEstimatedHours(40);
        t1.setActualHours(10);
        t1.setDueDate(LocalDate.now().plusDays(2));

        when(taskRepository.findByProjectId("p1")).thenReturn(List.of(t1));

        PlatformDtos.PredictionDTO prediction = predictionService.calculateProjectPrediction("p1");
        assertNotNull(prediction);
        assertNotNull(prediction.getPredictedCompletionDate());
        assertTrue(prediction.getRemainingEffortHours() > 0);
        assertTrue(prediction.getCurrentVelocity() > 0);
    }
}
