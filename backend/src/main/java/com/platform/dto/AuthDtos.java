package com.platform.dto;

import com.platform.entity.Role;
import com.platform.entity.User;

public class AuthDtos {

    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class LoginResponse {
        private String token;
        private String tokenType = "Bearer";
        private UserDto user;

        public LoginResponse(String token, UserDto user) {
            this.token = token;
            this.user = user;
        }

        public String getToken() { return token; }
        public String getTokenType() { return tokenType; }
        public UserDto getUser() { return user; }
    }

    public static class UserDto {
        private String id;
        private String email;
        private String fullName;
        private Role role;
        private String avatarUrl;
        private String title;
        private int capacityHoursPerWeek;

        public static UserDto fromEntity(User user) {
            UserDto dto = new UserDto();
            dto.id = user.getId();
            dto.email = user.getEmail();
            dto.fullName = user.getFullName();
            dto.role = user.getRole();
            dto.avatarUrl = user.getAvatarUrl();
            dto.title = user.getTitle();
            dto.capacityHoursPerWeek = user.getCapacityHoursPerWeek();
            return dto;
        }

        public String getId() { return id; }
        public String getEmail() { return email; }
        public String getFullName() { return fullName; }
        public Role getRole() { return role; }
        public String getAvatarUrl() { return avatarUrl; }
        public String getTitle() { return title; }
        public int getCapacityHoursPerWeek() { return capacityHoursPerWeek; }
    }

    public static class RegisterRequest {
        private String email;
        private String password;
        private String fullName;
        private Role role = Role.EMPLOYEE;
        private String title;
        private int capacityHoursPerWeek = 40;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public int getCapacityHoursPerWeek() { return capacityHoursPerWeek; }
        public void setCapacityHoursPerWeek(int capacityHoursPerWeek) { this.capacityHoursPerWeek = capacityHoursPerWeek; }
    }
}
