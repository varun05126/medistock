package com.medistock.config;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.medistock.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;

    private final Long id;
    private final String name;
    private final String username;
    private final String email;
    @JsonIgnore
    private final String password;
    private final Long supplierId;
    private final String roleName;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(Long id, String name, String username, String email, String password, Long supplierId, String roleName, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
        this.supplierId = supplierId;
        this.roleName = roleName;
        this.authorities = authorities;
    }

    public static UserDetailsImpl build(User user) {
        String roleStr = user.getRole() != null ? user.getRole().getName() : "STAFF";
        String normalizedRole = roleStr.startsWith("ROLE_") ? roleStr : "ROLE_" + roleStr;
        List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(normalizedRole));

        Long supId = user.getSupplier() != null ? user.getSupplier().getId() : null;

        return new UserDetailsImpl(
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getEmail(),
                user.getPassword(),
                supId,
                roleStr,
                authorities);
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public String getRoleName() {
        return roleName;
    }

    @Override
    public String getUsername() {
        return username != null ? username : email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
