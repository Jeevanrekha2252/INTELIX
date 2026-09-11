package com.platform.config;

import com.platform.entity.Role;
import com.platform.entity.User;

import java.security.Principal;

public class StompPrincipal implements Principal {

    private final String userId;
    private final User user;

    public StompPrincipal(User user) {
        this.userId = user.getId();
        this.user = user;
    }

    @Override
    public String getName() {
        return userId;
    }

    public String getUserId() {
        return userId;
    }

    public User getUser() {
        return user;
    }

    public Role getRole() {
        return user != null ? user.getRole() : null;
    }
}
