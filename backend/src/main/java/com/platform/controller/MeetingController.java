package com.platform.controller;

import com.platform.dto.PlatformDtos;
import com.platform.entity.Meeting;
import com.platform.entity.MeetingActionItem;
import com.platform.entity.Task;
import com.platform.entity.User;
import com.platform.service.MeetingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MeetingController {

    private final MeetingService meetingService;

    public MeetingController(MeetingService meetingService) {
        this.meetingService = meetingService;
    }

    @GetMapping("/api/projects/{projectId}/meetings")
    public ResponseEntity<List<Meeting>> getMeetings(@PathVariable String projectId) {
        return ResponseEntity.ok(meetingService.getMeetingsForProject(projectId));
    }

    @PostMapping("/api/projects/{projectId}/meetings")
    public ResponseEntity<Meeting> scheduleMeeting(@PathVariable String projectId,
                                                   @RequestBody PlatformDtos.MeetingCreate dto,
                                                   @AuthenticationPrincipal User user) {
        dto.setProjectId(projectId);
        return ResponseEntity.ok(meetingService.scheduleMeeting(dto, user));
    }

    @GetMapping("/api/meetings/{meetingId}/actions")
    public ResponseEntity<List<MeetingActionItem>> getActionItems(@PathVariable String meetingId) {
        return ResponseEntity.ok(meetingService.getActionItems(meetingId));
    }

    @PostMapping("/api/meetings/actions/{id}/convert-to-task")
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER', 'ADMIN')")
    public ResponseEntity<Task> convertActionToTask(@PathVariable String id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(meetingService.convertActionItemToTask(id, user));
    }
}
