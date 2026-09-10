package com.platform.controller;

import com.platform.dto.TaskDtos;
import com.platform.entity.Task;
import com.platform.entity.User;
import com.platform.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/api/projects/{projectId}/tasks")
    public ResponseEntity<List<Task>> getProjectTasks(@PathVariable String projectId) {
        return ResponseEntity.ok(taskService.getTasksForProject(projectId));
    }

    @GetMapping("/api/tasks/my")
    public ResponseEntity<List<Task>> getMyTasks(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(taskService.getTasksForUser(user.getId()));
    }

    @GetMapping("/api/tasks/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable String id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @PostMapping("/api/projects/{projectId}/tasks")
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER', 'ADMIN')")
    public ResponseEntity<Task> createTask(@PathVariable String projectId,
                                           @RequestBody TaskDtos.CreateTaskRequest request,
                                           @AuthenticationPrincipal User user) {
        request.setProjectId(projectId);
        return ResponseEntity.ok(taskService.createTask(request, user));
    }

    @PutMapping("/api/tasks/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable String id,
                                           @RequestBody TaskDtos.UpdateTaskRequest request,
                                           @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(taskService.updateTask(id, request, user));
    }

    @PatchMapping("/api/tasks/{id}/progress")
    public ResponseEntity<Task> updateProgress(@PathVariable String id,
                                               @RequestBody TaskDtos.ProgressUpdateRequest request,
                                               @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(taskService.updateProgress(id, request, user));
    }

    @PatchMapping("/api/tasks/{id}/status")
    public ResponseEntity<Task> updateStatus(@PathVariable String id,
                                             @RequestBody TaskDtos.StatusUpdateRequest request,
                                             @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(taskService.updateStatus(id, request, user));
    }

    @PostMapping("/api/tasks/{id}/blocker")
    public ResponseEntity<Task> reportBlocker(@PathVariable String id,
                                              @RequestBody TaskDtos.BlockerReportRequest request,
                                              @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(taskService.reportBlocker(id, request, user));
    }
}
