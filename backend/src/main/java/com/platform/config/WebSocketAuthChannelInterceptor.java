package com.platform.config;

import com.platform.entity.Project;
import com.platform.entity.Role;
import com.platform.entity.User;
import com.platform.repository.ProjectRepository;
import com.platform.repository.UserRepository;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.Collections;
import java.util.List;

@Component
public class WebSocketAuthChannelInterceptor implements ChannelInterceptor {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    public WebSocketAuthChannelInterceptor(JwtTokenProvider jwtTokenProvider,
                                          UserRepository userRepository,
                                          ProjectRepository projectRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor == null) {
            return message;
        }

        // 1. Authenticate on CONNECT frame
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");
            if (authHeader == null || authHeader.isBlank()) {
                authHeader = accessor.getFirstNativeHeader("token");
            }

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (jwtTokenProvider.validateToken(token)) {
                    String username = jwtTokenProvider.getUsernameFromToken(token);
                    User user = userRepository.findByEmail(username).orElse(null);

                    if (user != null) {
                        List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
                        );

                        // Attach authenticated StompPrincipal so Principal.getName() returns user.getId()
                        StompPrincipal stompPrincipal = new StompPrincipal(user);
                        UsernamePasswordAuthenticationToken auth =
                                new UsernamePasswordAuthenticationToken(stompPrincipal, null, authorities);
                        accessor.setUser(auth);
                    }
                }
            }
        }

        // 2. Authorize on SUBSCRIBE frame
        if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
            Principal principal = accessor.getUser();
            String destination = accessor.getDestination();

            if (destination != null && destination.startsWith("/topic/project/")) {
                String projectId = destination.substring("/topic/project/".length());
                // Strip sub-paths if any e.g. /topic/project/{projectId}/team
                if (projectId.contains("/")) {
                    projectId = projectId.substring(0, projectId.indexOf('/'));
                }

                User user = null;
                if (principal instanceof UsernamePasswordAuthenticationToken authToken) {
                    if (authToken.getPrincipal() instanceof StompPrincipal sp) {
                        user = sp.getUser();
                    } else if (authToken.getPrincipal() instanceof User u) {
                        user = u;
                    }
                } else if (principal instanceof StompPrincipal sp) {
                    user = sp.getUser();
                }

                if (user != null) {
                    // ADMIN has universal access
                    if (user.getRole() != Role.ADMIN) {
                        Project project = projectRepository.findById(projectId).orElse(null);
                        if (project != null) {
                            boolean isManager = project.getProjectManager() != null &&
                                    project.getProjectManager().getId().equals(user.getId());
                            boolean isClient = project.getClient() != null &&
                                    project.getClient().getId().equals(user.getId());

                            if (!isManager && !isClient) {
                                // Project membership check for employees
                            }
                        }
                    }
                } else {
                    throw new AccessDeniedException("Unauthenticated subscription attempt to: " + destination);
                }
            }
        }


        return message;
    }
}
