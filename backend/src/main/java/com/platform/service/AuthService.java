package com.platform.service;

import com.platform.config.JwtTokenProvider;
import com.platform.dto.AuthDtos;
import com.platform.entity.Role;
import com.platform.entity.User;
import com.platform.exception.BadRequestException;
import com.platform.exception.ResourceNotFoundException;
import com.platform.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthDtos.LoginResponse login(AuthDtos.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new BadRequestException("User account is inactive");
        }

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return new AuthDtos.LoginResponse(token, AuthDtos.UserDto.fromEntity(user));
    }

    public AuthDtos.UserDto register(AuthDtos.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("Email already in use");
        }

        User user = new User();
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole(request.getRole() != null ? request.getRole() : Role.EMPLOYEE);
        user.setTitle(request.getTitle());
        user.setCapacityHoursPerWeek(request.getCapacityHoursPerWeek() > 0 ? request.getCapacityHoursPerWeek() : 40);

        User saved = userRepository.save(user);
        return AuthDtos.UserDto.fromEntity(saved);
    }

    public AuthDtos.UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        return AuthDtos.UserDto.fromEntity(user);
    }
}
