package com.platform.service;

import com.platform.entity.Team;
import com.platform.entity.TeamMember;
import com.platform.entity.User;
import com.platform.exception.ResourceNotFoundException;
import com.platform.repository.TeamMemberRepository;
import com.platform.repository.TeamRepository;
import com.platform.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;

    public TeamService(TeamRepository teamRepository, TeamMemberRepository teamMemberRepository, UserRepository userRepository) {
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.userRepository = userRepository;
    }

    public List<Team> getTeamsForProject(String projectId) {
        return teamRepository.findByProjectId(projectId);
    }

    public List<User> getTeamMembers(String teamId) {
        List<TeamMember> members = teamMemberRepository.findByTeamId(teamId);
        return members.stream().map(TeamMember::getUser).toList();
    }

    @Transactional
    public Team createTeam(Team team) {
        return teamRepository.save(team);
    }

    @Transactional
    public void addMemberToTeam(String teamId, String userId, String roleInTeam) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        TeamMember member = new TeamMember(teamId, user, roleInTeam);
        teamMemberRepository.save(member);
    }
}
