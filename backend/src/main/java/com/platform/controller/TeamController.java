package com.platform.controller;

import com.platform.entity.Team;
import com.platform.entity.User;
import com.platform.service.TeamService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping
    public ResponseEntity<List<Team>> getTeams(@PathVariable String projectId) {
        return ResponseEntity.ok(teamService.getTeamsForProject(projectId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER', 'ADMIN')")
    public ResponseEntity<Team> createTeam(@PathVariable String projectId, @RequestBody Team team) {
        team.setProjectId(projectId);
        return ResponseEntity.ok(teamService.createTeam(team));
    }

    @GetMapping("/{teamId}/members")
    public ResponseEntity<List<User>> getTeamMembers(@PathVariable String projectId, @PathVariable String teamId) {
        return ResponseEntity.ok(teamService.getTeamMembers(teamId));
    }

    @PostMapping("/{teamId}/members")
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER', 'ADMIN')")
    public ResponseEntity<Void> addMember(@PathVariable String projectId, @PathVariable String teamId,
                                          @RequestParam String userId,
                                          @RequestParam(defaultValue = "MEMBER") String roleInTeam) {
        teamService.addMemberToTeam(teamId, userId, roleInTeam);
        return ResponseEntity.ok().build();
    }
}
