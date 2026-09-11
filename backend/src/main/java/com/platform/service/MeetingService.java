package com.platform.service;

import com.platform.dto.PlatformDtos;
import com.platform.dto.TaskDtos;
import com.platform.entity.*;
import com.platform.exception.ResourceNotFoundException;
import com.platform.repository.MeetingActionItemRepository;
import com.platform.repository.MeetingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MeetingService {

    private final MeetingRepository meetingRepository;
    private final MeetingActionItemRepository actionItemRepository;
    private final TaskService taskService;
    private final AuditService auditService;
    private final NotificationService notificationService;

    public MeetingService(MeetingRepository meetingRepository,
                          MeetingActionItemRepository actionItemRepository,
                          TaskService taskService,
                          AuditService auditService,
                          NotificationService notificationService) {
        this.meetingRepository = meetingRepository;
        this.actionItemRepository = actionItemRepository;
        this.taskService = taskService;
        this.auditService = auditService;
        this.notificationService = notificationService;
    }

    public List<Meeting> getMeetingsForProject(String projectId) {
        return meetingRepository.findByProjectIdOrderByScheduledAtAsc(projectId);
    }

    public List<MeetingActionItem> getActionItems(String meetingId) {
        return actionItemRepository.findByMeetingId(meetingId);
    }

    @Transactional
    public Meeting scheduleMeeting(PlatformDtos.MeetingCreate dto, User organizer) {
        Meeting m = new Meeting();
        m.setProjectId(dto.getProjectId());
        m.setTitle(dto.getTitle());
        m.setScheduledAt(dto.getScheduledAt());
        m.setDurationMinutes(dto.getDurationMinutes());
        m.setAgenda(dto.getAgenda());
        m.setOrganizer(organizer);
        m.setStatus(Meeting.MeetingStatus.SCHEDULED);

        Meeting saved = meetingRepository.save(m);
        auditService.log(dto.getProjectId(), organizer, "MEETING_SCHEDULED", "MEETING", saved.getId(),
                null, saved.getTitle(), "Scheduled meeting: " + saved.getTitle());

        notificationService.sendToProjectMembers(
                dto.getProjectId(),
                com.platform.entity.NotificationType.MEETING_SCHEDULED,
                "New Meeting: " + saved.getTitle(),
                String.format("Meeting scheduled for %s (%d mins)", saved.getScheduledAt(), saved.getDurationMinutes()),
                com.platform.entity.Notification.Severity.INFO,
                "MEETING",
                saved.getId(),
                "/projects/" + dto.getProjectId() + "/meetings",
                java.util.Map.of("meetingId", saved.getId(), "scheduledAt", saved.getScheduledAt().toString())
        );

        notificationService.sendToClient(
                dto.getProjectId(),
                com.platform.entity.NotificationType.MEETING_SCHEDULED,
                "Project Meeting Scheduled: " + saved.getTitle(),
                String.format("Meeting scheduled for %s with project team", saved.getScheduledAt()),
                com.platform.entity.Notification.Severity.INFO,
                "MEETING",
                saved.getId(),
                "/projects/" + dto.getProjectId() + "/meetings",
                java.util.Map.of("meetingId", saved.getId(), "scheduledAt", saved.getScheduledAt().toString())
        );

        notificationService.publishProjectEvent(dto.getProjectId(), "MEETING_SCHEDULED", "MEETING", saved.getId(), saved);

        return saved;
    }


    @Transactional
    public Task convertActionItemToTask(String actionItemId, User manager) {
        MeetingActionItem item = actionItemRepository.findById(actionItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Action item not found: " + actionItemId));

        Meeting meeting = meetingRepository.findById(item.getMeetingId()).orElseThrow();

        TaskDtos.CreateTaskRequest tr = new TaskDtos.CreateTaskRequest();
        tr.setProjectId(meeting.getProjectId());
        tr.setTitle("[Action Item] " + item.getDescription());
        tr.setDescription("Action item originating from meeting: " + meeting.getTitle());
        tr.setPriority(Task.Priority.MEDIUM);
        tr.setStatus(Task.TaskStatus.TO_DO);
        tr.setEstimatedHours(8.0);
        if (item.getAssignee() != null) {
            tr.setAssigneeId(item.getAssignee().getId());
        }

        Task task = taskService.createTask(tr, manager);
        item.setConvertedToTask(true);
        item.setConvertedTaskId(task.getId());
        actionItemRepository.save(item);

        return task;
    }
}
