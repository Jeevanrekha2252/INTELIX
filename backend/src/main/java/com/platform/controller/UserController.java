package com.platform.controller;

import com.platform.dto.AuthDtos;
import com.platform.entity.User;
import com.platform.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<AuthDtos.UserDto>> getAllUsers() {
        List<AuthDtos.UserDto> users = userRepository.findByIsActiveTrue()
                .stream().map(AuthDtos.UserDto::fromEntity).toList();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<AuthDtos.UserDto>> getUsersByRole(@PathVariable String role) {
        com.platform.entity.Role r = com.platform.entity.Role.valueOf(role.toUpperCase());
        List<AuthDtos.UserDto> users = userRepository.findByRole(r)
                .stream().map(AuthDtos.UserDto::fromEntity).toList();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateUserStatus(@PathVariable String id, @RequestParam boolean active) {
        userRepository.findById(id).ifPresent(u -> {
            u.setActive(active);
            userRepository.save(u);
        });
        return ResponseEntity.ok().build();
    }
}
